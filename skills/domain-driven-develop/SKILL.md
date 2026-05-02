---
name: domain-driven-develop
description: Domain Driven Develop workflow for initializing, discovering, specifying, testing, implementing, synchronizing, reporting, and reviewing domain-driven software. Use when Codex needs to initialize a product from a business idea, create project source-of-truth docs and a local profile skill, add or change business behavior, run event-storming-style discovery, create spec.md/plan.md/tasks.md feature artifacts, check ADRs/decision records, design or review domain models, align code with domain docs, apply DDD tactical patterns, design domain or integration events, decide whether CQRS is warranted, separate command/query flows, shape read models and projections, align test matrices with stable ids and implementation tests, maintain round checklists and final reports, align roadmap/version/SemVer gates, place logic across domain/application/adapters, design repositories and specifications, or enforce dependency injection and inversion-of-control boundaries.
---

# Domain Driven Develop

## Overview

Use this skill to develop business software from domain intent to code without losing the model. It combines a spec-driven workflow with domain-driven design guardrails, and keeps project-specific domain facts in project documents rather than inside the skill.

Do not treat this skill as a generic permission to code. Use it to initialize or find the right source-of-truth documents, select the next development round, then implement only when the model, behavior specs, tests, and integration surfaces are sufficiently clear.

Ubiquitous language is mandatory. The same domain terms must describe the same behavior in source-of-truth docs, code, tests, entrypoints, errors, events, and public help. If names drift, stop and reconcile the language before expanding implementation.

## Operating Model

Domain Driven Develop has three layers:

1. Process control: `references/spec-driven-develop.md`
2. Domain modeling guardrails: the module references such as `aggregate-root.md`, `value-object.md`, `repository.md`, `specification-and-visitor.md`, and `dependency-injection-ioc.md`
3. Project-specific facts: files in the target repository, such as `AGENTS.md`, `docs/DOMAIN_MODEL.md`, ADRs, command specs, workflow specs, API contracts, operation catalogs, and test matrices

Keep these layers separate. This skill defines method and code shape. The project defines the actual domain language, bounded contexts, aggregate ownership, lifecycle rules, and entrypoint contracts.

## First Steps

1. Identify the requested behavior or modeling question.
2. If this skill is explicitly named by the user, treat the skill body and the relevant references as binding input for the turn. Do not proceed from memory or from the metadata description alone.
3. If the user asks to start a new product/project from a business idea, read `references/project-initialization.md` and enter Init Round.
4. Otherwise read `references/project-source-of-truth.md` and locate the target repository's domain model, ADRs, behavior specs, API contracts, and test matrices.
5. Read `references/spec-driven-develop.md` to choose the current round: Init, Discover, Spec, Docs, Testing/Test-First, Code, Sync, Next Behavior Selection, or Post-Implementation Sync.
6. If the behavior is new, formal, or the project profile adopts feature artifacts, read `references/spec-plan-tasks-artifacts.md`.
7. If the behavior, language, workflow, or domain ownership is unclear, read `references/event-storming-discovery.md` for Discover Round inputs.
8. If the user asks what to build next, changes a public surface, asks about release readiness, or the behavior may affect compatibility, read `references/roadmap-and-versioning.md`.
9. If the change crosses bounded contexts, teams, external systems, published contracts, upstream/downstream relationships, or legacy models, read `references/context-map-and-anticorruption.md`.
10. If the change may alter boundaries, lifecycle, ownership, canonical language, persistent shape, public contract, or cross-cutting policy, read `references/decisions-and-adrs.md` before local specs or code.
11. Before non-trivial edits, read `references/round-checklists.md` to create the round todo and coverage checklist.
12. If the change creates, emits, consumes, projects, publishes, replays, or renames events, read `references/domain-events.md`.
13. If the change involves commands, queries, read models, projections, event publication, bus boundaries, or read/write consistency, read `references/cqrs-with-ddd.md`.
14. If tests, acceptance criteria, or behavior coverage are in scope, read `references/testing-traceability.md` and bind changed behavior to stable test ids before Code Round.
15. If code touches domain concepts, aggregate/entity/value-object state, repository or specification contracts, domain events, or behavior placement, load the relevant modeling references.
16. Verify the ubiquitous language before editing: names in docs, commands, events, tests, and code must match the bounded context language or be documented compatibility aliases.
17. Prefer TypeScript examples in this skill when the target language is unclear. For another language, preserve the same boundaries and translate the syntax idiomatically.
18. For a new TypeScript DDD project or a structural reset, read `references/tactical-typescript-project-structure.md` before creating packages or code. Default to `core -> application -> adapters/apps` and class-based tactical domain objects unless the project source of truth explicitly chooses another architecture.

## Reference Map

Load only the files needed for the current task. Keep reference files flat under `references/`
so each file remains directly linked from this `SKILL.md`; use these groups to choose the
right control plane before loading details.

### Source Of Truth And Workflow Control

- `references/project-source-of-truth.md`: read before non-trivial work to bind generic categories to project files.
- `references/project-initialization.md`: read when the user asks to initialize a new product/project or the repository has no project-specific profile/domain docs yet.
- `references/spec-driven-develop.md`: read for workflow control, round selection, readiness gates, and sync behavior.
- `references/event-storming-discovery.md`: read during Discover Round when domain events, commands, actors, policies, aggregates, or ubiquitous language are not clear.
- `references/next-behavior-selection.md`: read when choosing the next behavior after a behavior is implemented or mostly implemented.
- `references/roadmap-and-versioning.md`: read when selecting the next behavior, checking release readiness, changing public surfaces, classifying compatibility impact, or applying SemVer.
- `references/decisions-and-adrs.md`: read when deciding whether a behavior needs an ADR/decision record, or when changing boundaries, lifecycle, ownership, canonical language, persistence shape, or public contracts.

### Round Artifacts And Synchronization

- `references/spec-plan-tasks-artifacts.md`: read when creating or using feature-level `spec.md`, `plan.md`, and `tasks.md` artifacts for new formal behavior.
- `references/round-artifacts.md`: read before non-trivial edits to build the behavior dossier, classify artifacts, and choose incremental or complete readiness.
- `references/round-checklists.md`: read after the dossier exists and before editing files in a concrete round; contains minimum todo outcomes and synchronization surfaces.
- `references/docs-round.md`: read when behavior changes user-visible language, input, output, status, recovery, workflows, or help surfaces.
- `references/testing-traceability.md`: read when adding or changing behavior tests, test matrices, acceptance criteria, stable test ids, automation levels, or Code Round test bindings.
- `references/reporting.md`: read for Discovery output, formal round summaries, artifact-state reports, coverage reports, and ready/not-ready reporting.
- `references/verification.md`: read before finishing Code or Sync work.
- `references/review-checklist.md`: read for domain-driven implementation review or before finalizing substantial changes.

### Domain Modeling And Architecture Guardrails

- `references/domain-modeling.md`: read when discovering bounded contexts, ubiquitous language, ownership, lifecycle, and whether DDD is warranted.
- `references/context-boundaries.md`: read when bounded context, execution context, domain context, tracing, transactions, or i18n concerns are mixed.
- `references/context-map-and-anticorruption.md`: read when a behavior crosses bounded contexts, teams, external systems, published languages, upstream/downstream relationships, or legacy models.
- `references/domain-events.md`: read when designing, emitting, consuming, publishing, projecting, replaying, backfilling, versioning, or testing domain/integration events.
- `references/cqrs-with-ddd.md`: read when deciding whether CQRS is warranted, separating command/query flows, shaping read models, designing projections, or making consistency/event tradeoffs.
- `references/error-handling.md`: read when modeling expected domain/application failures, error taxonomy, adapter translation, or no-throw Result style.
- `references/aggregate-root.md`: read when creating or changing aggregate roots, entities, invariants, state transitions, or domain events.
- `references/value-object.md`: read when modeling IDs, names, statuses, money, addresses, timestamps, ranges, or other domain-significant values.
- `references/domain-service.md`: read when a pure domain rule does not naturally belong to one aggregate or value object.
- `references/repository.md`: read when designing repository ports, persistence adapters, read models, or selection/mutation boundaries.
- `references/specification-and-visitor.md`: read when creating reusable business predicates, query/update specs, composite specs, SQL/API translation visitors, or avoiding `findBy...` repository proliferation.

### Tactical Implementation Rules

- `references/application-layer.md`: read when placing orchestration, command/query handlers, use cases, unit-of-work boundaries, event publication, and side effects.
- `references/dependency-injection-ioc.md`: read when wiring dependencies, deciding constructor injection versus service locator, or keeping composition separate from use.
- `references/language-typescript.md`: read when the target implementation uses TypeScript or when examples need a concrete language.
- `references/tactical-typescript-project-structure.md`: read when initializing or restructuring a TypeScript DDD project, choosing package layout, creating aggregate/entity/value-object classes, repository ports, selection/mutation specifications, visitors, command/query application layers, or adapter boundaries.

### Calibration And Sources

- `references/example-repositories.md`: read when concrete public examples would help calibrate tradeoffs.
- `references/reading-list.md`: use for source links and conceptual grounding.

## Hard Rules

- Project source-of-truth documents override this skill's examples.
- Do not duplicate project domain facts inside this skill. Point to project files instead.
- Do not place project roadmap targets, release promises, version numbers, or product milestones inside this global skill. Bind them in the target repository or local project profile.
- Do not classify a change as patch, minor, major, compatible, or breaking until the project's public surface and version policy are known.
- Do not retrofit historical behavior into `spec.md`/`plan.md`/`tasks.md` artifacts unless the user or project profile explicitly asks for backfill. Apply feature artifacts forward for new formal behavior.
- Do not create feature artifacts as a competing source of truth. They must point to and synchronize the project's domain model, decisions, local specs, test matrices, public docs, and implementation plans.
- Use the bounded context's ubiquitous language consistently in docs, code, tests, events, errors, APIs, CLI commands, and UI/help text. Do not introduce synonyms, transport-only names, or legacy aliases without documenting the mapping.
- Do not let one domain model silently serve multiple bounded contexts. Cross-context collaboration needs an explicit context relationship, published language, translation boundary, or documented shared-kernel choice.
- Do not put persistence, framework, transport, tracing SDK, queue, filesystem, or provider SDK logic inside aggregates, entities, value objects, or specifications.
- Do not let repositories answer business-policy questions. Repositories load, persist, and translate specifications; aggregates and application services make business decisions.
- Do not add business-specific repository methods such as `findById`, `findByRequestId`, `findActiveByOwner`, or `markXDone` when a named selection or mutation spec can express the rule. Repository ports should expose stable collection-shaped operations such as `findOne(context, spec)`, `findMany(context, spec)`, `upsert(context, aggregate, spec)`, and `deleteOne(context, spec)`.
- Treat specifications and their composition as part of the domain model, not as transport DTOs or persistence filter bags. A composed spec tree represents business logic; repository adapters translate that tree without owning its meaning.
- Do not let query handlers mutate business state or command handlers answer rich read-model questions. Keep read and write responsibilities separate when the project uses CQRS.
- Do not treat CQRS, command-bus classes, or domain events as proof that event sourcing or separate databases are required.
- Do not publish event facts before the domain decision and required persistence boundary succeed. Do not let event handlers or projections own write-side business policy.
- Do not add broad update commands or generic setters when a domain operation can name the intent.
- Do not add service-locator calls inside domain objects, use cases, or handlers unless the project explicitly documents that exception.
- Do not model domain-significant concepts as loose TypeScript interfaces, primitive aliases, or data bags when they have identity, invariants, lifecycle transitions, comparison, normalization, or behavior. Use classes for aggregate roots, entities, value objects, specifications, and domain services unless the project source of truth explicitly documents a different tactical style.
- Do not put naked primitives such as `string`, `number`, `boolean`, string literal unions, or primitive arrays in aggregate/entity/value-object state for core domain concepts. Wrap them in value object classes or entities. Primitive values are allowed only inside value object internals, factory/rehydration inputs, serialization/DTO boundaries, tests, and explicitly non-domain plumbing such as error transport details.
- Do not let aggregate roots, entities, or value objects become thin wrappers around primitives. They should expose intention-revealing behavior for domain questions, comparisons, transitions, and constrained changes.
- Do not place value-object collaboration logic in helpers or domain services when the value objects are owned by one entity or aggregate root. If a calculation combines multiple owned value objects inside one entity, the entity owns that behavior. If a calculation coordinates multiple child entities or owned value objects inside one consistency boundary, the aggregate root owns that behavior.
- Do not make domain services the primary home for intra-aggregate calculations. Domain services should call aggregate-root/entity/value-object methods and coordinate policies across already-loaded aggregate roots or genuinely cross-object rules; they should not repeatedly inspect child state that an aggregate root or entity can expose through domain methods.
- Do not implement core domain decisions by peeling state with `toState().x.value` or equivalent primitive inspection. `toState()` belongs at serialization, persistence, read-model, logging, fixture, assertion, and adapter boundaries. Inside domain behavior, prefer methods such as `isActive()`, `appliesTo(...)`, `canTransitionTo(...)`, `increase(...)`, `decrease(...)`, `capAt(...)`, or aggregate-root operations named in ubiquitous language.
- Do not move behavior into a domain service or helper merely to avoid adding methods to a value object, entity, or aggregate root. Use a domain service only when the rule genuinely spans multiple domain concepts or policies and cannot naturally live on one object.
- Do not accept value-object or entity tests that only cover construction when new public domain behavior exists. Tests should cover exposed predicates, comparisons, transitions, clamping/capping behavior, and invalid transition results.
- Do not create one package per bounded context by default in TypeScript projects. Prefer a small `core` package containing bounded-context directories for tactical domain objects, an `application` package for commands/queries/use cases/ports, and adapter/app packages outside the core. Split bounded contexts into separate packages only after an ADR explains the dependency and lifecycle need.
- Do not enter Code Round for domain behavior until aggregate roots, entities, value objects, repository ports, selection/mutation specs, and visitor translation boundaries are either modeled in source-of-truth docs or explicitly marked not-applicable with a domain reason.
- Do not settle cross-boundary architecture, ownership, lifecycle, public-contract, or canonical-language decisions only in code or local behavior specs. Create or update a decision record, or document why no decision record is needed.
- Do not implement changed behavior without stable test matrix/spec ids and automated test bindings, unless the testing source of truth explicitly records why coverage is not applicable or deferred.
- Do not ship release-sensitive behavior without recording roadmap target, compatibility impact, and public-surface documentation or an explicit not-applicable/deferred reason.
- Do not start the next round while mandatory checklist items remain unchecked, unless each gap is moved to a documented later round, `not-applicable` state, or `deferred-gap`.
- Do not bypass source-of-truth specs during Code Round. If the intended behavior is unclear, return to Spec Round.
- Do not report completion without stating the active round, source-of-truth artifacts changed, verification performed, and deferred gaps.

## Tactical Ownership Examples

All generic TypeScript examples in this skill use an order/payment domain. Keep future examples in the same domain unless a project-specific profile supplies its own domain facts.

Value objects must own local validation, comparison, state questions, and constrained arithmetic:

```ts
// Do.
export class PaymentAmount {
  private constructor(public readonly value: number) {}

  static create(value: number): Result<PaymentAmount, DomainError> {
    if (!Number.isInteger(value) || value < 0) {
      return err(domainError.validation("payment_amount_invalid"));
    }
    return ok(new PaymentAmount(value));
  }

  static zero(): PaymentAmount {
    return new PaymentAmount(0);
  }

  add(other: PaymentAmount): PaymentAmount {
    return new PaymentAmount(this.value + other.value);
  }

  multiply(quantity: OrderLineQuantity): PaymentAmount {
    return new PaymentAmount(this.value * quantity.value);
  }

  covers(total: PaymentAmount): boolean {
    return this.value >= total.value;
  }
}

// Avoid.
if (payment.toState().amount.value >= order.toState().total.value) {
  // payment decision by primitive peeling
}
```

Entities must own calculations across their own value objects:

```ts
// Do.
export class OrderLine extends Entity<OrderLineState, OrderLineId> {
  lineTotal(): PaymentAmount {
    return this.state.unitPrice.multiply(this.state.quantity);
  }
}

// Avoid.
const total = line.toState().unitPrice.value * line.toState().quantity.value;
```

Aggregate roots must coordinate child entities and owned value objects inside one consistency boundary:

```ts
// Do.
export class Order extends AggregateRoot<OrderState, OrderId> {
  payableAmount(): PaymentAmount {
    return this.lines().reduce((sum, line) => sum.add(line.lineTotal()), PaymentAmount.zero());
  }

  authorizePayment(payment: Payment): Result<Order, DomainError> {
    if (!payment.amount().covers(this.payableAmount())) {
      return err(domainError.invariant("payment_amount_insufficient"));
    }
    return ok(new Order({ ...this.state, status: this.state.status.markPaid() }));
  }
}

// Avoid.
const total = order
  .toState()
  .lines.reduce((sum, line) => sum + line.unitPrice.value * line.quantity.value, 0);
if (payment.toState().amount.value >= total) order.toState().status = OrderStatus.paid();
```

Domain services coordinate already-loaded aggregate roots or genuinely cross-owner policies. They should call aggregate/entity/value-object methods rather than own intra-aggregate calculations:

```ts
// Do.
export class OrderPaymentPolicy {
  authorize(order: Order, payment: Payment): Result<Order, DomainError> {
    if (!order.canAcceptPayment()) return err(domainError.invariant("order_not_payable"));
    return order.authorizePayment(payment);
  }
}

// Avoid.
export class OrderPaymentHelper {
  authorize(order: Order, payment: Payment): Result<Order, DomainError> {
    const total = order
      .toState()
      .lines.reduce((sum, line) => sum + line.unitPrice.value * line.quantity.value, 0);
    if (payment.toState().amount.value < total) {
      return err(domainError.invariant("payment_amount_insufficient"));
    }
    // service owns intra-aggregate calculation and transition
  }
}
```

## Code Round Trigger

When Code Round touches the domain model, apply these references together:

1. Project-specific domain facts from the target repository.
2. `references/spec-plan-tasks-artifacts.md` when the project uses feature artifacts for this behavior.
3. `references/roadmap-and-versioning.md` when the change affects roadmap commitments, release readiness, version targets, public surfaces, or compatibility.
4. `references/domain-modeling.md`
5. `references/context-map-and-anticorruption.md` when the change crosses contexts, teams, external systems, published languages, or legacy models.
6. `references/decisions-and-adrs.md` when the change crosses a decision threshold, or to record why no decision record is needed.
7. `references/domain-events.md` when the change affects domain events, integration events, event handlers, projections, outbox/publication, replay, backfill, or event specs.
8. `references/cqrs-with-ddd.md` when the change affects command/query boundaries, read models, projections, buses, events, or consistency.
9. `references/testing-traceability.md` when behavior tests, acceptance criteria, or implementation coverage are in scope.
10. `references/round-artifacts.md` for dossier and artifact readiness when the change is non-trivial.
11. The relevant tactical reference, such as aggregate root, value object, repository, specification/visitor, application layer, error handling, context boundaries, or DI/IoC.
12. `references/tactical-typescript-project-structure.md` when the code is TypeScript and changes package layout or core/application/adapter boundaries.
13. `references/verification.md` before final output.

Use examples as patterns, not as project facts.
