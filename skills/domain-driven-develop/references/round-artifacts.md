# Round Artifacts

Use this reference before any non-trivial behavior round.

## Artifact State

Classify each artifact:

| State | Meaning |
| --- | --- |
| `done` | Required artifact exists and answers the current behavior question. |
| `ready` | Dependencies are done and the artifact can be created or reconciled now. |
| `blocked` | Missing dependency, unresolved decision, absent behavior identity, or permission boundary prevents work. |
| `not-applicable` | Surface does not apply for a named domain reason. |
| `deferred-gap` | Surface is intentionally deferred and named in migration notes or implementation gaps. |

Do not mark a file `done` only because it exists. Its contents must answer the behavior question using the bounded context language.

## Generic Artifact Graph

1. Behavior identity and domain owner
2. Feature artifact directory with `spec.md`, `plan.md`, and `tasks.md` when the convention applies
3. Ubiquitous language map
4. Roadmap target and version/compatibility impact
5. Decision or ADR need/no-need, with governing decision paths or no-ADR-needed rationale
6. Local behavior specs: command/query, workflow, event, error, read model
7. Public docs or help outcome
8. Test matrix rows or acceptance criteria with stable ids and automation levels
9. Implementation plan or small-scope rationale
10. Automated tests bound to matrix ids
11. Code, read model, and entrypoints
12. Post-Implementation Sync report

Later artifacts can be `not-applicable`, but they must not be silently skipped.

## Behavior Dossier

Create or refresh this compact dossier before edits:

```markdown
## Behavior Dossier

- Behavior:
- Feature artifact path:
- spec.md state:
- plan.md state:
- tasks.md state:
- Bounded context:
- Domain owner:
- Canonical terms:
- Compatibility aliases:
- Upstream/downstream context:
- Context relationship:
- Published language or anticorruption boundary:
- Roadmap target:
- Version target:
- Compatibility impact: none | patch | minor | major | pre-1.0-policy | unknown
- Affected public surfaces:
- Current round:
- Execution mode: incremental readiness | complete readiness
- Code changes allowed:
- User-visible:
- Decision state: existing | update-required | new-required | no-ADR-needed
- Governed decisions:
- No-ADR-needed rationale:
- Domain model docs:
- Command/query specs:
- Event specs:
- Workflow specs:
- Error specs:
- Testing specs or matrix ids:
- Automation levels:
- Automated test bindings:
- Implementation plan:
- Public docs page or stable anchor:
- Changelog/release-note/migration requirement:
- Domain/application modules:
- Persistence/read model modules:
- Runtime/provider/integration modules:
- API entrypoints:
- CLI entrypoints:
- Web/UI entrypoints:
- Config fields:
- Future tool/MCP surfaces:
- Remaining migration gaps:
- Open questions:
```

For lightweight questions, keep the dossier internal. For non-trivial edits, share enough of it for the user to understand the round and blockers.

## Change Intent

Use change intent to keep brownfield edits focused. It is planning state, not a competing source of truth.

```markdown
## Change Intent

### ADDED
- Requirement:
- Term:
- Scenario:
- Matrix row:
- Entrypoint:
- Public docs anchor:

### MODIFIED
- Requirement:
- Term:
- Scenario:
- Matrix row:
- Entrypoint:
- Public docs anchor:

### REMOVED
- Requirement:
- Term:
- Scenario:
- Matrix row:
- Entrypoint:
- Public docs anchor:
- Reason:
- Migration:

### RENAMED
- From:
- To:
- Canonical term:
- Compatibility alias needed:
- Affected docs/code/tests/entrypoints:
```

Apply accepted changes directly to source-of-truth docs, code, and tests.

## Todo Gate

Before non-trivial edits, create a round-specific todo with observable exit criteria.

Todo rules:

- Do not edit files until the current round has a todo.
- Phrase items as outcomes, not vague activities.
- Mark items complete as they finish.
- Add newly discovered required surfaces immediately.
- Include spec ids, matrix ids, automation levels, and automated test bindings when tests are in scope.
- Do not start the next round while required items remain unchecked unless they are moved to documented migration gaps.
