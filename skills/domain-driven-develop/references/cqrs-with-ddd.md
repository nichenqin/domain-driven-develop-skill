# CQRS With DDD

Use this reference when a system separates state-changing work from state-reading work, or when deciding whether that separation is worth the cost.

## Decide Whether CQRS Is Warranted

Use CQRS when it solves a real asymmetry:

- reads and writes have meaningfully different shapes, performance needs, scaling patterns, or change rates;
- the write side protects real business invariants;
- the read side needs flatter, denormalized, cross-aggregate, or client-shaped views;
- the system already emits meaningful domain or integration events that can feed projections;
- the product can tolerate and explain the chosen consistency model.

Avoid CQRS when:

- the service is mostly CRUD;
- commands and queries use the same simple data shape;
- separate write/read models add ceremony without reducing complexity;
- eventual consistency would hurt product behavior more than the split helps;
- the only result is `CreateXCommand` and `GetXQuery` wrappers around direct repository calls.

DDD does not require CQRS. CQRS does not imply DDD.

## Core Distinctions

- A command represents intent to change state.
- A query returns state and should not perform business mutations.
- The write side protects invariants and emits domain facts.
- The read side serves the shape consumers need, even if that ignores aggregate boundaries.
- CQRS does not require event sourcing.
- CQRS does not require separate databases, though the tradeoff may justify them.
- A command bus library does not prove the architecture has meaningful CQRS.

## Modeling Flow

1. Decide whether CQRS solves a real problem.
2. Identify command use cases that make business decisions.
3. Model the write side with DDD: aggregates, value objects, repositories, domain services, and domain events when justified.
4. Model the read side around view models, DTOs, projections, and query latency needs.
5. Choose how read models get updated: same transaction, synchronous projection, asynchronous projection, integration events, or on-demand query-side reads.
6. Make consistency expectations explicit to users, tests, and other services.

## Write Side

The write side should carry the business model.

Typical flow:

1. Validate transport concerns at the edge.
2. Create a command object or input schema in domain/application language.
3. Load or create the aggregate through a repository.
4. Invoke aggregate behavior or a domain service.
5. Persist through the repository.
6. Publish or dispatch follow-up events after the write succeeds.

Keep command handlers or application services thin. They coordinate; aggregates and domain services decide.

Avoid:

- controllers or adapters containing business invariants;
- command buses making domain decisions;
- repository implementations deciding whether business transitions are allowed;
- broad `UpdateXCommand` shapes when a named business command can express intent.

## Command-Side Errors

Expected command-side failures are part of the model:

- invalid command payload;
- missing aggregate;
- invariant violation;
- state conflict;
- authorization failure.

When the codebase supports explicit result types, prefer `Result<T, DomainError>` or the project equivalent for expected failures across command factories, aggregates, repositories, and application services.

Do not `throw` for validation errors, invariant violations, not-found cases, or normal command-side control flow unless the project intentionally uses exception-based domain flow.

Keep transport translation at adapter boundaries, for example:

- validation -> HTTP 400 or CLI input error;
- not-found -> HTTP 404;
- conflict -> HTTP 409;
- forbidden -> HTTP 403;
- invariant -> HTTP 422 or a domain-specific contract.

## Read Side

The read side should optimize for consumers, not aggregate purity.

It may:

- return DTOs or view models shaped for clients;
- join across tables, projections, or bounded-context read stores;
- use direct SQL, query builders, read repositories, or projection stores;
- ignore aggregate boundaries when the read use case needs a flatter shape.

Query handlers should not:

- mutate business state before answering;
- enforce write-side invariants unless the query genuinely includes authorization or access checks;
- rehydrate rich aggregates only to produce simple list or summary DTOs;
- leak aggregate internals as the public read contract.

## Consistency And Projections

Choose the lightest update strategy that satisfies the use case:

- same transaction and same store, separate command/query code paths;
- same store with read tables or views;
- asynchronous projections into read tables;
- separate read database fed by events or replication;
- on-demand query-side reads with read-optimized SQL.

Make these expectations explicit:

- whether read-your-own-write consistency is required;
- how stale reads appear to users;
- what retries, refresh behavior, status transitions, or pending states exist;
- how projections handle idempotency, retry, backfill, replay, and monitoring when asynchronous.

Treat eventual consistency as a product and operational concern, not only a technical detail.

## Events

Read `domain-events.md` for detailed event design, publication, handler, projection, replay, and testing rules.

Domain events and integration events are different:

- domain events describe meaningful facts inside the write-side model or bounded context;
- integration events are external contracts for other bounded contexts, systems, or services.

Do not leak internal domain-event shapes across service boundaries unless that shape is intentionally externalized. Do not publish events before the domain decision and persistence boundary required by the project have succeeded.

## Review Checklist

- Is CQRS solving a real read/write asymmetry?
- Is the write side modeled around business decisions rather than CRUD record updates?
- Are commands named by intent?
- Is command-side failure explicit and consistent?
- Are aggregates and repositories confined to the write side unless there is a strong reason otherwise?
- Are query handlers returning read-optimized models?
- Is the consistency model explicit?
- Are projection ownership, retry, idempotency, and drift monitoring addressed when projections are asynchronous?
- Are domain events and integration events clearly distinguished?
- Has the design avoided accidentally requiring event sourcing where it is not needed?
