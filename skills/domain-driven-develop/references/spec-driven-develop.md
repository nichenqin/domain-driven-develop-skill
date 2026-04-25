# Spec-Driven Develop

Spec-Driven Develop is the workflow-control part of Domain Driven Develop. It treats specifications and model documents as primary artifacts, and treats code as an implementation that must stay synchronized with them.

## Rounds

Choose exactly one round unless the user explicitly asks for an end-to-end chain. Exception: Code Round should finish with Post-Implementation Sync for the same behavior.

Before any non-trivial edit, read `round-artifacts.md`, create a behavior dossier, classify artifact state, then read `round-checklists.md` and create a concrete todo with observable exit criteria. Do not edit files while the current round has unknown required artifacts or unchecked mandatory todo items.

### Discover Round

Use when the behavior is not selected.

Do this:

- Read the project source-of-truth map.
- Search operation catalogs, command/query specs, workflow specs, API contracts, and tests for the user's terms.
- Read `reporting.md` and list candidate behaviors with their governing documents, current behavior/capability state, matching operation or command/query name, rationale, and recommended next round.
- Stop before editing unless the user chooses a behavior.

### Spec Round

Use when behavior semantics, ownership, lifecycle, errors, or entrypoints are unclear.

Do this:

- Read `decisions-and-adrs.md` and update ADRs or decisions first when boundaries, ownership, lifecycle, canonical language, durable state, or public contracts change.
- Update operation maps or capability catalogs when the behavior is new.
- Update command/query, workflow, event, error, API, and testing specs together when behavior changes.
- Read `domain-events.md` before adding or changing event semantics, consumers, projections, integration contracts, outbox/publication, replay, or backfill behavior.
- Align ubiquitous language across specs, code names, tests, events, errors, and entrypoints. If a term changes, update every normative surface in the same round or record a migration gap.
- Record temporary implementation gaps only as migration notes, never as weakened normative behavior.

Do not change production code in Spec Round.

### Docs Round

Use when behavior changes user-visible input, output, status, recovery, workflow sequencing, entrypoint affordances, or help text.

Do this:

- Read `docs-round.md`.
- Decide whether the behavior needs a task page, concept page, reference page, troubleshooting page, stable anchor on an existing page, not-user-facing reason, or explicit migration gap.
- Keep public docs task-oriented and aligned with the ubiquitous language.
- Record help surfaces for API, CLI, Web, config, messages, and future tools when relevant.
- Record stable anchors, locale state, search aliases, and agent-readable docs impact when the project has those surfaces.

Do not change business code in Docs Round unless the user explicitly authorizes a chained round.

### Testing Round / Test-First Round

Use when specs are clear enough to assign stable test ids, select automation levels, or write executable expectations. When this happens before production code, treat it as Test-First Round.

Do this:

- Read `testing-traceability.md`.
- Add or update stable test matrix rows first when the project uses them.
- Assign stable ids and automation levels for every changed scenario.
- Write or plan tests whose names or metadata reference the spec or matrix ids.
- Keep a one-to-one trace from each changed matrix row to at least one automated test binding, or record an explicit exception.
- Include at least one user-observable or contract-level test for new commands, queries, or API operations unless the testing source of truth documents why not.

Production code changes should be limited to test harness wiring.

### Code Round

Use only when governance is sufficient.

Enter Code Round only if:

- the owning bounded context and aggregate/resource owner are known;
- relevant decisions and specs exist, or the dossier records why no new decision is needed and the change is explicitly small and local;
- error and async lifecycle contracts are clear when applicable;
- public/API/CLI/tool entrypoint expectations are decided;
- stable test ids, automation levels, and test bindings exist or are explicitly planned for the authorized Code Round;
- no open question would change command boundaries, ownership, lifecycle, persistence shape, or observable semantics.

Do this:

- Implement the smallest coherent behavior slice.
- Keep entrypoints thin and converge on shared command/query/application semantics.
- Keep CQRS boundaries explicit when present: commands change state, queries return read models, and read-side projections do not own write-side policy.
- Include the read/query/status path and relevant user-facing entrypoint needed for a minimal observable closed loop, unless explicitly scoped out.
- Use the bounded context's ubiquitous language in type names, method names, event names, error names, test names, and entrypoint names. If a different transport name is required, translate at the boundary and document the alias.
- Keep domain decisions in aggregates, value objects, domain services, or application services, not in adapters or repositories.
- Update tests according to the governing specs.
- Implement only behavior covered by the changed specs and test ids. If implementation reveals a new scenario, add or update the matrix row instead of silently widening scope.
- Update docs only when behavior meaning, gaps, or coverage changed.
- Run Post-Implementation Sync before final output.

### Sync Round

Use when specs, tests, docs, and code drift.

Do this:

- Compare source-of-truth docs against code and tests.
- Decide whether docs, tests, code, or decisions should change.
- Keep migration gaps explicit.
- Do not hide drift by weakening normative specs to match temporary code.

### Post-Implementation Sync

Use after Code Round or when asked whether a behavior is complete.

Check:

- source-of-truth docs align with behavior;
- ubiquitous language aligns across docs, code, tests, errors, events, and entrypoints;
- domain model ownership is respected;
- command/query/workflow/error/API contracts align with implementation;
- event producer, publication boundary, handler, projection, retry/idempotency, and replay/backfill semantics align with specs when events change;
- command/query separation and read/write consistency expectations are explicit when CQRS applies;
- tests cover changed behavior at the right boundary;
- changed test matrix ids are bound to passing tests or documented exceptions;
- entrypoints expose the same semantics;
- repositories and adapters do not contain business policy;
- public docs or help anchors are handled when user-visible;
- write-side changes have read/query/status observability unless explicitly scoped out;
- expected failing tests from Test-First Round are resolved or still listed as blockers;
- remaining gaps are explicit and classified.

Read `reporting.md` for formal aligned/not-aligned and ready/not-ready output.

## Artifact State

Track each relevant artifact as `done`, `ready`, `blocked`, `not-applicable`, or `deferred-gap`:

1. Behavior identity
2. Domain ownership
3. Decisions or ADRs, including no-ADR-needed rationale when applicable
4. Command/query/API contracts
5. Workflow/event/error specs
6. Public documentation or help outcome
7. Test matrix rows with stable ids and automation levels
8. Automated tests bound to matrix ids
9. Code/read model/entrypoint implementation
10. Post-Implementation Sync result

## Execution Modes

Use incremental readiness when requirements are still being discovered, a decision needs review, or the next artifact can be completed independently. Create or reconcile exactly one ready artifact, refresh the dossier, and stop.

Use complete readiness when scope is clear and the user asks to prepare or finish readiness. Complete every ready governance artifact needed to reach the next permission boundary, but do not cross into Code Round unless implementation is authorized.

## ADR Or Decision Escalation

Read `decisions-and-adrs.md` for the full gate.

Create or update a decision record before local specs or code when a change touches:

- command/query boundary;
- aggregate ownership or lifecycle ownership;
- lifecycle stages, readiness gates, retry semantics, rollback semantics, or async acceptance;
- durable state shape;
- cross-boundary naming or canonical language;
- route/domain/security/public-contract semantics;
- long-running workflow behavior.

Do not resolve these issues only by changing implementation or by adding a narrow local spec that hides the cross-cutting decision.

## Entrypoint Surface Gate

When a behavior becomes user-visible or changes user-controlled input, classify each relevant surface:

- API;
- CLI;
- Web/UI;
- message consumer or worker;
- repository/config file;
- public docs/help;
- future tool or MCP entrypoint.

Use one state per surface:

- implemented input or selection affordance;
- read-only/status-only affordance;
- intentionally not applicable, with domain reason;
- deferred migration gap, with missing schema/command/UI/help work named.

Do not call a behavior fully exposed when only one first-class surface supports the new semantics.

Do not call a write-side behavior complete when the only confirmation path is manual persistence inspection. A complete behavior needs an observable query/status/read surface, unless the source of truth explicitly scopes that out.

## Output Contract

For formal work, report:

- round type;
- target behavior;
- behavior/capability state;
- governing docs;
- domain owner;
- artifact state when non-trivial;
- coverage across relevant surfaces;
- changed specs/code/tests/entrypoints;
- verification commands;
- remaining gaps;
- test matrix ids and automated test bindings;
- next recommended round.
