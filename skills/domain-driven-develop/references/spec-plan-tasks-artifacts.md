# Spec Plan Tasks Artifacts

Use this reference when a project adopts feature-level artifacts for new formal behavior, or when the user asks for a Spec Kit style `spec.md`, `plan.md`, and `tasks.md` workflow.

This convention is forward-looking. Do not backfill existing behavior unless the user or project profile explicitly asks.

## Directory Shape

Use the project profile's path convention. If none exists, prefer:

```text
specs/<nnn>-<behavior-slug>/
  spec.md
  plan.md
  tasks.md
  research.md
  contracts/
  quickstart.md
```

Use `docs/specs/<nnn>-<behavior-slug>/` when the project keeps all source-of-truth artifacts under `docs/`.

`<nnn>` is stable ordering, not priority. `<behavior-slug>` should use the project's ubiquitous language.

## Artifact Roles

| Artifact | Role | Must Not |
| --- | --- | --- |
| `spec.md` | WHAT and WHY: business outcome, user stories, domain language, scenarios, acceptance criteria, open questions, non-goals. | Choose frameworks, database shape, package structure, or implementation details. |
| `plan.md` | HOW at architecture level: owning context, decision links, implementation strategy, public contracts, data/read-model impact, tests, rollout, migration, risks. | Bypass unresolved spec questions or invent domain facts not in `spec.md` or source-of-truth docs. |
| `tasks.md` | Executable ordered checklist: test-first tasks, code tasks, docs tasks, verification, sync, final report. | Hide broad work in vague tasks such as "implement feature". |
| `research.md` | Optional decision support: libraries, constraints, alternatives, risks. | Override accepted decisions or source-of-truth docs. |
| `contracts/` | Optional public/API/CLI/event/config contract sketches. | Become a second public contract that diverges from the canonical contract docs. |
| `quickstart.md` | Optional manual or automated validation scenario. | Replace automated tests when tests are required. |

## Source-Of-Truth Relationship

Feature artifacts coordinate work. They do not replace durable project sources such as:

- domain model and ubiquitous language docs;
- decision records or ADRs;
- operation maps or capability catalogs;
- command/query/workflow/event/error specs;
- test matrices and automated test bindings;
- public docs/help anchors;
- implementation plans when the project already uses them.

If a project already has local spec files for a behavior, the feature artifact should link to and update those files rather than restating them fully.

## Creation Rules

Create a feature artifact directory for:

- new formal behavior;
- behavior that needs Discover or Spec Round before Code Round;
- behavior with cross-entrypoint, event, public-contract, roadmap, or version impact;
- behavior where plan/tasks would materially reduce ambiguity.

Do not create one for:

- tiny typo/docs-only changes;
- mechanical dependency or formatting changes;
- a narrow Sync Round where existing docs already identify the exact fix;
- historical backfill unless requested.

## `spec.md` Minimum Shape

```markdown
# <Behavior Name>

## Status
- Round:
- Artifact state:

## Business Outcome

## Ubiquitous Language
| Term | Meaning | Context | Compatibility aliases |
| --- | --- | --- | --- |

## Scenarios And Acceptance Criteria
| ID | Scenario | Given | When | Then |
| --- | --- | --- | --- | --- |

## Domain Ownership
- Bounded context:
- Aggregate/resource owner:
- Upstream/downstream contexts:

## Public Surfaces
- API:
- CLI:
- Web/UI:
- Config:
- Events:
- Public docs/help:

## Non-Goals

## Open Questions
```

`spec.md` should keep implementation terms out unless the term is itself part of the domain or public contract.

## `plan.md` Minimum Shape

```markdown
# Plan: <Behavior Name>

## Governing Sources
- Domain model:
- Decisions/ADRs:
- Local specs:
- Test matrix:

## Architecture Approach
- Domain/application placement:
- Repository/specification/visitor impact:
- Event/CQRS/read-model impact:
- Entrypoint impact:
- Persistence/migration impact:

## Roadmap And Compatibility
- Roadmap target:
- Version target:
- Compatibility impact:

## Testing Strategy
- Matrix ids:
- Test-first rows:
- Acceptance/e2e:
- Contract/integration/unit:

## Risks And Migration Gaps
```

`plan.md` should fail closed: if a decision, source-of-truth doc, or public contract is missing, record the blocker instead of designing around it.

## `tasks.md` Minimum Shape

```markdown
# Tasks: <Behavior Name>

## Test-First
- [ ] <matrix-id>: add failing/updated test at <path>

## Source Of Truth
- [ ] update <doc path>

## Implementation
- [ ] implement <small coherent slice>

## Entrypoints And Docs
- [ ] update <API/CLI/Web/docs surface>

## Verification
- [ ] run <command>

## Post-Implementation Sync
- [ ] reconcile spec, plan, tasks, tests, docs, and code
```

Tasks should name paths when known, include matrix ids when tests are in scope, and preserve dependency order. Mark parallel tasks only when their write sets are independent.

## Round Integration

During Discover Round:

- create the directory only after the behavior identity is selected, unless the user asks for exploration branches;
- use `event-storming-discovery.md` as input when the domain is unclear.

During Spec Round:

- create or update `spec.md` first;
- update durable project specs in the same round, or record exactly which durable specs remain to update;
- do not write production code.

During Testing/Test-First Round:

- update `tasks.md` with matrix ids and expected failing/passing test bindings.

During Code Round:

- require current `spec.md`, `plan.md`, and `tasks.md` when the convention applies;
- keep Code Round within the tasks and test ids;
- update `tasks.md` status as tasks complete.

During Post-Implementation Sync:

- verify `spec.md`, `plan.md`, `tasks.md`, durable specs, tests, docs, and code agree;
- mark remaining gaps as `deferred-gap` or `not-applicable` with reasons.
