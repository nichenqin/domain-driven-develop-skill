# Domain Events

Use this reference when a behavior creates, emits, consumes, publishes, projects, replays, backfills, renames, or tests events.

## Event Kinds

Keep event kinds distinct:

- Domain event: a fact that is meaningful inside a bounded context after a domain decision.
- Integration event: an external contract published for other bounded contexts, services, tools, or users.
- Application/process event: an application-layer signal for workflow coordination, scheduling, or orchestration when it is not a domain fact.
- Projection event input: an event consumed to update read models or search/query state.

Do not leak internal domain event payloads as integration contracts unless the project explicitly externalizes that shape.

## When To Use Events

Use an event when:

- the fact is business-meaningful and named in the ubiquitous language;
- another workflow, process manager, read model, notification, audit trail, or integration needs to react;
- the producer should not synchronously know every consumer;
- a durable history of facts matters.

Avoid an event when:

- the behavior is a private implementation callback;
- the consumer must be part of the same invariant decision;
- the event name is just a CRUD change such as `EntityUpdated` without domain meaning;
- a direct method call inside the same application service is clearer.

## Naming And Payload

Events should be named as past-tense facts:

- `DeploymentPlanned`
- `ResourceProvisioningFailed`
- `UserEmailVerified`

Avoid command-shaped or CRUD-shaped event names:

- `PlanDeployment`
- `UpdateDeployment`
- `DeploymentChanged`

Payload rules:

- include stable event identity when the project has event ids;
- include occurrence time using the project's time value object or clock policy;
- include aggregate/resource identity and correlation/causation ids when the project tracks them;
- include only facts consumers need, not mutable aggregate internals;
- use canonical domain terms from the bounded context;
- treat integration event payloads as versioned public contracts.

## Source Of Truth

Before Code Round, event semantics should be governed by source-of-truth docs:

- event name and kind;
- producer and owning bounded context;
- triggering command/workflow/state transition;
- payload fields and canonical terms;
- publication boundary and transaction/outbox policy;
- consumers and handler ownership;
- projection/read-model effects;
- retry, idempotency, ordering, replay, and backfill expectations;
- error handling and dead-letter or recovery policy when applicable;
- test matrix ids for emitted event, consumed event, and projection behavior.

If event semantics change command boundaries, lifecycle ownership, consistency, durable state, or external contracts, update a decision record before local specs or code.

## Emission Boundary

Aggregates or domain services may create domain events after making a valid domain decision. Application services collect, persist, and publish them according to project policy.

Common safe flow:

1. Validate command input.
2. Load or create aggregate.
3. Invoke aggregate behavior.
4. Collect domain events produced by the decision.
5. Persist aggregate state and event/outbox records in the required transaction boundary.
6. Publish or dispatch events only after the required persistence boundary succeeds.

Do not publish an event for a state change that failed to persist, unless the project has an explicit compensating-event model.

## Publication Patterns

Choose the lightest publication pattern that satisfies reliability and consistency:

- in-process handler after persistence;
- synchronous projection in the same transaction;
- transactional outbox followed by asynchronous publisher;
- message broker or queue;
- event store, only when event sourcing is explicitly chosen.

When publication is asynchronous, specify:

- retry policy;
- idempotency key;
- handler idempotency expectations;
- ordering constraints;
- dead-letter or failure recovery;
- observability and alerting;
- replay/backfill behavior.

## Handlers And Projections

Event handlers may:

- update read models or projections;
- start workflow/process-manager steps;
- enqueue notifications or integration work;
- translate domain events into integration events.

Event handlers should not:

- decide whether the original aggregate transition was allowed;
- mutate aggregate-owned state without a command or documented process policy;
- bypass aggregate invariants;
- hide core workflow branches that belong in specs or application services;
- depend on transport/framework request objects.

Projection handlers update read/query state. They should be idempotent, observable, and safe to replay when the project supports replay or backfill.

## Integration Events

Integration events are public contracts.

Rules:

- version them when payload compatibility matters;
- document consumers and compatibility policy;
- avoid leaking internal value-object or persistence shapes;
- translate from domain event to integration event at an application/adapter boundary;
- keep authorization, privacy, tenancy, and secret-masking rules explicit.

## Event Sourcing

Having events does not mean the system uses event sourcing.

Use event sourcing only when the event log is the source of truth and replay/reconstruction/audit is a deliberate architecture decision. Otherwise, treat events as facts emitted by a state-based write model.

## Testing

For changed event behavior, test matrix rows should cover:

- event emitted for the intended state transition;
- event not emitted when the command fails;
- payload fields and canonical terms;
- publication boundary, outbox write, or dispatch behavior;
- handler idempotency for duplicate delivery when applicable;
- projection/read-model update;
- retry/dead-letter behavior when applicable;
- replay/backfill behavior when applicable.

Automated test names or metadata should include the matrix ids they prove.

## Review Checklist

- Is the event a meaningful past-tense fact?
- Is the event kind clear: domain, integration, application/process, or projection input?
- Does the event use ubiquitous language?
- Is the producer and owner clear?
- Is the publication boundary documented?
- Are transaction/outbox/retry/idempotency/ordering expectations explicit?
- Are domain events translated before becoming external contracts?
- Do handlers avoid owning write-side policy?
- Are projection handlers replay-safe when replay/backfill is supported?
- Are emitted/consumed/projection tests tied to stable matrix ids?
