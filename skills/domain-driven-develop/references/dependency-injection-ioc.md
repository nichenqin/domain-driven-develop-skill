# Dependency Injection And Inversion Of Control

Use this reference when wiring dependencies, reviewing service locator usage, or deciding how domain/application code receives ports.

## Core Ideas

Inversion of Control means a component does not directly choose every concrete implementation it uses. Dependency Injection is a common technique for that: dependencies are supplied from the outside, usually through constructors.

The important design principle is separating configuration from use.

## Boundary Rule

- Domain objects should not resolve dependencies from containers.
- Application services and handlers should declare dependencies explicitly.
- Composition roots wire concrete implementations to ports.
- Adapters implement ports and may depend inward on application/domain contracts.

## Prefer Constructor Injection

```ts
export class CreateOrderUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: CreateOrderInput): Promise<Result<OrderId, DomainError>> {
    // use dependencies
  }
}
```

Avoid:

```ts
export class CreateOrderUseCase {
  async execute(input: CreateOrderInput) {
    const orders = container.resolve(OrderRepository);
    const clock = container.resolve(Clock);
  }
}
```

Why:

- dependencies are hidden;
- tests must configure global state;
- use cases become coupled to the DI tool;
- composition leaks into business code.

## Composition Root

Keep wiring in application bootstrap:

```ts
container.register("OrderRepository", { useClass: PgOrderRepository });
container.register("Clock", { useClass: SystemClock });
container.register("CreateOrderUseCase", { useClass: CreateOrderUseCase });
```

If the language or framework supports manual composition, that is also fine:

```ts
const createOrder = new CreateOrderUseCase(new PgOrderRepository(db), new NanoIdGenerator(), clock);
```

The key is not the container. The key is that domain/application code does not look up concrete infrastructure by itself.

## Visitor As IoC

Visitor-based specification translation is also inversion of control:

- the spec calls a visitor method for its domain case;
- the adapter provides the visitor implementation;
- persistence translation is plugged in without the domain importing SQL or query-builder APIs.

This keeps the domain stable while allowing multiple adapter translations, such as SQL, Elasticsearch, in-memory tests, or remote API filters.
