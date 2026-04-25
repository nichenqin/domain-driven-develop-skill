# Verification

Use this reference before finishing Code Round, Sync Round, or a domain-modeling review.

## Completeness

Check that:

- the behavior has a named owner in the project domain model or a documented decision;
- ADR/decision need was classified, and Code Round has no unresolved required decision records;
- ubiquitous language has a canonical term map or the equivalent is clear from source-of-truth docs;
- relevant command/query/API/workflow/error specs exist or are documented as not applicable;
- entrypoints are implemented or explicitly deferred;
- tests cover the changed behavior at the right boundary;
- public docs or help surfaces are handled when the behavior is user-visible;
- migration gaps are explicit.

## Correctness

Check that:

- canonical domain terms are used in aggregate, value object, command, query, event, error, and test names;
- aggregate boundaries match project source-of-truth docs;
- value objects protect domain-significant values;
- aggregate methods enforce transitions and invariants;
- application services orchestrate without hiding domain policy;
- repositories load/persist and translate specs without business decisions;
- adapters do not leak infrastructure types into domain/core;
- expected domain failures return explicit errors or results.

## Coherence

Check that:

- names align across specs, code, tests, docs, and entrypoints;
- compatibility aliases are documented at boundaries and do not replace the canonical domain term inside the model;
- command/query schemas are reused by transports instead of redefined;
- source-of-truth docs and implementation do not contradict each other;
- local specs do not override accepted decisions without a new decision record;
- new specs update every visitor and test translation path;
- no service locator or container resolution appears outside composition code unless documented.

## Final Output

Report:

- what changed;
- which source-of-truth docs governed the work;
- which domain references were applied;
- verification commands and results;
- remaining gaps or open decisions.

## Severity

Use these severities:

| Severity | Meaning |
| --- | --- |
| `CRITICAL` | Required artifact, required entrypoint, passing required test, canonical term alignment, or normative behavior is missing. The behavior is not aligned. |
| `WARNING` | Behavior can be understood but has weak coverage, non-blocking drift, incomplete docs, or a documented but unresolved alias/migration issue. |
| `SUGGESTION` | Cleanup, naming, or maintainability improvement that does not change readiness. |

Return `aligned` only when no `CRITICAL` findings remain, required tests pass or have documented exceptions, user-visible behavior has a docs/help outcome, and source-of-truth docs, code, tests, and entrypoints use the same domain language or documented aliases.

## Report Shape

```markdown
## Verification Report

- Behavior:
- Round:
- Result: aligned | not aligned
- Ready to move on: yes | no

### Completeness
- Status:
- CRITICAL:
- WARNING:
- SUGGESTION:

### Correctness
- Status:
- CRITICAL:
- WARNING:
- SUGGESTION:

### Coherence
- Status:
- CRITICAL:
- WARNING:
- SUGGESTION:

### Required Follow-Up
- Docs:
- Tests:
- Code:
- Decisions:
- Migration gaps:
```
