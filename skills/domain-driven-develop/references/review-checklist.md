# Review Checklist

Use this checklist for domain-driven implementation reviews and before finalizing substantial Code or Sync work.

## Language

- Is the bounded context explicit?
- Do docs, code, tests, events, errors, entrypoints, and public help use the same ubiquitous language?
- Are aliases documented at boundaries instead of leaking into domain code?
- Are generic names such as `update`, `data`, `config`, `manager`, or `service` hiding domain intent?

## Domain Model

- Is DDD justified here, or would a simpler model be clearer?
- Are aggregate boundaries driven by invariants and consistency, not tables or screens?
- Are entities identity-bearing and value objects immutable?
- Are domain-significant primitives wrapped in value objects?
- Are status transitions represented by behavior or state-machine value objects?
- Are invalid states hard to represent?

## Placement

- Are aggregate invariants inside aggregate behavior?
- Is cross-aggregate orchestration in application services?
- Are pure cross-concept domain rules in domain services when they do not fit one aggregate?
- Are adapters limited to translation and side effects?
- Are tracing, transactions, request metadata, and framework objects kept out of aggregates and value objects?

## Repositories And Specs

- Are repositories collection-like ports over aggregate roots or application-owned state?
- Are repositories free of business policy?
- Are selection and mutation specs named in domain language?
- Are composite specs used instead of business-specific `findBy...` proliferation?
- Does every new spec update adapter and test visitors?
- Are specs pure, without database, HTTP, filesystem, cache, or provider calls?

## Application Layer

- Do handlers and use cases use constructor injection or explicit parameters?
- Are containers and service locators kept in composition roots?
- Do entrypoints dispatch shared command/query/application semantics instead of duplicating behavior?
- Are domain events published after the domain decision and persistence boundary required by the project?

## Errors And Tests

- Are expected failures explicit and structured?
- Do error codes use canonical domain terms?
- Do tests name the behavior in the same language as specs and code?
- Do tests cover the strongest observable boundary appropriate for the behavior?
- Are migration gaps explicit instead of hidden in weakened specs?
