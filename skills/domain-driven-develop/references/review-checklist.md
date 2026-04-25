# Review Checklist

Use this checklist for domain-driven implementation reviews and before finalizing substantial Code or Sync work.

## Language

- Is the bounded context explicit?
- Do docs, code, tests, events, errors, entrypoints, and public help use the same ubiquitous language?
- Are aliases documented at boundaries instead of leaking into domain code?
- Are generic names such as `update`, `data`, `config`, `manager`, or `service` hiding domain intent?

## Domain Model

- Is any boundary, lifecycle, ownership, public-contract, or canonical-language choice backed by an accepted decision or a clear no-ADR-needed rationale?
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
- If CQRS applies, are commands state-changing and queries mutation-free?
- Are read models/projections shaped for consumers without forcing aggregate purity onto reads?
- Is read/write consistency explicit?
- Are containers and service locators kept in composition roots?
- Do entrypoints dispatch shared command/query/application semantics instead of duplicating behavior?
- Are domain events published after the domain decision and persistence boundary required by the project?
- Are domain events and integration events clearly distinguished?
- Are event handlers/projections idempotent when duplicate delivery or replay is possible?
- Are event payloads named in ubiquitous language and free of accidental persistence internals?

## Errors And Tests

- Are expected failures explicit and structured?
- Do error codes use canonical domain terms?
- Does every changed test matrix row have a stable id, automation level, and automated test binding or documented exception?
- Do tests name the behavior in the same language as specs and code?
- Do test names or metadata include the matrix ids they prove?
- Do tests cover the strongest observable boundary appropriate for the behavior?
- Are migration gaps explicit instead of hidden in weakened specs?
