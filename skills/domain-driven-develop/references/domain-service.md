# Domain Service

Use this reference when a pure domain rule does not naturally belong to one aggregate or value object.

## Rule

A domain service holds domain logic that is stateless or policy-like and spans multiple domain concepts without performing IO.

Use a domain service when:

- the rule is business language, not orchestration;
- the rule does not fit one aggregate or value object;
- the rule can be evaluated with already-loaded domain objects or explicit domain values;
- putting it in an application service would hide domain truth.

Before creating or expanding a domain service, ask whether the behavior belongs on an existing aggregate, entity, or value object:

- a status question usually belongs on the status value object;
- a constrained numeric change usually belongs on the numeric value object;
- a calculation that combines multiple value objects owned by one entity usually belongs on that entity;
- a calculation or invariant that coordinates multiple child entities or owned value objects inside one consistency boundary usually belongs on the aggregate root;
- a child-entity mutation usually belongs behind aggregate behavior;
- an invariant on one consistency boundary usually belongs on the aggregate root.

Do not use a domain service for:

- database queries;
- HTTP/provider calls;
- transaction management;
- command handling;
- object construction that belongs in an aggregate factory;
- business-light helper functions;
- intra-aggregate calculations that an aggregate root or entity can own;
- rules that only inspect one object's serialized state;
- code that repeatedly peels `toState().x.value` because the model is missing intention-revealing methods.

## TypeScript Sketch

```ts
export class OrderPaymentPolicy {
  authorize(order: Order, payment: Payment): Result<Order, DomainError> {
    if (!order.canAcceptPayment()) return err(domainError.invariant("order_not_payable"));
    if (!payment.amount().covers(order.payableAmount())) {
      return err(domainError.invariant("payment_amount_insufficient"));
    }

    return order.authorizePayment(payment);
  }
}
```

The application service can load the objects and call the domain service:

```ts
const order = await orders.findOne(context, OrderByIdSpec.create(orderId));
const payment = await payments.findOne(context, PaymentByIdSpec.create(paymentId));
const authorizedOrder = orderPaymentPolicy.authorize(order, payment);
```

The domain service should not load the order or payment itself.

The domain service should also avoid reimplementing behavior already owned by the aggregate roots. It should compose methods such as `order.payableAmount()`, `order.canAcceptPayment()`, or `payment.amount().covers(...)` rather than peeling internal state and duplicating those calculations.

## Naming

Name domain services after domain policy, not technical role:

- good: `OrderPaymentPolicy`, `RefundEligibilityPolicy`, `PaymentCapturePolicy`
- weak: `OrderHelper`, `PaymentManager`, `DomainService`

If the name has no ubiquitous-language meaning, the logic probably belongs somewhere else.
