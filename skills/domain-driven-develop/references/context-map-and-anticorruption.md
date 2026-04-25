# Context Map And Anticorruption

Use this reference when a behavior crosses bounded contexts, teams, external systems, legacy models, vendor APIs, public contracts, or shared data languages.

## Purpose

A bounded context owns a model and language. A context map makes relationships between models explicit so one context's language does not silently distort another.

This is strategic DDD. Use it before tactical patterns when integration pressure is shaping the model.

## Relationship Types

Choose the lightest relationship that makes the dependency honest:

| Relationship | Use When | Guardrail |
| --- | --- | --- |
| Partnership | Two teams or contexts co-design a shared flow and can coordinate changes closely. | Do not use if one side cannot actually coordinate release or language changes. |
| Shared Kernel | A deliberately small model is shared by multiple contexts. | Keep it tiny, versioned, and jointly owned; avoid turning it into a common dumping ground. |
| Customer/Supplier | Upstream owns a model or API and downstream has influence through requirements. | Document obligations, compatibility promises, and change notification. |
| Conformist | Downstream intentionally accepts the upstream model. | Use only when translation cost is not worth it and domain distortion is acceptable. |
| Anticorruption Layer | Downstream protects its model from an upstream, legacy, vendor, or foreign model. | Translate at the boundary; do not leak foreign types into domain objects. |
| Open-Host Service | A context publishes a stable integration protocol. | Treat the protocol as a public contract with versioning and tests. |
| Published Language | Contexts integrate through a documented common language. | Keep terms precise and map them to each context's local language. |
| Separate Ways | Integration is intentionally avoided. | Record why no model or protocol relationship is needed. |

If none fits, stop and write the relationship in plain language before designing code.

## Anticorruption Layer

Use an anticorruption layer when an external model would weaken the bounded context language.

Typical places:

- adapter modules;
- integration packages;
- application ports and translators;
- ingestion or export mappers;
- integration-event translators;
- migration/import tooling.

Rules:

- domain objects should not import vendor SDK, transport DTO, persistence row, or legacy types;
- translate external identifiers, statuses, timestamps, names, and lifecycle states into local value objects and domain concepts;
- keep lossy translations explicit and tested;
- map external errors into project error contracts at the boundary;
- document ownership of compatibility, versioning, and fallback behavior.

## Published Language

Use a published language when contexts need a stable shared protocol:

- API schema;
- event or webhook schema;
- plugin/tool schema;
- config schema;
- generated SDK contract;
- shared read model exported to other contexts.

The published language must have:

- owning context;
- canonical terms;
- schema/version policy;
- compatibility and deprecation policy;
- examples or contract tests;
- translation rules to and from local bounded-context language.

Do not let a published language replace the internal ubiquitous language unless it is the same language by design.

## Context Map Dossier Fields

When a behavior crosses contexts, add these fields to the behavior dossier:

```markdown
- Upstream context:
- Downstream context:
- Relationship type:
- Published language:
- Translation boundary:
- Anticorruption layer modules:
- Shared kernel scope:
- External compatibility policy:
- Cross-context tests:
- Context-map decision or ADR:
```

## Code Placement

Place translation where dependencies already point outward:

- domain: local terms, value objects, aggregates, domain events;
- application: ports, commands, queries, use-case orchestration, local error contracts;
- adapters/integrations/providers: foreign DTOs, SDK types, API clients, persistence rows, protocol-specific visitors;
- public contracts: published language and compatibility promises.

Avoid:

- domain object constructors that accept external DTOs;
- value objects that store foreign status strings without local meaning;
- repositories that return upstream API models;
- application services that branch on vendor-specific lifecycle strings instead of local value objects;
- shared-kernel growth that hides unresolved context boundaries.

## Testing

For cross-context behavior, test:

- translation from external/published language into local domain concepts;
- translation from local concepts back to the published contract;
- compatibility aliases and deprecations;
- error mapping;
- event or API contract examples;
- round-trip behavior only when round-trip is a real invariant;
- explicit failure for unsupported upstream values.

Contract and integration tests are usually more valuable here than isolated unit tests over mapper internals.
