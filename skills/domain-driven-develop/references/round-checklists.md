# Round Checklists

Use this reference after a behavior dossier exists and before editing files in a concrete round.

## Todo Gate

Before any non-trivial edit, create a round-specific todo with observable exit criteria.

Rules:

- do not edit files until the current round has a todo;
- when chaining authorized rounds, create a top-level chain todo first, then refresh the detailed todo before each round;
- phrase every item as an observable outcome;
- mark items complete as they finish;
- add newly discovered required surfaces immediately;
- do not start the next round while mandatory items remain unchecked unless they are documented as migration gaps, `not-applicable`, or assigned to a later authorized round;
- include stable test ids whenever tests or e2e/acceptance coverage are in scope.

## Minimum Todo Outcomes

| Round | Required outcomes |
| --- | --- |
| Discover Round | Source-of-truth map read, search terms checked across operations/specs/tests/contracts, candidate table prepared, no edits made before user chooses a behavior. |
| Spec Round | Governing docs read, behavior identity positioned, ADR need/no-need classified, affected command/query/workflow/event/error/testing/docs identified, implementation plan need decided, migration gaps and open questions updated. |
| Docs Round | Public-docs governance read when present, target page/anchor or not-user-facing reason decided, help surfaces checked, locale/search/agent-readable docs impact recorded when applicable. |
| Testing/Test-First Round | Stable matrix ids, automation level for each row, user-observable acceptance/e2e row or exception, lower-level rows, test filenames/names or metadata, expected failing/passing state. |
| Code Round | Domain/application/persistence/read-model/event/error changes, entrypoint changes, public docs requirement, capability catalog sync when present, read/query observability path, verification commands. |
| Sync Round | Specs, decisions, docs, tests, implementation, entrypoints, migration gaps, and test bindings compared; target artifact to change selected. |
| Post-Implementation Sync | Spec alignment, workflow alignment, error alignment, test matrix alignment, public docs alignment, bus/schema/contract alignment, migration gaps, open questions/decision need, ready/not-ready result. |

## Coverage Checklist

Classify each relevant surface as `done`, `not-applicable`, `deferred-gap`, or `blocked`:

- command;
- query/read model;
- event;
- workflow;
- error contract;
- test matrix;
- automated tests;
- API/RPC entrypoint;
- CLI entrypoint;
- Web/UI entrypoint;
- owner-scoped UI affordance when the behavior belongs to an aggregate/resource;
- repository/config fields;
- worker/message consumer;
- future tool or MCP surface;
- public docs/help anchor;
- capability or operation catalog when the project has one;
- implementation plan.

Do not call a user-visible write-side command complete when the only confirmation path is manual persistence inspection. A closed loop needs an entrypoint and an observable read/query/status surface, unless the governing docs explicitly scope it out.

## Synchronization Surface

When behavior changes, check and synchronize:

- behavior map or capability catalog;
- domain model and ubiquitous language;
- decision records when boundaries change;
- command/query specs and implementation;
- workflow/process specs and implementation;
- event specs and publisher/consumer behavior;
- event publication, outbox, handler, projection, retry, idempotency, replay, and backfill policy when events change;
- error specs and result/exception shape;
- test matrix ids, automation levels, and automated tests with matching ids;
- read models/projections when observable state changes;
- API/RPC route and input schema;
- CLI command or interactive flow;
- Web/UI affordance;
- repository/config fields and validation;
- public documentation page, stable help anchor, locale state, search aliases, and agent-readable docs impact;
- implementation plan;
- migration gaps and open questions.
