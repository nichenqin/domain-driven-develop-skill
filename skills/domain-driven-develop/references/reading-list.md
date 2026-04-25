# Reading List

Use these sources for conceptual grounding. Do not paste long excerpts into user-facing output.

## Domain-Driven Design

- Eric Evans, "Domain-Driven Design Reference": concise definitions and pattern summaries including ubiquitous language, bounded context, context map, anticorruption layer, open-host service, and published language. https://www.domainlanguage.com/ddd/reference/
- Microsoft Learn, "Designing a microservice domain model": aggregate roots maintain consistency boundaries and should be the entry point for updates inside the aggregate. https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model
- Microsoft Learn, "Implementing value objects": value objects are part of the domain model and have persistence implications distinct from entities. https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects
- David Laribee, "An Introduction To Domain-Driven Design": DDD uses concepts such as ubiquitous language, bounded contexts, entities, value objects, aggregate roots, domain services, and repositories to close the gap between business reality and code. https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design

## Specification Pattern

- Eric Evans and Martin Fowler, "Specifications": specifications can select objects, validate suitability, support construction-to-order, and compose with `and`, `or`, and `not`. https://martinfowler.com/apsupp/spec.pdf
- Martin Fowler, "Repository": repository mediates between domain and data mapping layers using a collection-like interface. https://martinfowler.com/eaaCatalog/repository.html

## Spec-Driven Development

- GitHub Spec Kit, "Spec-Driven Development": specs become the central source of truth and code serves the specification. https://github.com/github/spec-kit/blob/main/spec-driven.md

## Versioning

- Semantic Versioning 2.0.0: version changes communicate public API compatibility; projects must define a public API before applying SemVer. https://semver.org/

## CQRS

- Martin Fowler, "CQRS": CQRS separates command and query models where the split earns its complexity, and warns that it is risky for many systems. https://martinfowler.com/bliki/CQRS.html
- Martin Fowler, "CommandQuerySeparation": asking a question should not change observable state, and changing state should not be treated as a pure query. https://martinfowler.com/bliki/CommandQuerySeparation.html
- Microsoft Azure Architecture Center, "CQRS pattern": commands update data and queries read data, with separate models and consistency tradeoffs when useful. https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs
- Microsoft Learn, "Implementing reads/queries in a CQRS microservice": read models and DTOs can be shaped directly for client needs and do not need aggregate purity. https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/cqrs-microservice-reads

## Domain Events

- Martin Fowler, "Domain Event": domain events record something that happened in the domain and can trigger reactions without coupling the producer to every consumer. https://martinfowler.com/eaaDev/DomainEvent.html
- microservices.io, "Transactional outbox": persist messages in the same transaction as the aggregate update, then relay them to avoid publishing facts for failed writes. https://microservices.io/patterns/data/transactional-outbox.html

## Dependency Injection And IoC

- Martin Fowler, "Inversion of Control Containers and the Dependency Injection pattern": separates service configuration from use, compares dependency injection and service locator, and describes constructor injection. https://martinfowler.com/articles/injection.html

## Example Repositories

- Vaughn Vernon, IDDD samples: https://github.com/VaughnVernon/IDDD_Samples
- CodelyTV TypeScript DDD example: https://github.com/CodelyTV/typescript-ddd-example
- Khalil Stemmler DDD forum: https://github.com/stemmlerjs/ddd-forum
- Ardalis Specification: https://github.com/ardalis/Specification
