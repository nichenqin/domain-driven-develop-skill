# Spec-Driven Develop

Spec-Driven Develop is the workflow-control part of Domain Driven Develop. It treats specifications and model documents as primary artifacts, and treats code as an implementation that must stay synchronized with them.

## Rounds

Choose exactly one round unless the user explicitly asks for an end-to-end chain. Exception: Code Round should finish with Post-Implementation Sync for the same behavior.

### Discover Round

Use when the behavior is not selected.

Do this:

- Read the project source-of-truth map.
- Search operation catalogs, command/query specs, workflow specs, API contracts, and tests for the user's terms.
- List candidate behaviors with their governing documents.
- Stop before editing unless the user chooses a behavior.

### Spec Round

Use when behavior semantics, ownership, lifecycle, errors, or entrypoints are unclear.

Do this:

- Update ADRs or decisions first when boundaries change.
- Update operation maps or capability catalogs when the behavior is new.
- Update command/query, workflow, event, error, API, and testing specs together when behavior changes.
- Record temporary implementation gaps only as migration notes, never as weakened normative behavior.

Do not change production code in Spec Round.

### Test-First Round

Use when specs are clear enough to write executable expectations before implementation.

Do this:

- Add or update stable test matrix rows first when the project uses them.
- Write tests whose names reference the spec or matrix ids.
- Include at least one user-observable or contract-level test for new commands, queries, or API operations unless the spec documents why not.

Production code changes should be limited to test harness wiring.

### Code Round

Use only when governance is sufficient.

Enter Code Round only if:

- the owning bounded context and aggregate/resource owner are known;
- relevant decisions and specs exist, or the change is explicitly small and local;
- error and async lifecycle contracts are clear when applicable;
- public/API/CLI/tool entrypoint expectations are decided;
- test expectations exist or the project documents why they belong in Code Round;
- no open question would change command boundaries, ownership, lifecycle, persistence shape, or observable semantics.

Do this:

- Implement the smallest coherent behavior slice.
- Keep entrypoints thin and converge on shared command/query/application semantics.
- Keep domain decisions in aggregates, value objects, domain services, or application services, not in adapters or repositories.
- Update tests according to the governing specs.
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
- domain model ownership is respected;
- command/query/workflow/error/API contracts align with implementation;
- tests cover changed behavior at the right boundary;
- entrypoints expose the same semantics;
- repositories and adapters do not contain business policy;
- public docs or help anchors are handled when user-visible;
- remaining gaps are explicit and classified.

## Artifact State

Track each relevant artifact as `done`, `ready`, `blocked`, `not-applicable`, or `deferred-gap`:

1. Behavior identity
2. Domain ownership
3. Decisions or ADRs
4. Command/query/API contracts
5. Workflow/event/error specs
6. Public documentation or help outcome
7. Test matrix or acceptance criteria
8. Automated tests
9. Code/read model/entrypoint implementation
10. Post-Implementation Sync result

## Output Contract

For formal work, report:

- round type;
- target behavior;
- governing docs;
- domain owner;
- changed specs/code/tests/entrypoints;
- verification commands;
- remaining gaps;
- next recommended round.
