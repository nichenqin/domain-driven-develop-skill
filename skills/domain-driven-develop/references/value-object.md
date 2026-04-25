# Value Object

Use this reference when modeling IDs, names, statuses, timestamps, money, addresses, source locators, slugs, ports, ranges, or any primitive that carries domain meaning.

## Rule

A value object is immutable domain meaning. It validates, normalizes, compares, and names a concept so aggregates cannot confuse raw primitives.

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
const userEmailBrand: unique symbol = Symbol("UserEmail");

export class UserEmail {
  private [userEmailBrand]!: void;

  private constructor(public readonly value: string) {}

  static create(raw: string): Result<UserEmail, DomainError> {
    const normalized = raw.trim().toLowerCase();
    if (!normalized.includes("@")) {
      return err(domainError.validation("user_email_invalid"));
    }
    return ok(new UserEmail(normalized));
  }

  equals(other: UserEmail): boolean {
    return this.value === other.value;
  }
}
```

## Status As State Machine

Prefer this:

```ts
export class DeploymentStatus {
  private constructor(public readonly value: "planned" | "running" | "succeeded" | "failed") {}

  static planned(): DeploymentStatus {
    return new DeploymentStatus("planned");
  }

  start(): Result<DeploymentStatus, DomainError> {
    if (this.value !== "planned") return err(domainError.invariant("deployment_not_planned"));
    return ok(new DeploymentStatus("running"));
  }
}
```

Avoid this:

```ts
if (deployment.status === "planned") deployment.status = "running";
```

## Serialization

Value objects may expose primitives at boundaries through explicit methods or `value` fields. Aggregates should store value objects; DTOs, persistence rows, logs, and transport schemas may serialize them.
