# Value Object

Use this reference when modeling IDs, names, statuses, timestamps, money, addresses, source locators, slugs, ports, ranges, or any primitive that carries domain meaning.

## Rule

A value object is immutable domain meaning. It validates, normalizes, compares, and names a concept so aggregates cannot confuse raw primitives.

Value objects should not be thin primitive boxes. When code needs to ask a domain question or perform a constrained change, put that behavior on the value object instead of repeatedly exposing `value` or `toState()` to callers.

## When To Create One

Create a value object for:

- identity values;
- status and lifecycle stages;
- domain-significant text such as names, slugs, addresses, commands, or source locators;
- temporal values such as `OccurredAt`, `ExpiresAt`, or `SnapshotCreatedAt`;
- numbers with units, ranges, currencies, or limits;
- values that must be normalized or masked.

Avoid value objects for one-off local variables with no domain meaning.

## TypeScript Sketch

```ts
const paymentReferenceBrand: unique symbol = Symbol("PaymentReference");

export class PaymentReference {
  private [paymentReferenceBrand]!: void;

  private constructor(public readonly value: string) {}

  static create(raw: string): Result<PaymentReference, DomainError> {
    const normalized = raw.trim().toLowerCase();
    if (!normalized.startsWith("pay_")) {
      return err(domainError.validation("payment_reference_invalid"));
    }
    return ok(new PaymentReference(normalized));
  }

  equals(other: PaymentReference): boolean {
    return this.value === other.value;
  }
}
```

## Status As State Machine

Prefer this:

```ts
export class PaymentStatus {
  private constructor(public readonly value: "pending" | "authorized" | "captured" | "failed") {}

  static pending(): PaymentStatus {
    return new PaymentStatus("pending");
  }

  authorize(): Result<PaymentStatus, DomainError> {
    if (this.value !== "pending") return err(domainError.invariant("payment_not_pending"));
    return ok(new PaymentStatus("authorized"));
  }

  isAuthorized(): boolean {
    return this.value === "authorized";
  }

  capture(): Result<PaymentStatus, DomainError> {
    if (!this.isAuthorized()) return err(domainError.invariant("payment_not_authorized"));
    return ok(new PaymentStatus("captured"));
  }
}
```

Avoid this:

```ts
if (payment.status === "pending") payment.status = "authorized";
```

Also avoid this inside domain behavior:

```ts
if (payment.toState().status.value === "authorized") {
  // domain decision outside the value object
}
```

Prefer intention-revealing predicates and transitions:

```ts
if (payment.status().isAuthorized()) {
  // caller asks a domain question
}

const nextStatus = payment.status().capture();
```

## Behavioral Surface

Good value-object behavior includes:

- predicates such as `isActive()`, `isExpired(at)`, `isZero()`, `isSelectedBy(category)`;
- comparisons such as `equals(other)`, `greaterThan(other)`, `sameKindAs(other)`;
- transitions that return new values, such as `activate()`, `deactivate()`, `advanceTo(next)`;
- constrained arithmetic such as `increase(amount, maximum)`, `decrease(amount)`, `capAt(maximum)`;
- domain classification such as `appliesTo(moveCategory)` or `bypasses(screenKind)`.

Keep behavior small and local to the concept. Do not turn a value object into an application workflow.

## Testing

When adding value-object behavior, add focused tests for that behavior. Construction tests are not enough when callers rely on predicates, comparisons, state-machine transitions, or constrained arithmetic.

## Serialization

Value objects may expose primitives at boundaries through explicit methods or `value` fields. Aggregates should store value objects; DTOs, persistence rows, logs, read models, fixtures, assertions, and transport schemas may serialize them.
