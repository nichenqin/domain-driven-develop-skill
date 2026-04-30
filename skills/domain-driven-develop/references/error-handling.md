# Error Handling

Use this reference when modeling expected domain/application failures, error taxonomy, command factories, value-object validation, adapter translation, or no-throw Result style.

## Rule

Expected business failures should be explicit values in the domain/application boundary. Do not throw for normal validation failures, invariant violations, conflicts, not-found outcomes, authorization failures, or state-transition rejections unless the project explicitly uses exception-based domain flow.

## Error Taxonomy

Prefer a small set of stable categories:

- `validation`
- `invariant`
- `conflict`
- `not-found`
- `unauthorized`
- `forbidden`
- `infrastructure`
- `unexpected`

Keep errors:

- machine-readable for adapters and logs;
- stable enough for clients and tests;
- named in the ubiquitous language;
- specific enough to guide recovery.

## TypeScript Sketch

```ts
export interface DomainError {
  readonly code: string;
  readonly category: "validation" | "invariant" | "conflict" | "not-found" | "unexpected";
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export const domainError = {
  validation: (code: string, details?: Record<string, unknown>): DomainError => ({
    code,
    category: "validation",
    message: code,
    details,
  }),
  conflict: (code: string, details?: Record<string, unknown>): DomainError => ({
    code,
    category: "conflict",
    message: code,
    details,
  }),
};
```

## Value Object Factory

```ts
class PaymentReference {
  private constructor(public readonly value: string) {}

  static create(raw: unknown): Result<PaymentReference, DomainError> {
    if (typeof raw !== "string") return err(domainError.validation("payment_reference_required"));

    const normalized = raw.trim().toLowerCase();
    if (!normalized.startsWith("pay_")) {
      return err(domainError.validation("payment_reference_invalid"));
    }

    return ok(new PaymentReference(normalized));
  }
}
```

## Command Factory

Validate transport-shaped input before creating a command object:

```ts
class AuthorizeOrderPaymentCommand {
  private constructor(
    readonly orderId: OrderId,
    readonly paymentReference: PaymentReference,
  ) {}

  static create(raw: unknown): Result<AuthorizeOrderPaymentCommand, DomainError> {
    const parsed = authorizeOrderPaymentSchema.safeParse(raw);
    if (!parsed.success) {
      return err(domainError.validation("authorize_order_payment_input_invalid"));
    }

    const orderId = OrderId.create(parsed.data.orderId);
    if (orderId.isErr()) return err(orderId.error);

    const paymentReference = PaymentReference.create(parsed.data.paymentReference);
    if (paymentReference.isErr()) return err(paymentReference.error);

    return ok(new AuthorizeOrderPaymentCommand(orderId.value, paymentReference.value));
  }
}
```

## Adapter Translation

Translate errors at boundaries:

- `validation` -> HTTP 400 or CLI input error;
- `not-found` -> HTTP 404 or "not found" CLI error;
- `conflict` -> HTTP 409;
- `forbidden` -> HTTP 403;
- `invariant` -> HTTP 422 or domain-specific contract;
- `infrastructure` -> HTTP 503 or retryable operational error.

Do not put HTTP status codes or CLI formatting in domain errors.

## Anti-Patterns

- Mixing `throw` and `Result` arbitrarily for expected failures.
- Returning plain strings instead of structured errors.
- Encoding transport labels instead of ubiquitous language in error codes.
- Mapping errors inside aggregates.
- Treating all infrastructure failures as domain failures without boundary translation.
