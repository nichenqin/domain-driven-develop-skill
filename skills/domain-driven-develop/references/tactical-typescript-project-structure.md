# Tactical TypeScript Project Structure

Use this reference when initializing or restructuring a TypeScript DDD project, creating the first code skeleton, or reviewing whether package layout and tactical domain objects match the domain model.

This shape is calibrated from DDD-oriented TypeScript repositories that keep domain concepts in a central core package and put application orchestration, persistence, transports, and composition outside it. Appaloft is a useful public example of this style: learn the dependency direction and package separation, not its domain facts.

## Default Package Shape

Default to this shape unless the project source of truth has an accepted decision for a different architecture:

```text
packages/
  core/
    src/
      shared/
      <bounded-context>/
  application/
    src/
      commands/
      queries/
      ports/
      operation-catalog.ts
      execution-context.ts
  adapters/
    <adapter-name>/
      src/
apps/
  cli/
  api/
```

For monorepos with persistence adapters, prefer an explicit adapter area:

```text
packages/
  core/
  application/
  adapters/
    cli/
  persistence/
    sqlite/
  contracts/
apps/
  cli/
```

`core` contains tactical domain objects and no framework, database, CLI, HTTP, filesystem, SDK, or DI container dependencies. Bounded contexts are directories inside `core` first, not separate packages by default.

`application` contains command/query messages, handlers, use cases, ports, repository interfaces, read-model interfaces, operation catalog entries, and orchestration. It depends on `core`.

Adapters and apps depend inward. They translate transport, persistence, and provider details into application commands/queries or repository/read-model ports.

## When To Split A Bounded Context Into A Package

Split a bounded context into a separate package only when at least one is true and documented by ADR:

- it has an independent release or ownership lifecycle;
- it must be consumed independently by another deployable or repo;
- dependency boundaries cannot be enforced inside `core`;
- build/runtime constraints require separate packaging.

Do not split packages only because a context has a name.

## Tactical Domain Objects

Use classes for tactical DDD concepts:

- aggregate roots extend or follow an `AggregateRoot` base;
- entities extend or follow an `Entity` base;
- value objects extend or follow a `ValueObject` or `ScalarValueObject` base;
- specifications are classes with `isSatisfiedBy(...)` and `accept(...)`;
- mutation specs are classes with `accept(...)` and factory methods such as `fromAggregate(...)`;
- domain services are classes or pure modules that operate only on domain objects and return `Result`.

Avoid using plain interfaces as the main domain model for concepts with behavior, invariants, identity, lifecycle, or comparison.

Interfaces are still useful for immutable state snapshots, repository ports, visitors, and adapter contracts. They should not replace the class that owns domain behavior.

## Value Object Rules

Value objects should validate and normalize through factories, expose serialization deliberately, and contain behavior where it belongs.

Examples:

- `HP.increase(amount): Result<HP>`
- `HP.decrease(amount): Result<HP>`
- `Level.normalizeForRuleset(level): Result<Level>`
- `PokemonType.equals(other): boolean`

Use private constructors plus `create(...)` and `rehydrate(...)` when persistence needs trusted reconstruction.

For TypeScript nominal safety, add a private `unique symbol` brand field to value object and identifier classes when structurally identical classes could otherwise be assigned to each other:

```ts
const speciesIdBrand: unique symbol = Symbol("SpeciesId");

export class SpeciesId extends ScalarValueObject<string> {
  private [speciesIdBrand]!: void;

  private constructor(value: string) {
    super(value);
  }

  static create(raw: string): Result<SpeciesId, DomainError> {
    const value = raw.trim();
    if (!value) return err(domainError.validation("species_id_required"));
    return ok(new SpeciesId(value));
  }
}
```

Do not use branded type aliases as the primary model for domain-significant values when the value needs validation, normalization, comparison, serialization, or behavior. A class with a private brand gives both behavior and nominal typing.

## Primitive-Free Core Domain State

Core domain aggregate/entity/value-object state should not expose naked primitives for domain concepts:

```ts
// Avoid in core domain state.
export interface PokemonSpeciesState {
  readonly name: string;
  readonly nationalDexNumber: number;
  readonly tags: readonly string[];
}

// Prefer.
export interface PokemonSpeciesState {
  readonly name: PokemonSpeciesName;
  readonly nationalDexNumber: NationalDexNumber;
  readonly tags: readonly CatalogTag[];
}
```

Apply this to:

- names, labels, codes, messages, and descriptions that belong to the domain;
- ids and versions;
- counts, positions, amounts, probabilities, scores, levels, stats, speeds, durations, and turn numbers;
- flags and policies such as item clause or species clause;
- categories and literal unions such as move category or battle mode;
- tags, assumptions, risks, evidence lines, and next-check text.

Allowed primitive boundaries:

- private scalar storage inside a value object base or concrete value object;
- raw `create(...)` and `rehydrate(...)` input parameters;
- `toJSON()`, `toString()`, schema codecs, DTOs, CLI/API contracts, persistence rows, and tests;
- low-level non-domain plumbing when explicitly documented, such as generic error detail payloads.

If a value has no invariant today, still create a small value object when it is part of the ubiquitous language or aggregate state. This prevents later rules from leaking primitive manipulation throughout the core.

## Repository Ports

Prefer repository ports shaped around aggregate roots and specifications:

```ts
export interface TeamRepository {
  findOne(context: RepositoryContext, spec: TeamSelectionSpec): Promise<Result<Team | null, DomainError>>;
  upsert(context: RepositoryContext, team: Team, spec: TeamMutationSpec): Promise<Result<void, DomainError>>;
  deleteOne(context: RepositoryContext, spec: TeamSelectionSpec): Promise<Result<boolean, DomainError>>;
}
```

Repositories load and persist. They do not decide whether a transition is valid.

## Specification And Visitor Integration

Selection and mutation specs belong in `core` when they express domain language over aggregates. Adapter visitors belong in persistence adapters.

Required pattern:

- `TeamSelectionSpec`
- `TeamSelectionSpecVisitor<TResult>`
- `TeamByIdSpec`
- `TeamMutationSpec`
- `TeamMutationSpecVisitor<TResult>`
- `UpsertTeamSpec`

When adding a spec, update every visitor and add tests for in-memory satisfaction and adapter translation when an adapter exists.

## Command And Query Layer

Application behavior should enter through explicit messages:

- `ValidateTeamCommand`
- `ImportCatalogCommand`
- `GetPokemonSpeciesQuery`

Handlers parse validated input, load repositories/read models through ports, call aggregate/value-object/domain-service behavior, persist through repositories, publish events after persistence when applicable, and return read models or structured results.

Adapters dispatch commands/queries. They do not call repositories directly.

## Init Round Skeleton

If Init Round creates code, keep it structural and tactical:

- base `Result`, `DomainError`, `ValueObject`, `Entity`, `AggregateRoot`, `DomainEvent`;
- representative value objects for domain-significant primitives;
- representative aggregate/entity/value-object class shells for selected bounded contexts;
- repository port interfaces with selection/mutation specs;
- command/query message shells and operation catalog entries;
- adapter placeholders only.

Do not implement production behavior in Init Round. Do not skip these tactical skeletons and replace them with DTO interfaces.

## Init Round Gate

Before creating behavior implementation in a new TypeScript DDD project, verify these are present or explicitly deferred:

- source-of-truth docs folder with domain model, ubiquitous language, context map, decisions, operation catalog, command/query/event/error docs, and test matrix;
- local project profile skill that points back to `domain-driven-develop` and binds local source-of-truth paths;
- ADR for package shape when a monorepo or public contract is created;
- aggregate root/entity/value object classification for the first modeled contexts;
- value object inventory for every domain-significant primitive in core state;
- repository port shape using `RepositoryContext`, selection specs, mutation specs, and `Result`;
- specification visitor shape for persistence/read-model translation;
- stable test ids before Code Round;
- Git repository initialized unless the user says not to.
