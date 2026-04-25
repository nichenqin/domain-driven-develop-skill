# Project Initialization

Use this reference when the user asks to initialize a new product/project from a business idea, such as "I want to build a CRM", or when a repository has no project-specific domain docs and local project profile skill yet.

## Init Round

Init Round creates the source-of-truth foundation for future Spec, Test-First, and Code rounds. It should produce docs and a thin project profile, not production code.

If the user names `domain-driven-develop`, asks for "Init Round", or asks for "Spec Round", treat the round as an explicit workflow requirement. Do not jump directly to implementation.

Use Init Round when:

- the user describes a new business product or domain;
- the repository lacks a domain model;
- there is no local project profile skill;
- behavior specs and test matrices do not exist yet;
- the user asks to "set up DDD/spec-driven development" for a project.

## Inputs

Use what the user provides. If the business idea is too vague to create a useful first model, ask up to three concise questions. Otherwise make reasonable assumptions and record them under `Open Questions`.

Capture:

- product category and target users;
- core business outcomes;
- key workflows;
- entities users naturally name;
- user-visible entrypoints;
- expected roadmap or versioning style if mentioned;
- compliance, security, or audit constraints if mentioned;
- language preferences and supported locales if mentioned.

## Required Outputs

Create or update these artifacts when they fit the repository:

```text
.codex/skills/<project>-develop/SKILL.md
docs/DOMAIN_MODEL.md
docs/decisions/README.md
docs/roadmap/README.md
specs/README.md
docs/operations/README.md
docs/commands/README.md
docs/queries/README.md
docs/events/README.md
docs/workflows/README.md
docs/errors/README.md
docs/testing/README.md
docs/documentation/README.md
```

When the product will expose commands, APIs, AI tools, or other public contracts, also create contract-oriented docs during Init Round:

```text
docs/UBIQUITOUS_LANGUAGE.md
docs/CONTEXT_MAP.md
docs/ARCHITECTURE.md
docs/CLI_CONTRACTS.md
docs/TOOL_MANIFEST.md
docs/TESTING_STRATEGY.md or docs/testing/TEST_MATRIX.md
docs/DATA_VERSIONING.md
docs/specs/<id>-<slug>/spec.md
docs/specs/<id>-<slug>/plan.md
docs/specs/<id>-<slug>/tasks.md
```

Use existing project paths if they already exist. Do not create duplicate competing docs.

For new TypeScript DDD projects, also read `tactical-typescript-project-structure.md` before creating packages or code. Init Round may create a tactical skeleton, but it should be class-based and structural only:

- `packages/core` with `shared/` and bounded-context directories;
- base `Result`, `DomainError`, `ValueObject`, `Entity`, `AggregateRoot`, and `DomainEvent`;
- representative aggregate root, entity, value object, specification, and mutation-spec classes that match `docs/DOMAIN_MODEL.md`;
- a value object inventory for domain-significant primitives so core aggregate/entity/value-object state does not use naked `string`, `number`, `boolean`, literal unions, or primitive arrays;
- `packages/application` with command/query messages, handlers/use-case placeholders, repository/read-model ports, execution context, and operation catalog;
- adapter/app placeholders that depend inward.

Do not default to one package per bounded context. Split bounded contexts into packages only when an ADR documents independent lifecycle, ownership, distribution, or build constraints.

Do not implement a behavior command, persistence adapter, simulator, recommender, or formula in Init Round unless the user explicitly narrows the task to that Code Round and the required spec/test artifacts already exist.

If the target directory is not already a Git repository, run `git init` during Init Round unless the user explicitly says not to. This gives future Sync and Code Rounds a reliable change boundary.

## Project Profile Skill

Create a thin local skill named `<project>-develop` when the repository supports local skills.

The profile should:

- say to use the global `domain-driven-develop` skill;
- bind source-of-truth categories to local paths;
- require ubiquitous language consistency;
- point to `docs/DOMAIN_MODEL.md` and behavior specs;
- bind the project's package boundaries, operation catalog, feature artifact directory, and test matrix conventions;
- require Spec Round before Code Round for new public behavior;
- avoid copying domain facts from the docs.

The profile may still be detailed about workflow and local paths. "Thin" means it points to source-of-truth documents instead of duplicating business facts; it does not mean vague.

Template:

```md
---
name: <project>-develop
description: Project-specific Domain Driven Develop profile for <Project>. Use with the global domain-driven-develop skill when Codex works on this repository's business behavior, domain model, specs, tests, entrypoints, or implementation.
---

# <Project> Develop Profile

Use the global `domain-driven-develop` skill as the method and workflow. This profile binds that method to this repository's source-of-truth files.

Do not duplicate project domain facts in this profile. The domain model and specs below win.

## Source Of Truth

1. Repository rules: `AGENTS.md`, `CONTRIBUTING.md`, or equivalent when present.
2. Domain model: `docs/DOMAIN_MODEL.md`.
3. Decisions: `docs/decisions/**`.
4. Roadmap and version policy: `docs/roadmap/**`.
5. Feature artifacts for new formal behavior: `specs/<id>-<slug>/spec.md`, `plan.md`, and `tasks.md`.
6. Operations: `docs/operations/**`.
7. Commands: `docs/commands/**`.
8. Queries: `docs/queries/**`.
9. Events: `docs/events/**`.
10. Workflows: `docs/workflows/**`.
11. Errors: `docs/errors/**`.
12. Testing: `docs/testing/**`.
13. Public docs/help: `docs/documentation/**`.

## Required Behavior

- Use the bounded context's ubiquitous language in docs, code, tests, events, errors, APIs, CLI commands, UI text, and help text.
- Treat undocumented naming drift as a blocker for Code Round.
- Keep this profile thin. Update `docs/DOMAIN_MODEL.md` or the relevant spec instead of adding facts here.
- When Code Round touches domain modeling, apply the relevant global references from `domain-driven-develop`.
```

## Domain Model Template

`docs/DOMAIN_MODEL.md` should define the business model, not implementation mechanics:

```md
# Domain Model

> CORE DOCUMENT
>
> This file is the domain-model source of truth for <Project>.
> If package layout, code names, tests, or entrypoints conflict with this file, reconcile them or document a compatibility alias.

## Product Goal

- 

## Ubiquitous Language

| Canonical term | Meaning | Forbidden or legacy terms | Compatibility alias notes |
| --- | --- | --- | --- |
|  |  |  |  |

## Bounded Contexts

### <Context>

Owns:
- <AggregateRoot>

Boundary rules:
- 

## Aggregate Roots

### <AggregateRoot>

Owns:
- entities:
- value objects:

Invariants:
- 

Domain operations:
- 

Events:
- 

## Current Implementation Notes And Migration Gaps

- 

## Open Questions

- 
```

## Spec Foundation

Create initial docs that are useful enough for the next round:

- `docs/operations/README.md`: operation map or behavior catalog.
- `docs/roadmap/README.md`: current target, milestone policy, versioning policy, and release-gate checklist when the project needs releases.
- `specs/README.md`: feature artifact convention for new formal behavior, including `spec.md`, `plan.md`, and `tasks.md` roles.
- `docs/decisions/README.md`: decision record index, status conventions, and ADR/no-ADR-needed policy.
- `docs/commands/README.md`: command naming and write-side operation specs.
- `docs/queries/README.md`: query/read-model specs.
- `docs/events/README.md`: domain and integration event specs.
- `docs/workflows/README.md`: multi-step workflow specs.
- `docs/errors/README.md`: error categories, codes, and recovery semantics.
- `docs/testing/README.md`: test matrix rows, stable ids, automation levels, and test-binding conventions.
- `docs/documentation/README.md`: public docs/help outcome decisions.

Each should use the same ubiquitous language as `docs/DOMAIN_MODEL.md`.

The decisions foundation should make clear that ADRs are required for durable boundary, lifecycle, ownership, canonical language, persistence shape, and public-contract choices, while small local behavior details can record a no-ADR-needed rationale in the behavior dossier.

## Initial Behavior Backlog

For a new project, include a short behavior backlog:

```md
## Initial Behavior Backlog

| Behavior | Bounded context | Owner | Round needed next | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | Spec Round |  |
```

Recommend one next behavior and its next round, then stop. Do not write production code in Init Round.
