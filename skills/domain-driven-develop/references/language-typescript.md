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

The private `unique symbol` field is intentional. It prevents two structurally identical classes such as `SpeciesId` and `MoveId` from being assignable to each other.

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
export class NationalDexNumber extends ScalarValueObject<number> {
  private [nationalDexNumberBrand]!: void;

  private constructor(value: number) {
    super(value);
  }

  static create(value: number): Result<NationalDexNumber, DomainError> {
    if (!Number.isInteger(value) || value < 1) {
      return err(domainError.validation("national_dex_number_invalid"));
    }
    return ok(new NationalDexNumber(value));
  }
}
```

Use raw `number` only inside `NationalDexNumber`, factory inputs, schema codecs, and serialization. Aggregate/entity state should refer to `NationalDexNumber`.

Boolean policy flags also deserve value objects when they are domain language:

```ts
export class ItemClausePolicy extends ScalarValueObject<boolean> {
  private [itemClausePolicyBrand]!: void;

  private constructor(value: boolean) {
    super(value);
  }

  static enabled(): ItemClausePolicy {
    return new ItemClausePolicy(true);
  }

  static disabled(): ItemClausePolicy {
    return new ItemClausePolicy(false);
  }

  isEnabled(): boolean {
    return this.value;
  }
}
```

Numeric value objects may contain domain operations:

```ts
export class HP {
  private constructor(public readonly value: number) {}

  static create(value: number): Result<HP, DomainError> {
    if (!Number.isInteger(value) || value < 0) return err(domainError.validation("hp_invalid"));
    return ok(new HP(value));
  }

  decrease(amount: number): Result<HP, DomainError> {
    if (!Number.isInteger(amount) || amount < 0) return err(domainError.validation("damage_invalid"));
    return ok(new HP(Math.max(0, this.value - amount)));
  }

  increase(amount: number, max: HP): Result<HP, DomainError> {
    if (!Number.isInteger(amount) || amount < 0) return err(domainError.validation("healing_invalid"));
    return ok(new HP(Math.min(max.value, this.value + amount)));
  }
}
```

## Result-Based Factories

```ts
export class UserName {
  private constructor(public readonly value: string) {}

  static create(raw: string): Result<UserName, DomainError> {
    const value = raw.trim();
    if (value.length < 2) return err(domainError.validation("user_name_too_short"));
    return ok(new UserName(value));
  }
}
```

## Discriminated Domain Events

```ts
export type DomainEvent = UserRegisteredEvent | UserEmailVerifiedEvent;

export interface UserRegisteredEvent {
  type: "user.registered";
  userId: UserId;
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

Avoid repository method proliferation such as `findById`, `findByEmail`, `findActiveByOwner`, and `updateStatusById` unless the project has consciously chosen that style. Prefer selection and mutation specifications that adapters translate through visitors.

## Language Expansion

When adding another language reference, preserve these ideas:

- explicit value objects or newtypes;
- result/error return style for expected failures;
- repository ports separate from adapters;
- aggregate methods for behavior;
- constructor injection or explicit composition;
- specifications and visitors translated outside the domain.
