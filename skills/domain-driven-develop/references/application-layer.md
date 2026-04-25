# Application Layer

Use this reference when placing command/query handlers, use cases, orchestration, unit-of-work boundaries, event publication, and side effects.

When the project uses CQRS or the change affects read/write separation, also read `cqrs-with-ddd.md`.
When a change creates, publishes, consumes, projects, or replays events, also read `domain-events.md`.

## Rule

The application layer coordinates domain work. It should not become the place where domain truth is hidden.

Application services may:

- parse command/query objects already validated at the boundary;
- load aggregates through repositories;
- call aggregate methods and domain services;
- manage unit-of-work or transaction boundaries;
- persist changed aggregates;
- publish domain events after persistence;
- call ports for clocks, IDs, policies, notifications, providers, or runtime executors.

Application services should not:

- contain aggregate state-machine logic as string branching;
- write raw persistence state for aggregate-owned data;
- import HTTP/CLI/Web framework request objects;
- call dependency containers from inside methods;
- hide provider SDK types in command schemas or domain models.

## CQRS Boundary

When CQRS is warranted:

- commands express intent and coordinate write-side decisions;
- queries return read-optimized data and do not perform business mutations;
- read models may be flatter than aggregates;
- consistency expectations between writes and reads must be explicit.

Do not use command/query wrappers as ceremony around CRUD if read and write concerns are not actually different.

## Command Handler Shape

```ts
export class RegisterUserHandler implements CommandHandler<RegisterUserCommand> {
  constructor(
    private readonly users: UserRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async handle(command: RegisterUserCommand): Promise<Result<UserId, DomainError>> {
    const nameResult = UserName.create(command.name);
    if (nameResult.isErr()) return err(nameResult.error);

    const emailResult = UserEmail.create(command.email);
    if (emailResult.isErr()) return err(emailResult.error);

    const existingResult = await this.users.findOne(
      command.context,
      UserLookupSpec.byNameOrEmail(nameResult.value, emailResult.value),
    );
    if (existingResult.isErr()) return err(existingResult.error);
    if (existingResult.value) return err(domainError.conflict("user_already_exists"));

    const userResult = User.register({
      id: this.ids.next("user"),
      name: nameResult.value,
      email: emailResult.value,
      at: this.clock.now(),
    });
    if (userResult.isErr()) return err(userResult.error);

    const saveResult = await this.users.upsert(
      command.context,
      userResult.value,
      UpsertUserSpec.fromUser(userResult.value),
    );
    if (saveResult.isErr()) return err(saveResult.error);

    return ok(userResult.value.toState().id);
  }
}
```

## Entrypoints

HTTP, CLI, Web, message consumers, and tool/MCP endpoints are entrypoints. They should:

- collect input;
- translate transport DTOs to command/query input schemas;
- dispatch command/query buses or application services;
- translate results into transport responses.

They should not:

- call repositories directly for business mutations;
- duplicate command validation with parallel transport-only shapes;
- implement workflow branches that belong in specs or application services.

## Events

Publish domain events after the aggregate decision and after the main persistence boundary succeeds, unless the project explicitly uses event sourcing or another documented model.

Application services may collect domain events from aggregates and persist outbox/event records. Event handlers may update read models, start follow-up workflows, or translate to integration events, but they should not decide whether the original aggregate transition was valid.
