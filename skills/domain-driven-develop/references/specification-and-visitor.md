# Specification And Visitor

Use this reference when creating reusable business predicates, selection specs, mutation specs, composite specs, visitor-based SQL/API translation, or when repository methods are starting to grow `findBy...` variants.

## Specification Rule

A specification is a named business predicate or mutation intent. It should be reusable, composable, testable, and expressed in domain language.

Specifications are part of the domain model. A single spec captures one meaningful business rule, and composed specs capture larger business logic. Do not reduce specs to transport DTOs or optional persistence filter bags.

Avoid "god specs" that collect many optional parameters into one object. If a lookup can be narrowed by request id, resource id, hostname, and path, model those as separate specs and compose them. The composition is the business logic; a visitor translates the resulting spec tree.

Use a specification when:

- the same rule gates multiple use cases;
- the rule must be composed with `and`, `or`, or `not`;
- the rule must run in memory and be translated by adapters;
- the repository would otherwise need business-specific `findBy...` methods.

Avoid a specification when the rule is a one-off branch inside one application service or belongs directly inside an aggregate method.

## When Not To Use A Specification

Do not introduce a specification just because:

- a repository needs one more filter;
- a request DTO has many optional fields;
- the codebase already has a spec interface;
- the real decision about aggregate ownership is unclear.

Prefer another construct when:

- the invariant belongs directly in an aggregate method;
- the behavior coordinates multiple repositories or external systems;
- the object mostly describes paging, sorting, includes, caching, or transport concerns;
- the rule is too ad-hoc to deserve a named domain concept.

## Composite Specs

Prefer composable specs and named presets over repository business methods.

```ts
export interface OrderSelectionSpec {
  isSatisfiedBy(candidate: Order): boolean;
  accept<TResult>(visitor: OrderSelectionSpecVisitor<TResult>): TResult;

  and(other: OrderSelectionSpec): OrderSelectionSpec;
  or(other: OrderSelectionSpec): OrderSelectionSpec;
  not(): OrderSelectionSpec;
}

export class OrderNumberSpec extends BaseOrderSelectionSpec {
  private constructor(public readonly orderNumber: OrderNumber) {
    super();
  }

  static create(orderNumber: OrderNumber): OrderNumberSpec {
    return new OrderNumberSpec(orderNumber);
  }

  isSatisfiedBy(candidate: Order): boolean {
    return candidate.orderNumber().equals(this.orderNumber);
  }

  accept<TResult>(visitor: OrderSelectionSpecVisitor<TResult>): TResult {
    return visitor.visitOrderNumber(this);
  }
}

export class PaymentReferenceSpec extends BaseOrderSelectionSpec {
  private constructor(public readonly paymentReference: PaymentReference) {
    super();
  }

  static create(paymentReference: PaymentReference): PaymentReferenceSpec {
    return new PaymentReferenceSpec(paymentReference);
  }

  isSatisfiedBy(candidate: Order): boolean {
    return candidate.hasPaymentReference(this.paymentReference);
  }

  accept<TResult>(visitor: OrderSelectionSpecVisitor<TResult>): TResult {
    return visitor.visitPaymentReference(this);
  }
}

export class OrderLookupSpec {
  static byOrderNumberOrPaymentReference(
    orderNumber: OrderNumber,
    paymentReference: PaymentReference,
  ): OrderSelectionSpec {
    return OrderNumberSpec.create(orderNumber).or(PaymentReferenceSpec.create(paymentReference));
  }
}
```

This keeps business language in the domain/application boundary:

```ts
const order = await orders.findOne(
  context,
  OrderLookupSpec.byOrderNumberOrPaymentReference(orderNumber, paymentReference),
);
```

Avoid:

```ts
orders.findByOrderNumberOrPaymentReference(orderNumber.value, paymentReference.value);
```

The repository should not need to understand that "order number or payment reference" is a business lookup rule. It should translate the spec it receives.

Composition is business language. If `A.or(B).and(C)` has a domain meaning, name the preset or builder method so application services can select the rule without explaining storage details.

## Builder With Explicit Grouping

When a spec tree becomes non-trivial, use a builder or preset factory so grouping is impossible to misread.

```ts
const spec = OrderSpecs.create()
  .inPaymentStatus(PaymentStatus.pending())
  .andGroup((group) =>
    group
      .withCaptureWindow(PaymentCaptureWindow.open())
      .or()
      .withPaymentRetryAllowed(),
  )
  .not((group) => group.withPaymentStatus(PaymentStatus.captured()))
  .build();
```

The intent is:

- payment status is pending;
- and capture window is open or retry is allowed;
- and payment is not already captured.

Avoid mixing raw `and` and `or` calls where precedence is unclear.

## Visitor As Translation IoC

The visitor pattern inverts translation control:

- the domain owns the list of meaningful spec cases;
- the adapter implements how each case becomes SQL, search DSL, API filters, or test matching;
- the domain never imports the database/query-builder package.

```ts
export interface OrderSelectionSpecVisitor<TResult> {
  visitOrderNumber(spec: OrderNumberSpec): TResult;
  visitPaymentReference(spec: PaymentReferenceSpec): TResult;
  visitAnd(spec: AndOrderSpec): TResult;
  visitOr(spec: OrOrderSpec): TResult;
  visitNot(spec: NotOrderSpec): TResult;
}
```

For SQL builders, let the visitor return a predicate rather than mutating domain state:

```ts
type SqlPredicate = (builder: ExpressionBuilder<Database, "orders">) => Expression<boolean>;

class KyselyOrderSelectionVisitor implements OrderSelectionSpecVisitor<SqlPredicate> {
  visitOrderNumber(spec: OrderNumberSpec): SqlPredicate {
    return (eb) => eb("order_number", "=", spec.orderNumber.value);
  }

  visitPaymentReference(spec: PaymentReferenceSpec): SqlPredicate {
    return (eb) => eb("payment_reference", "=", spec.paymentReference.value);
  }

  visitOr(spec: OrOrderSpec): SqlPredicate {
    return (eb) => eb.or([spec.left.accept(this)(eb), spec.right.accept(this)(eb)]);
  }

  visitAnd(spec: AndOrderSpec): SqlPredicate {
    return (eb) => eb.and([spec.left.accept(this)(eb), spec.right.accept(this)(eb)]);
  }

  visitNot(spec: NotOrderSpec): SqlPredicate {
    return (eb) => eb.not(spec.inner.accept(this)(eb));
  }
}
```

The repository applies the translated predicate:

```ts
const predicate = spec.accept(new KyselyOrderSelectionVisitor());
const row = await db.selectFrom("orders").selectAll().where(predicate).executeTakeFirst();
```

## Mutation Specs

Use separate mutation specs when persistence needs explicit update/upsert translation.

```ts
export interface OrderMutationSpecVisitor<TResult> {
  visitUpsertOrder(spec: UpsertOrderSpec): TResult;
}

export class UpsertOrderSpec {
  private constructor(public readonly state: OrderState) {}

  static fromOrder(order: Order): UpsertOrderSpec {
    return new UpsertOrderSpec(order.toState());
  }

  accept<TResult>(visitor: OrderMutationSpecVisitor<TResult>): TResult {
    return visitor.visitUpsertOrder(this);
  }
}
```

The aggregate still decides whether the mutation is valid. The mutation spec only tells the adapter how to persist an already-decided state.

## Mutation-Aware Specs

Mutation-aware specs are advanced. Use them only when one object must consistently support in-memory mutation and adapter-side translation of the same deterministic change.

```ts
interface MutationAwareSpec<TAggregate, TVisitor> {
  isSatisfiedBy(candidate: TAggregate): boolean;
  mutate(candidate: TAggregate): Result<TAggregate, DomainError>;
  accept<TResult>(visitor: TVisitor): TResult;
}

class CaptureAuthorizedPaymentSpec implements MutationAwareSpec<Order, OrderMutationSpecVisitor> {
  constructor(private readonly capturedAt: OccurredAt) {}

  isSatisfiedBy(order: Order): boolean {
    return order.paymentStatus().isAuthorized();
  }

  mutate(order: Order): Result<Order, DomainError> {
    return order.capturePayment(this.capturedAt);
  }

  accept<TResult>(visitor: OrderMutationSpecVisitor<TResult>): TResult {
    return visitor.visitCaptureAuthorizedPayment(this);
  }
}

class Order extends AggregateRoot<OrderState, OrderId> {
  apply(spec: MutationAwareSpec<Order, OrderMutationSpecVisitor>): Result<Order, DomainError> {
    return spec.mutate(this);
  }
}

const captured = order.apply(new CaptureAuthorizedPaymentSpec(capturedAt));
```

When an aggregate root or entity exposes this shape, it calls `spec.mutate(this)` and receives a new aggregate/entity instance or a domain error. The spec may reuse aggregate/entity methods to preserve invariants; it must not bypass them by mutating primitive state directly.

Do not use mutation-aware specs for workflows that need permissions, multiple repositories, external APIs, or branching orchestration. Those belong in application services.

## Exhaustiveness

When adding a new spec:

- update the visitor interface;
- update every adapter visitor;
- update in-memory/test visitors;
- add tests proving both `isSatisfiedBy` and adapter translation;
- avoid default visitor branches that silently ignore unknown specs.

## Anti-Patterns

- Fat god spec: one object with many optional fields, modes, and caller-specific behavior.
- Spec as DTO: `{ field, op, value }` with domain names painted on top.
- Infrastructure inside spec: database, cache, HTTP, filesystem, or provider calls.
- Aggregate invariant extracted into a spec with no reuse or translation need.
- Silent visitor drift: new spec type added but one adapter visitor is not updated.
- Repository owns business policy: repository decides whether the spec is valid instead of translating it.
