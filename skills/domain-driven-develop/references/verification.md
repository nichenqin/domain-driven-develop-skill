# Verification

Use this reference before finishing Code Round, Sync Round, or a domain-modeling review.

## Completeness

Check that:

- the behavior has a named owner in the project domain model or a documented decision;
- relevant command/query/API/workflow/error specs exist or are documented as not applicable;
- entrypoints are implemented or explicitly deferred;
- tests cover the changed behavior at the right boundary;
- public docs or help surfaces are handled when the behavior is user-visible;
- migration gaps are explicit.

## Correctness

Check that:

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
- command/query schemas are reused by transports instead of redefined;
- source-of-truth docs and implementation do not contradict each other;
- new specs update every visitor and test translation path;
- no service locator or container resolution appears outside composition code unless documented.

## Final Output

Report:

- what changed;
- which source-of-truth docs governed the work;
- which domain references were applied;
- verification commands and results;
- remaining gaps or open decisions.
