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
- a child-entity mutation usually belongs behind aggregate behavior;
- an invariant on one consistency boundary usually belongs on the aggregate root.

Do not use a domain service for:

- database queries;
- HTTP/provider calls;
- transaction management;
- command handling;
- object construction that belongs in an aggregate factory;
- business-light helper functions;
- rules that only inspect one object's serialized state;
- code that repeatedly peels `toState().x.value` because the model is missing intention-revealing methods.

## TypeScript Sketch

```ts
export class PricingPolicy {
  calculateDiscount(customer: Customer, order: Order): Result<Money, DomainError> {
    if (!customer.isActive()) return ok(Money.zero(order.currency()));
    if (!order.total().greaterThan(Money.of(1000, order.currency()))) {
      return ok(Money.zero(order.currency()));
    }

    return ok(order.total().multiply(0.05));
  }
}
```

The application service can load the objects and call the domain service:

```ts
const customer = await customers.findOne(context, CustomerByIdSpec.create(customerId));
const order = await orders.findOne(context, OrderByIdSpec.create(orderId));
const discount = pricingPolicy.calculateDiscount(customer, order);
```

The domain service should not load the customer or order itself.

## Naming

Name domain services after domain policy, not technical role:

- good: `PricingPolicy`, `RouteEligibilityPolicy`, `CreditLimitPolicy`
- weak: `OrderHelper`, `UserManager`, `DomainService`

If the name has no ubiquitous-language meaning, the logic probably belongs somewhere else.
