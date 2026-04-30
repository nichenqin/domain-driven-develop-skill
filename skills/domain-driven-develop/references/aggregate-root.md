# Aggregate Root

Use this reference when creating or changing aggregate roots, entities, invariants, lifecycle transitions, or domain events.

When a change creates, emits, or renames events, also read `domain-events.md`.

## Rule

An aggregate root is the consistency boundary for a cluster of domain state. It is the only external entry point for changes inside that boundary.

Choose an aggregate root because it must protect invariants, not because a table, route, or UI page exists.

## Aggregate Design Checklist

- The aggregate root has identity.
- External code mutates child entities and owned value objects only through aggregate behavior.
- Methods are named as domain operations, not generic setters.
- Invalid transitions return explicit domain errors or result values.
- Cross-aggregate references use IDs, not deep object graphs.
- Domain events describe meaningful state changes after the aggregate decision is made.
- Domain events are facts produced by valid aggregate behavior; application services own persistence and publication policy.
- Persistence shape is not visible in aggregate APIs.
- External code should not inspect aggregate or entity state through `toState().x.value` to decide whether a domain operation is allowed. Put permission checks, transitions, and invariant-preserving changes behind aggregate/entity methods or value-object predicates.
- When a behavior combines multiple value objects owned by one entity, put the calculation on that entity.
- When a behavior coordinates multiple child entities or owned value objects inside the same consistency boundary, put the calculation or invariant on the aggregate root.
- Domain services may coordinate aggregate roots, but they should call aggregate/entity/value-object behavior rather than own intra-aggregate calculations.

## TypeScript Sketch

```ts
export class Order {
  private constructor(private state: OrderState) {}

  static create(input: CreateOrderInput): Result<Order, DomainError> {
    const status = OrderStatus.awaitingPayment();
    return ok(new Order({ id: input.id, status, lines: input.lines, payments: [] }));
  }

  authorizePayment(
    payment: Payment,
    at: OccurredAt,
  ): Result<OrderPaymentAuthorizedEvent, DomainError> {
    if (!payment.amount().covers(this.payableAmount())) {
      return err(domainError.invariant("payment_amount_insufficient"));
    }

    const nextStatus = this.state.status.markPaid();
    this.state = {
      ...this.state,
      status: nextStatus,
      payments: [...this.state.payments, payment],
    };
    return ok(new OrderPaymentAuthorizedEvent(this.state.id, payment.id(), at));
  }

  toState(): OrderState {
    return this.state;
  }
}
```

## Avoid

```ts
order.status = "paid";
order.lines.push(rawLine);
await order.save(db);
if (order.toState().status.value === "awaiting_payment") authorizePayment(order, payment);
```

Why:

- external code bypasses invariants;
- status is a primitive;
- persistence leaks into the aggregate.
- domain decisions are made by inspecting serialized state instead of asking the model.

## Where Logic Goes

| Logic | Placement |
| --- | --- |
| invariant on one aggregate | aggregate method |
| state transition | aggregate or value-object state machine |
| child entity mutation | aggregate root method or entity method invoked by the aggregate |
| calculation across value objects owned by one entity | entity method |
| calculation across child entities or owned value objects in one boundary | aggregate root method |
| value comparison or status question | value-object predicate/comparison method |
| rule spanning multiple aggregate roots or no natural single owner, without IO | domain service |
| coordination across repositories | application service |
| SQL/API/filesystem translation | adapter |
| dependency assembly | composition root |
