---
name: domain-driven-develop
description: Domain Driven Develop workflow for initializing, designing, specifying, implementing, and reviewing domain-driven software. Use when Codex needs to initialize a new product or project from a business idea, create project source-of-truth docs and a local project profile skill, add or change business behavior, create or check ADRs/decision records, design or review domain models, align code with source-of-truth domain docs, apply DDD tactical patterns, use spec-driven development, place logic across domain/application/adapters, design repositories and specifications, or enforce dependency injection and inversion-of-control boundaries.
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
2. If the user asks to start a new product/project from a business idea, read `references/project-initialization.md` and enter Init Round.
3. Otherwise read `references/project-source-of-truth.md` and locate the target repository's domain model, ADRs, behavior specs, API contracts, and test matrices.
4. Read `references/spec-driven-develop.md` to choose the current round: Init, Discover, Spec, Docs, Test-First, Code, Sync, Next Behavior Selection, or Post-Implementation Sync.
5. If the change may alter boundaries, lifecycle, ownership, canonical language, persistent shape, public contract, or cross-cutting policy, read `references/decisions-and-adrs.md` before local specs or code.
6. If code touches domain concepts, aggregate/entity/value-object state, repository or specification contracts, domain events, or behavior placement, load the relevant modeling references.
7. Verify the ubiquitous language before editing: names in docs, commands, events, tests, and code must match the bounded context language or be documented compatibility aliases.
8. Prefer TypeScript examples in this skill when the target language is unclear. For another language, preserve the same boundaries and translate the syntax idiomatically.

## Reference Map

Load only the files needed for the current task:

- `references/project-source-of-truth.md`: read before non-trivial work to bind generic categories to project files.
- `references/project-initialization.md`: read when the user asks to initialize a new product/project or the repository has no project-specific profile/domain docs yet.
- `references/spec-driven-develop.md`: read for workflow control, round selection, readiness gates, and sync behavior.
- `references/decisions-and-adrs.md`: read when deciding whether a behavior needs an ADR/decision record, or when changing boundaries, lifecycle, ownership, canonical language, persistence shape, or public contracts.
- `references/round-artifacts.md`: read before non-trivial edits to build the behavior dossier, classify artifacts, and choose incremental or complete readiness.
- `references/docs-round.md`: read when behavior changes user-visible language, input, output, status, recovery, workflows, or help surfaces.
- `references/next-behavior-selection.md`: read when choosing the next behavior after a behavior is implemented or mostly implemented.
- `references/domain-modeling.md`: read when discovering bounded contexts, ubiquitous language, ownership, lifecycle, and whether DDD is warranted.
- `references/context-boundaries.md`: read when bounded context, execution context, domain context, tracing, transactions, or i18n concerns are mixed.
- `references/error-handling.md`: read when modeling expected domain/application failures, error taxonomy, adapter translation, or no-throw Result style.
- `references/aggregate-root.md`: read when creating or changing aggregate roots, entities, invariants, state transitions, or domain events.
- `references/value-object.md`: read when modeling IDs, names, statuses, money, addresses, timestamps, ranges, or other domain-significant values.
- `references/domain-service.md`: read when a pure domain rule does not naturally belong to one aggregate or value object.
- `references/repository.md`: read when designing repository ports, persistence adapters, read models, or selection/mutation boundaries.
- `references/specification-and-visitor.md`: read when creating reusable business predicates, query/update specs, composite specs, SQL/API translation visitors, or avoiding `findBy...` repository proliferation.
- `references/application-layer.md`: read when placing orchestration, command/query handlers, use cases, unit-of-work boundaries, event publication, and side effects.
- `references/dependency-injection-ioc.md`: read when wiring dependencies, deciding constructor injection versus service locator, or keeping composition separate from use.
- `references/language-typescript.md`: read when the target implementation uses TypeScript or when examples need a concrete language.
- `references/verification.md`: read before finishing Code or Sync work.
- `references/review-checklist.md`: read for domain-driven implementation review or before finalizing substantial changes.
- `references/example-repositories.md`: read when concrete public examples would help calibrate tradeoffs.
- `references/reading-list.md`: use for source links and conceptual grounding.

## Hard Rules

- Project source-of-truth documents override this skill's examples.
- Do not duplicate project domain facts inside this skill. Point to project files instead.
- Use the bounded context's ubiquitous language consistently in docs, code, tests, events, errors, APIs, CLI commands, and UI/help text. Do not introduce synonyms, transport-only names, or legacy aliases without documenting the mapping.
- Do not put persistence, framework, transport, tracing SDK, queue, filesystem, or provider SDK logic inside aggregates, entities, value objects, or specifications.
- Do not let repositories answer business-policy questions. Repositories load, persist, and translate specifications; aggregates and application services make business decisions.
- Do not add broad update commands or generic setters when a domain operation can name the intent.
- Do not add service-locator calls inside domain objects, use cases, or handlers unless the project explicitly documents that exception.
- Do not settle cross-boundary architecture, ownership, lifecycle, public-contract, or canonical-language decisions only in code or local behavior specs. Create or update a decision record, or document why no decision record is needed.
- Do not bypass source-of-truth specs during Code Round. If the intended behavior is unclear, return to Spec Round.

## Code Round Trigger

When Code Round touches the domain model, apply these references together:

1. Project-specific domain facts from the target repository.
2. `references/domain-modeling.md`
3. `references/decisions-and-adrs.md` when the change crosses a decision threshold, or to record why no decision record is needed.
4. `references/round-artifacts.md` for dossier and artifact readiness when the change is non-trivial.
5. The relevant tactical reference, such as aggregate root, value object, repository, specification/visitor, application layer, error handling, context boundaries, or DI/IoC.
6. `references/verification.md` before final output.

Use examples as patterns, not as project facts.
