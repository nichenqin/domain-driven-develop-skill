# Project Source Of Truth

Use this reference before non-trivial work. It binds the generic Domain Driven Develop workflow to the concrete repository.

## Locate Project Documents

Search for the target repository's durable instructions and source-of-truth files:

- repository rules: `AGENTS.md`, `CONTRIBUTING.md`, `.cursorrules`, `.github/copilot-instructions.md`, or equivalent
- domain model: `docs/DOMAIN_MODEL.md`, `docs/domain-model.md`, `docs/model/**`, or equivalent
- decisions: `docs/decisions/**`, `adr/**`, `docs/adr/**`
- roadmap and release/version policy: `docs/PRODUCT_ROADMAP.md`, `ROADMAP.md`, `docs/roadmap/**`, `CHANGELOG.md`, `RELEASE.md`, `docs/release/**`, `docs/versioning/**`, or equivalent
- behavior specs: `docs/commands/**`, `docs/queries/**`, `docs/workflows/**`, `docs/events/**`, `docs/errors/**`
- API or transport contracts: OpenAPI, GraphQL, protobuf, oRPC, CLI specs, MCP/tool schemas
- testing contracts: `docs/testing/**`, acceptance criteria, contract tests, e2e plans
- operation catalog: any file that lists business operations, commands, queries, or user-visible capabilities

If the repository has an explicit project profile skill, load it after this file. A project profile should bind these generic categories to exact paths and should not duplicate the domain model itself.

## Interpret Authority

Use this order unless the repository documents a stricter one:

1. Repository rules and accepted architecture decisions
2. Domain model and ubiquitous-language documents
3. Behavior specs, workflow specs, error contracts, and API contracts
4. Roadmap, release/version policy, and compatibility policy for prioritization and release impact
5. Test matrices and executable tests
6. Implementation plans
7. Current code
8. Historical notes, migration notes, and AI scratch docs

Treat current code as evidence, not as automatic truth. If code conflicts with accepted decisions or specs, decide whether the task is a Sync Round or whether the decision/spec should change first.

## Bind Domain Facts

Before writing domain code, answer:

- What bounded context owns this behavior?
- Which aggregate root owns the state transition?
- Which value objects represent domain-significant primitives?
- Which command/query/workflow/event specs govern the behavior?
- Which entrypoints expose it: API, CLI, Web, worker, MCP/tool, message consumer?
- Which roadmap target or release/version policy applies, if this behavior is release-sensitive or user-visible?
- Which tests or matrix rows prove the behavior?
- Which accepted decision governs the boundary, lifecycle, ownership, or public contract, or why is no new decision needed?

If these answers are missing, do not invent them in code. Move to Spec Round or ask for a decision.

## Keep Profiles Thin

A project profile can say:

```md
Use `domain-driven-develop`.

For this repository:
- domain model: `docs/DOMAIN_MODEL.md`
- operation map: `docs/BUSINESS_OPERATION_MAP.md`
- roadmap/version policy: `docs/PRODUCT_ROADMAP.md`, `CHANGELOG.md`, or equivalent
- decisions: `docs/decisions/**`
- command specs: `docs/commands/**`
- workflows: `docs/workflows/**`
- tests: `docs/testing/**`

Project docs override generic examples.
```

Do not copy the contents of `docs/DOMAIN_MODEL.md` into the profile. Copying creates drift.
