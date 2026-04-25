# Domain Modeling

Use this reference when deciding whether DDD is warranted, naming bounded contexts, placing concepts, or interpreting a project's domain model document.

## Purpose

Domain modeling turns business language and rules into a model that code can enforce. Use it when the domain has meaningful invariants, lifecycle transitions, ownership rules, or terms that would become ambiguous if represented as generic strings and data bags.

Avoid rich DDD for simple CRUD/reporting surfaces that mainly move data around and do not protect business rules.

## Modeling Flow

1. Identify the bounded context.
2. Collect ubiquitous language from source-of-truth docs and domain experts.
3. Map upstream/downstream relationships when other bounded contexts, teams, external systems, legacy models, or published contracts are involved.
4. Decide whether the behavior needs rich domain modeling.
5. Choose aggregate roots by consistency boundary, not database table or UI page.
6. Model domain-significant primitives as value objects.
7. Put invariants and transitions in aggregate methods or value-object state machines.
8. Put cross-aggregate orchestration in application services.
9. Keep adapters responsible only for translation and side effects.

## Ubiquitous Language

Ubiquitous language is a core modeling constraint, not documentation polish. The same concept should have the same name across:

- domain model docs;
- ADRs and behavior specs;
- aggregate, value object, repository, command, query, event, and error names;
- test names and fixtures;
- API, CLI, Web, worker, and tool entrypoints;
- public docs and help text when user-visible.

Before changing code, build a small language map for the behavior:

```markdown
## Ubiquitous Language Map

- Bounded context:
- Canonical terms:
- Forbidden or legacy terms:
- Compatibility aliases:
- Command/query names:
- Event names:
- Error names/codes:
- Test matrix or acceptance names:
- Entrypoint labels:
```

Use compatibility aliases only when the project explicitly needs migration support. Keep the canonical term dominant in new code and specs.

If a code type, test, or endpoint uses a different word than the domain model, decide whether to rename it, document it as a compatibility alias, or escalate the naming conflict to a decision record.

## Boundaries

Separate these ideas:

- Bounded context: business language and rules.
- Execution context: request-scoped runtime concerns such as actor, transaction, tracing, request id, locale, or tenant.
- Domain context: narrowed policy/config values that domain behavior genuinely needs.

Do not pass a broad execution context into aggregates just because it is convenient. Pass explicit domain values or a narrowed domain context.

## Project Domain Model Documents

A project domain model document should answer:

- What are the bounded contexts?
- Which upstream/downstream context relationships, published languages, or anticorruption layers matter?
- Which aggregate roots exist?
- Which entities and value objects belong inside each aggregate?
- Which behaviors belong to which aggregate root?
- Which concepts are entry workflows rather than aggregates?
- Which terms are compatibility aliases versus canonical domain language?
- Which rules are still migration gaps?

This skill should not copy those answers. It should read them from the project.

## Common Smells

- A UI screen becomes an aggregate root by default.
- A database table becomes an entity by default.
- A command is named `update` even though the domain intent is specific.
- Code uses one term, specs use another, and tests use a third for the same concept.
- Public or transport names quietly replace the bounded context language inside the domain model.
- A vendor, legacy, or upstream model leaks into aggregate state instead of being translated at an anticorruption boundary.
- Business state transitions are implemented as string switches in application services.
- A repository method answers whether a change may happen.
- A value object is skipped because the primitive type is easy to serialize.
