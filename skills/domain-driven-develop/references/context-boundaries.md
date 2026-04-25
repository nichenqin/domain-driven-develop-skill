# Context Boundaries

Use this reference when bounded context, execution context, domain context, tracing, transactions, locale, tenant, or request metadata are being mixed.

## Bounded Context

A bounded context is a business-model boundary. It owns language, concepts, and rules.

Examples:

- billing;
- catalog;
- identity;
- deployment;
- workspace.

It is not a request metadata object.

## Execution Context

Execution context is a runtime envelope. It may carry:

- actor identity;
- request id;
- trace/span interface;
- transaction handle;
- locale or translation helper;
- tenant or environment id;
- request-scoped policy/config.

Execution context belongs in application, repository, unit-of-work, or adapter boundaries. It should not become aggregate state.

## Domain Context

Sometimes domain behavior needs runtime-derived policy. Pass only the narrowed values:

```ts
type DomainContext = {
  maxMembersPerTeam: number;
  namingPolicy: NamingPolicy;
};
```

Avoid:

```ts
order.approve(executionContext);
```

because the aggregate can accidentally depend on tracing, transaction, request id, or locale.

## Tracing, Transactions, And I18n

- Tracing belongs around handlers, ports, repositories, and adapters.
- Transactions belong in unit-of-work and repository boundaries.
- I18n belongs at user-facing boundaries or in a narrowed domain context when a domain rule genuinely needs localized text.
- Aggregates, value objects, and specifications should not import tracing SDKs, database transactions, framework request objects, or full translation services.

## Rule Of Thumb

- Bounded context answers: "what business model owns this meaning?"
- Execution context answers: "what runtime envelope runs this use case?"
- Domain context answers: "what narrowed policy/config does the domain actually need?"

Keep those answers separate in types and method signatures.
