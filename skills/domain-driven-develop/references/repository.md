# Repository

Use this reference when designing repository ports, persistence adapters, read models, and selection or mutation boundaries.

## Rule

A repository is a collection-like port for aggregate roots or application-owned state. It loads and persists; it does not decide business truth.

Keep repository implementations in adapters or infrastructure. Keep repository interfaces in the domain or application boundary, depending on the project architecture.

## Preferred Shape

```ts
export interface UserRepository {
  findOne(context: RepositoryContext, spec: UserSelectionSpec): Promise<Result<User | null, DomainError>>;
  upsert(context: RepositoryContext, user: User, spec: UserMutationSpec): Promise<Result<void, DomainError>>;
  deleteOne(context: RepositoryContext, spec: UserSelectionSpec): Promise<Result<boolean, DomainError>>;
}
```

The application service chooses the spec and makes the business decision:

```ts
const existingResult = await users.findOne(context, UserLookupSpec.byNameOrEmail(name, email));
if (existingResult.isErr()) return err(existingResult.error);
if (existingResult.value) return err(domainError.conflict("user_already_exists"));

const userResult = User.register({ id, name, email, at: clock.now() });
if (userResult.isErr()) return err(userResult.error);

return users.upsert(context, userResult.value, UpsertUserSpec.fromUser(userResult.value));
```

## Avoid Business Repository Methods

Avoid:

```ts
interface UserRepository {
  findByUserNameOrEmail(name: string, email: string): Promise<User | null>;
  markEmailVerified(id: string): Promise<void>;
  deactivateExpiredTrialUsers(): Promise<number>;
}
```

Why:

- `findByUserNameOrEmail` hardcodes business search language into the repository surface;
- `markEmailVerified` hides an aggregate transition in persistence;
- `deactivateExpiredTrialUsers` combines selection, policy, and mutation in one adapter-shaped method.

Prefer named specs and aggregate methods:

```ts
const spec = UserLookupSpec.byNameOrEmail(name, email);
const userResult = await users.findOne(context, spec);
if (userResult.isErr()) return err(userResult.error);
if (!userResult.value) return err(domainError.notFound("user"));

const eventResult = userResult.value.verifyEmail(at);
if (eventResult.isErr()) return err(eventResult.error);

return users.upsert(context, userResult.value, UpsertUserSpec.fromUser(userResult.value));
```

## Read Models

Read models can be query-shaped and optimized for UI/API reads. Do not use read models to bypass write-side aggregate invariants.

If a use case needs current aggregate state for a business decision, load the aggregate repository with a named selection spec.

## Adapter Responsibility

Persistence adapters may:

- translate specs into SQL/API filters;
- serialize and rehydrate aggregate state;
- manage transactions through repository context;
- map infrastructure failures to domain/application errors.

Persistence adapters must not:

- decide whether a domain transition is allowed;
- call provider SDKs from domain specifications;
- inspect ad-hoc request DTOs as business policy;
- scatter `instanceof` checks that throw on unknown specs when the spec has a visitor contract.
