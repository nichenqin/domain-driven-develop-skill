# Testing Traceability

Use this reference when a behavior needs new or changed acceptance criteria, test matrix rows, automated tests, or implementation coverage.

## Purpose

Testing is a first-class round artifact. Test matrices describe what must be proven, automated tests prove it, and Code Round must keep implementation aligned with those ids.

The goal is traceability, not bureaucracy: every changed behavior scenario should have a stable id, an intended automation level, and either a concrete automated test binding or an explicit exception.

## Stable Test IDs

Use the project's existing id convention. If none exists, choose short stable ids that include the behavior or surface, for example:

```text
DEPLOY-ACCEPT-001
USER-EMAIL-VALIDATION-002
RESOURCE-STATUS-READ-003
```

Rules:

- assign ids before writing or changing production code;
- do not renumber ids casually;
- reuse an id only for the same behavior intent;
- create a new id when the behavior intent changes materially;
- record renamed ids as migration notes so old test names and docs can be reconciled.

## Matrix Row Shape

Use the project's template when one exists. Otherwise capture:

| ID | Scenario | Source spec | Surface | Automation level | Test binding | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | command/workflow/error/API/doc path | domain/app/persistence/API/CLI/Web/e2e | unit/integration/acceptance/e2e/manual | file + test name | planned/failing/passing/deferred |  |

Every changed row needs a stable id and automation level before Code Round.

## Testing Round

Use Testing Round, or Test-First Round when it happens before production code, when:

- changed behavior lacks matrix rows or stable ids;
- specs changed and executable expectations need to be created or renamed;
- automation level is unclear;
- implementation exists but tests do not trace back to matrix ids;
- a behavior is being verified for readiness before Code Round.

Do this:

- read the domain model, relevant decisions, local specs, and public contract that govern the behavior;
- add or update one matrix row per changed scenario or observable contract;
- assign stable ids and automation levels;
- choose automated test files and test names;
- include the id in each automated test name or in a nearby test metadata/comment convention already used by the project;
- record expected status before Code Round, usually failing for new behavior and passing for existing behavior being refactored;
- record explicit exceptions when a row is manual, not applicable, or deferred.
- for event behavior, include rows for emitted events, consumed events, payload fields, projection effects, idempotency, retry, and replay/backfill when applicable.

Do not change production behavior in Testing Round unless the user explicitly authorizes a chained Code Round.

## One-To-One Binding

For every changed matrix row:

- there must be at least one automated test binding, or an explicit exception;
- the test name or metadata must include the matrix id;
- the test must prove the row's scenario, surface, and expected outcome;
- if one test covers multiple ids, the test name or metadata must list each id and the test must genuinely prove each row;
- if one id requires multiple test levels, each binding should name the same id and the level it proves.

Avoid vague umbrella tests that hide several scenarios behind one id. Split ids when failure diagnosis would otherwise be unclear.

## Code Round Gate

Before Code Round, confirm:

- changed behavior has stable ids;
- required rows have automation levels;
- required tests exist or are planned as part of the authorized Code Round;
- test names or metadata will bind to ids;
- entrypoint coverage exists for user-facing commands, queries, or workflows, unless the matrix records an exception.

During Code Round:

- do not implement behavior outside the governed specs and matrix ids;
- keep tests aligned with the same ubiquitous language as specs and code;
- update matrix status from planned/failing to passing only after the named tests pass;
- add a new matrix row instead of silently expanding implementation scope.

## Post-Implementation Sync

After Code Round, verify:

- every changed id has a passing automated binding or documented exception;
- each automated test still proves the scenario named by the matrix row;
- test names, code names, and specs use the same ubiquitous language;
- deleted or renamed behavior has matching matrix migration notes;
- remaining gaps are classified as not-applicable or deferred-gap with a reason.

## Avoid

- tests with no source spec or matrix id for changed behavior;
- matrix ids that are renamed to make implementation look complete;
- one broad e2e test used as a substitute for clear scenario rows;
- low-level unit tests as the only proof for a user-visible command or workflow;
- production code changes that introduce new behavior with no matching matrix row.
