# TypeScript Patterns

Use this reference when the target implementation is TypeScript or when examples need a concrete language.

These examples are defaults, not universal requirements. If the project already has a different TypeScript style, follow the project.

## Branded Value Objects

```ts
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

## Language Expansion

When adding another language reference, preserve these ideas:

- explicit value objects or newtypes;
- result/error return style for expected failures;
- repository ports separate from adapters;
- aggregate methods for behavior;
- constructor injection or explicit composition;
- specifications and visitors translated outside the domain.
