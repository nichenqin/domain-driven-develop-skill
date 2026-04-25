# Next Behavior Selection

Use this reference when the current behavior is implemented or mostly implemented and the user asks what to do next.

## Preconditions

Before recommending the next behavior:

- run or review Post-Implementation Sync for the current behavior;
- list remaining `CRITICAL` gaps, if any;
- verify whether the current behavior can be considered aligned;
- inspect the project roadmap, version/release policy, operation map, domain model, open decisions, specs, and implementation plans.

## Ranking

Rank candidates by:

1. user or product loop value;
2. current roadmap target or release-gate value;
3. compatibility/version risk;
4. blocked source-of-truth gaps that prevent implementation;
5. domain model risk;
6. cross-entrypoint impact;
7. testability and observability;
8. dependency order.

Prefer the smallest next behavior that completes a coherent user or domain workflow.

## Output

Recommend exactly one next behavior unless the user asks for a backlog.

Include:

- behavior name;
- bounded context and domain owner;
- reason it is next;
- roadmap target and compatibility impact;
- recommended round type;
- governing docs to read first;
- likely tests or acceptance criteria;
- lower-ranked backups.

Do not start the next behavior unless explicitly asked.
