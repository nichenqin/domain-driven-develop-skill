# Reporting

Use this reference for Discovery output, formal round summaries, verification reports, and ready/not-ready decisions.

## Discovery Output

When the behavior is not selected, report candidates before editing:

| Candidate | Behavior/capability state | Command/query/operation | Why it matches | Governing docs |
| --- | --- | --- | --- | --- |
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

Then include:

- closest candidate and reason;
- recommended round: Spec, Docs, Testing/Test-First, Code, Sync, or Next Behavior Selection;
- blockers for Code Round;
- a direct request for the user to choose one candidate before specs or code change.

## Formal Round Summary

For formal work, include:

- round type;
- execution mode: incremental readiness or complete readiness;
- target behavior;
- behavior/capability position or state;
- feature artifact path and `spec.md`/`plan.md`/`tasks.md` state when used;
- roadmap target and compatibility impact when relevant;
- governing decisions, source-of-truth docs, specs, and implementation plan read;
- domain owner and canonical terms;
- verification result: aligned, not aligned, or not checked;
- ready to move on: yes or no.

## Artifact State Report

For non-trivial behavior work, report relevant artifact states:

| Artifact | State | Notes |
| --- | --- | --- |
| Behavior identity and domain owner |  |  |
| Feature artifact directory and spec/plan/tasks |  |  |
| Roadmap target and version/compatibility impact |  |  |
| Decision or ADR need/no-need |  |  |
| Domain model and ubiquitous language |  |  |
| Local command/query/workflow/event/error specs |  |  |
| Public docs outcome and stable help anchor |  |  |
| Test matrix rows, automation levels, and ids |  |  |
| Implementation plan or small-scope rationale |  |  |
| Automated tests bound to ids |  |  |
| Code/read model/entrypoint implementation |  |  |
| Post-Implementation Sync verification report |  |  |

## Coverage Report

When behavior changes cross entrypoints or user-visible surfaces, report coverage:

| Surface | Status | Notes |
| --- | --- | --- |
| Command |  |  |
| Roadmap/release target |  |  |
| Version/compatibility policy |  |  |
| Query/read model |  |  |
| Event |  |  |
| Workflow |  |  |
| Error |  |  |
| Testing |  |  |
| API/RPC |  |  |
| CLI |  |  |
| Web/UI |  |  |
| Repository/config |  |  |
| Future tool/MCP |  |  |
| Public docs/help anchor |  |  |

## Alignment Report

Include alignment lines when closing Code, Sync, or Post-Implementation work:

- Spec alignment:
- Decision alignment:
- Roadmap/version alignment:
- Domain language alignment:
- Workflow alignment:
- Error alignment:
- Test matrix alignment:
- Entrypoint schema/bus/contract alignment:
- Public docs/help alignment:
- Remaining migration gaps:
- Open questions:

## Next Recommendation

When relevant, include:

- recommended next behavior;
- why this behavior is next;
- roadmap target and compatibility impact;
- next round type;
- blockers;
- backup candidates.
