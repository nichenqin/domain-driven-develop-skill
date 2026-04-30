# TypeScript Patterns

Use this reference when the target implementation is TypeScript or when examples need a concrete language.

These examples are defaults, not universal requirements. If the project already has a different TypeScript style, follow the project.

## Branded Value Objects

```ts
import { err, ok, type Result } from "./result";

const orderIdBrand: unique symbol = Symbol("OrderId");

export class OrderId {
  private [orderIdBrand]!: void;

  private constructor(public readonly value: string) {}

  static create(raw: string): Result<OrderId, DomainError> {
    if (!raw.startsWith("ord_")) return err(domainError.validation("order_id_invalid"));
    return ok(new OrderId(raw));
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }
}
```

Prefer class-based value objects over branded type aliases for domain-significant primitives. A branded alias may be acceptable at transport boundaries, but aggregate/entity state should use value object classes when the value has validation, normalization, comparison, units, ranges, or behavior.

The private `unique symbol` field is intentional. It prevents two structurally identical classes such as `OrderId` and `PaymentId` from being assignable to each other.

Use this pattern for IDs and scalar value objects:

- private `unique symbol` brand field;
- private constructor;
- `create(...)` for validation and normalization;
- `rehydrate(...)` for trusted persistence reconstruction when needed;
- `equals(...)` from the value object base or a local implementation;
- explicit `toJSON()` or `toString()` only when the public representation is stable.

## Primitive Quarantine

In TypeScript, primitives are acceptable at the edges of a value object, not as the aggregate/entity state model itself.

```ts
export class OrderLineQuantity extends ScalarValueObject<number> {
  private [orderLineQuantityBrand]!: void;

  private constructor(value: number) {
    super(value);
  }

  static create(value: number): Result<OrderLineQuantity, DomainError> {
    if (!Number.isInteger(value) || value < 1) {
      return err(domainError.validation("order_line_quantity_invalid"));
    }
    return ok(new OrderLineQuantity(value));
  }
}
```

Use raw `number` only inside `OrderLineQuantity`, factory inputs, schema codecs, and serialization. Aggregate/entity state should refer to `OrderLineQuantity`.

Boolean policy flags also deserve value objects when they are domain language:

```ts
export class PaymentCapturePolicy extends ScalarValueObject<boolean> {
  private [paymentCapturePolicyBrand]!: void;

  private constructor(value: boolean) {
    super(value);
  }

  static enabled(): PaymentCapturePolicy {
    return new PaymentCapturePolicy(true);
  }

  static disabled(): PaymentCapturePolicy {
    return new PaymentCapturePolicy(false);
  }

  isEnabled(): boolean {
    return this.value;
  }
}
```

Numeric value objects may contain domain operations:

```ts
export class PaymentAmount {
  private constructor(public readonly value: number) {}

  static create(value: number): Result<PaymentAmount, DomainError> {
    if (!Number.isInteger(value) || value < 0) {
      return err(domainError.validation("payment_amount_invalid"));
    }
    return ok(new PaymentAmount(value));
  }

  add(other: PaymentAmount): PaymentAmount {
    return new PaymentAmount(this.value + other.value);
  }

  covers(total: PaymentAmount): boolean {
    return this.value >= total.value;
  }
}
```

## Result-Based Factories

```ts
export class PaymentReference {
  private constructor(public readonly value: string) {}

  static create(raw: string): Result<PaymentReference, DomainError> {
    const value = raw.trim().toLowerCase();
    if (!value.startsWith("pay_")) return err(domainError.validation("payment_reference_invalid"));
    return ok(new PaymentReference(value));
  }
}
```

## Discriminated Domain Events

```ts
export type DomainEvent = OrderPlacedEvent | PaymentAuthorizedEvent;

export interface PaymentAuthorizedEvent {
  type: "payment.authorized";
  orderId: OrderId;
  paymentId: PaymentId;
  occurredAt: OccurredAt;
}
```

## Ports

```ts
export interface Clock {
  now(): OccurredAt;
}

export interface IdGenerator {
  next(prefix: string): string;
}
```

Repository ports should use repository context plus selection/mutation specs:

```ts
export interface OrderRepository {
  findOne(context: RepositoryContext, spec: OrderSelectionSpec): Promise<Result<Order | null, DomainError>>;
  upsert(context: RepositoryContext, order: Order, spec: OrderMutationSpec): Promise<Result<void, DomainError>>;
  deleteOne(context: RepositoryContext, spec: OrderSelectionSpec): Promise<Result<boolean, DomainError>>;
}
```

Avoid repository method proliferation such as `findById`, `findByPaymentReference`, `findUnpaidByOwner`, and `updatePaymentStatusById` unless the project has consciously chosen that style. Prefer selection and mutation specifications that adapters translate through visitors.

## Language Expansion

When adding another language reference, preserve these ideas:

- explicit value objects or newtypes;
- result/error return style for expected failures;
- repository ports separate from adapters;
- aggregate methods for behavior;
- constructor injection or explicit composition;
- specifications and visitors translated outside the domain.
