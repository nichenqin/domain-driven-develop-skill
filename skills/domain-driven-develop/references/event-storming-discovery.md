# Event Storming Discovery

Use this reference during Discover Round or early Spec Round when the business flow, ubiquitous language, events, commands, policies, aggregate ownership, or context boundaries are unclear.

Event Storming here is a discovery technique. Candidate events from a workshop are not implementation events until promoted into source-of-truth event specs and tests.

## When To Use

Use it for:

- new domains or major workflows;
- unclear lifecycle transitions;
- unclear aggregate/resource ownership;
- behaviors with many actors, policies, external systems, or follow-up reactions;
- mismatched language across docs, code, tests, or entrypoints.

Skip or keep it lightweight for tiny changes where source-of-truth docs already answer the behavior.

## Inputs

Collect:

- business outcome;
- users, operators, systems, and external actors;
- existing operation map, domain model, ADRs, specs, tests, incidents, support notes, and roadmap items;
- constraints such as compliance, audit, reliability, latency, or compatibility.

## Discovery Board

Work from facts to decisions:

| Item | Question | Examples |
| --- | --- | --- |
| Domain event candidate | What happened in business language? | `DeploymentRequested`, `ResourceProvisioningFailed` |
| Command | What intent caused it? | `create deployment`, `verify route` |
| Actor | Who or what initiated the command? | user, CLI, scheduler, webhook |
| Policy/rule | What rule reacts or blocks? | quota, readiness, ownership, compatibility |
| Aggregate/resource | What owns the decision or state transition? | Deployment, Resource |
| Read model | What must be observed afterward? | status timeline, diagnostic summary |
| External system | What outside model participates? | provider API, VCS, payment system |
| Open question | What is ambiguous? | owner, lifecycle stage, public term |

Prefer past-tense event names and the bounded context's own language.

## Workshop Output Template

```markdown
# Event Storming: <Behavior>

## Business Outcome

## Actors
| Actor | Goal | Entry surface |
| --- | --- | --- |

## Timeline
| Order | Event candidate | Command or trigger | Actor | Policy/rule | Owner | Consumer/read model | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Policies And Invariants
| Policy | Applies before/after | Owner | Error/result |
| --- | --- | --- | --- |

## Aggregate And Context Candidates
| Candidate | Owns | Does not own | Reason |
| --- | --- | --- | --- |

## External Systems And Translation
| System/context | Relationship | Translation boundary | Public/published language |
| --- | --- | --- | --- |

## Ubiquitous Language Changes
| Term | Meaning | Context | Alias or conflict |
| --- | --- | --- | --- |

## Source-Of-Truth Follow-Up
- Domain model:
- Decision/ADR:
- Command/query specs:
- Event specs:
- Workflow specs:
- Test matrix:
- Public docs/help:

## Open Questions
```

## Promotion Rules

After discovery, promote only confirmed items:

- event candidates become event specs only when they are meaningful facts with producers, payload, consumers, and publication boundaries;
- commands become command specs only when the intent, actor, input, result, and failure modes are clear;
- aggregate candidates become domain model changes only when ownership and invariants are clear;
- policies become aggregate/domain-service/application rules depending on ownership;
- read models become query specs or projection plans when observable state is needed.

Record uncertain items as open questions, not as implementation facts.

## Integration With Feature Artifacts

When `spec.md`/`plan.md`/`tasks.md` artifacts are used:

- copy confirmed business outcome, actors, scenarios, language, domain ownership, and open questions into `spec.md`;
- put architecture placement, translation boundaries, and test strategy in `plan.md`;
- put source-of-truth updates and test-first work in `tasks.md`.

Do not leave the workshop output as the only source of truth for implementation.
