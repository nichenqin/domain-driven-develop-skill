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

## TypeScript Sketch

```ts
export class Order {
  private constructor(private state: OrderState) {}

  static create(input: CreateOrderInput): Result<Order, DomainError> {
    const status = OrderStatus.draft();
    return ok(new Order({ id: input.id, customerId: input.customerId, status, lines: [] }));
  }

  confirm(at: OccurredAt): Result<OrderConfirmedEvent, DomainError> {
    const nextStatus = this.state.status.confirm();
    if (nextStatus.isErr()) return err(nextStatus.error);

    this.state = { ...this.state, status: nextStatus.value, confirmedAt: at };
    return ok(new OrderConfirmedEvent(this.state.id, at));
  }

  toState(): OrderState {
    return this.state;
  }
}
```

## Avoid

```ts
order.status = "confirmed";
order.lines.push(rawLine);
await order.save(db);
```

Why:

- external code bypasses invariants;
- status is a primitive;
- persistence leaks into the aggregate.

## Where Logic Goes

| Logic | Placement |
| --- | --- |
| invariant on one aggregate | aggregate method |
| state transition | aggregate or value-object state machine |
| rule spanning concepts without IO | domain service |
| coordination across repositories | application service |
| SQL/API/filesystem translation | adapter |
| dependency assembly | composition root |
