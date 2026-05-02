# Repository

Use this reference when designing repository ports, persistence adapters, read models, and selection or mutation boundaries.

## Rule

A repository is a collection-like port for aggregate roots or application-owned state. It loads and persists; it does not decide business truth.

Keep repository implementations in adapters or infrastructure. Keep repository interfaces in the domain or application boundary, depending on the project architecture.

## Spec Repository Constraint

Treat spec-based repository APIs as a strong architectural constraint, not a style preference. The repository surface should stay small and collection-shaped; business lookup and mutation language belongs in named specs and aggregate/application methods.

Prefer:

- `findOne(context, spec)` over `findById`, `findByRequestId`, `findByOwnerAndStatus`, or similar method growth;
- `findMany(context, spec)` over one repository method per list screen or report filter;
- `upsert(context, aggregate, mutationSpec)` or `update(context, selectionSpec, mutationSpec)` over adapter-owned business mutations such as `markPaymentAuthorized`;
- composed specs over repository methods that encode `and`/`or` business language in their names.

A spec is not a persistence filter bag. It is a named domain predicate or mutation intent. Spec composition represents business logic; the repository adapter only translates that logic to storage operations. Do not replace `findBy...` proliferation with one optional-parameter spec object such as `LookupSpec({ requestId, resourceId?, hostname?, path? })`; compose `ByRequestIdSpec.and(ByResourceIdSpec).and(ByHostnameSpec)` and translate that tree with a visitor.

## Preferred Shape

```ts
export interface OrderRepository {
  findOne(context: RepositoryContext, spec: OrderSelectionSpec): Promise<Result<Order | null, DomainError>>;
  upsert(context: RepositoryContext, order: Order, spec: OrderMutationSpec): Promise<Result<void, DomainError>>;
  deleteOne(context: RepositoryContext, spec: OrderSelectionSpec): Promise<Result<boolean, DomainError>>;
}
```

The application service chooses the spec and makes the business decision:

```ts
const orderResult = await orders.findOne(context, OrderByIdSpec.create(orderId));
if (orderResult.isErr()) return err(orderResult.error);
if (!orderResult.value) return err(domainError.notFound("order_not_found"));

const paymentResult = Payment.create({ id: paymentId, amount, reference });
if (paymentResult.isErr()) return err(paymentResult.error);

const authorized = orderResult.value.authorizePayment(paymentResult.value);
if (authorized.isErr()) return err(authorized.error);

return orders.upsert(context, authorized.value, UpsertOrderSpec.fromOrder(authorized.value));
```

## Avoid Business Repository Methods

Avoid:

```ts
interface OrderRepository {
  findByOrderNumberOrPaymentReference(orderNumber: string, paymentReference: string): Promise<Order | null>;
  markPaymentAuthorized(id: string): Promise<void>;
  cancelExpiredUnpaidOrders(): Promise<number>;
}
```

Why:

- `findByOrderNumberOrPaymentReference` hardcodes business search language into the repository surface;
- `markPaymentAuthorized` hides an aggregate transition in persistence;
- `cancelExpiredUnpaidOrders` combines selection, policy, and mutation in one adapter-shaped method.

Prefer named specs and aggregate methods:

```ts
const spec = OrderLookupSpec.byOrderNumberOrPaymentReference(orderNumber, paymentReference);
const orderResult = await orders.findOne(context, spec);
if (orderResult.isErr()) return err(orderResult.error);
if (!orderResult.value) return err(domainError.notFound("order_not_found"));

const eventResult = orderResult.value.authorizePayment(payment, at);
if (eventResult.isErr()) return err(eventResult.error);

return orders.upsert(context, orderResult.value, UpsertOrderSpec.fromOrder(orderResult.value));
```

## Read Models

Read models can be query-shaped and optimized for UI/API reads. Do not use read models to bypass write-side aggregate invariants.

If a use case needs current aggregate state for a business decision, load the aggregate repository with a named selection spec.

## Adapter Responsibility

Persistence adapters may:

- translate specs into SQL/API filters;
- serialize and rehydrate aggregate state;
- manage transactions through repository context;
- map infrastructure failures to domain/application errors.

Persistence adapters must not:

- decide whether a domain transition is allowed;
- call provider SDKs from domain specifications;
- inspect ad-hoc request DTOs as business policy;
- add business-specific `findBy...` or `mark...` methods to avoid modeling a spec;
- scatter `instanceof` checks that throw on unknown specs when the spec has a visitor contract.
