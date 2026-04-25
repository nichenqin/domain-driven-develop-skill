# Verification

Use this reference before finishing Code Round, Sync Round, or a domain-modeling review.

## Completeness

Check that:

- the behavior has a named owner in the project domain model or a documented decision;
- `spec.md`, `plan.md`, and `tasks.md` are current when the project convention applies to the behavior;
- roadmap target and version/compatibility impact are classified when the behavior is user-visible, release-sensitive, or public-contract changing;
- ADR/decision need was classified, and Code Round has no unresolved required decision records;
- ubiquitous language has a canonical term map or the equivalent is clear from source-of-truth docs;
- cross-context relationships, published languages, shared kernels, or anticorruption boundaries are explicit when external systems or other bounded contexts are involved;
- relevant command/query/API/workflow/error specs exist or are documented as not applicable;
- command/query split, read model ownership, and consistency expectations are documented when CQRS applies;
- event producer, payload, publication boundary, consumers, projection effects, and retry/idempotency/replay expectations are documented when events change;
- changed behavior has stable test ids, automation levels, and automated test bindings or documented exceptions;
- entrypoints are implemented or explicitly deferred;
- tests cover the changed behavior at the right boundary;
- write-side commands have read/query/status observability unless explicitly scoped out;
- public docs or help surfaces are handled when the behavior is user-visible;
- capability or operation catalog entries are synchronized when the project has them;
- roadmap, changelog, release-note, deprecation, or migration artifacts are synchronized when the project uses them and the change is release-sensitive;
- migration gaps are explicit.

## Correctness

Check that:

- canonical domain terms are used in aggregate, value object, command, query, event, error, and test names;
- aggregate boundaries match project source-of-truth docs;
- external, vendor, legacy, or upstream models are translated at boundaries and do not leak into aggregate state;
- value objects protect domain-significant values;
- aggregate methods enforce transitions and invariants;
- application services orchestrate without hiding domain policy;
- command handlers coordinate write-side decisions without hiding invariants in buses, controllers, or repositories;
- query handlers return read-optimized models without mutating business state;
- event handlers do not own the original write-side decision or bypass aggregate invariants;
- repositories load/persist and translate specs without business decisions;
- adapters do not leak infrastructure types into domain/core;
- expected domain failures return explicit errors or results.
- tests prove the matrix row scenario they reference, not just nearby implementation details.

## Coherence

Check that:

- names align across specs, code, tests, docs, and entrypoints;
- compatibility aliases are documented at boundaries and do not replace the canonical domain term inside the model;
- published-language terms are mapped to local ubiquitous language rather than silently replacing it;
- command/query schemas are reused by transports instead of redefined;
- entrypoints dispatch through shared application semantics rather than duplicating business behavior;
- read-side DTOs or projections do not leak back into aggregate state as the source of truth;
- domain events and integration events are distinguished, and external event contracts are versioned or documented when compatibility matters;
- source-of-truth docs and implementation do not contradict each other;
- feature artifacts do not contradict durable specs, decisions, tests, docs, or implementation;
- release claims do not contradict the roadmap, public docs, tests, or implementation state;
- local specs do not override accepted decisions without a new decision record;
- implementation plans still describe the implemented slice or are updated as migration gaps;
- new specs update every visitor and test translation path;
- changed matrix ids map to passing test names or metadata one-to-one, unless an explicit exception is recorded;
- no service locator or container resolution appears outside composition code unless documented.

## Final Output

Report:

- what changed;
- which source-of-truth docs governed the work;
- roadmap target and version/compatibility impact when relevant;
- which domain references were applied;
- verification commands and results;
- remaining gaps or open decisions.
- artifact state and coverage state for non-trivial work.

## Severity

Use these severities:

| Severity | Meaning |
| --- | --- |
| `CRITICAL` | Required artifact, required entrypoint, passing required test, canonical term alignment, or normative behavior is missing. The behavior is not aligned. |
| `WARNING` | Behavior can be understood but has weak coverage, non-blocking drift, incomplete docs, or a documented but unresolved alias/migration issue. |
| `SUGGESTION` | Cleanup, naming, or maintainability improvement that does not change readiness. |

Return `aligned` only when no `CRITICAL` findings remain, required tests pass or have documented exceptions, user-visible behavior has a docs/help outcome, and source-of-truth docs, code, tests, and entrypoints use the same domain language or documented aliases.

If only some artifacts exist, verify the strongest available subset and state what was skipped. A skipped required artifact is a `CRITICAL` gap unless it is classified as `not-applicable` or `deferred-gap` with a reason.

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
