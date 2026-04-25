# Example Repositories

Use this reference when concrete public examples would help calibrate tradeoffs. Do not copy any repository wholesale.

## How To Use Examples

Study examples to answer:

- how bounded contexts are organized;
- how aggregate roots, value objects, repositories, and domain events are named;
- how application services call domain behavior;
- where infrastructure is kept out of domain code;
- how specifications are domain-oriented or query-oriented.

Borrow ideas, not architecture by default.

## VaughnVernon/IDDD_Samples

Repository: https://github.com/VaughnVernon/IDDD_Samples

Useful for:

- bounded context examples;
- aggregate-focused modeling;
- domain events and collaboration patterns.

Caution:

- it is a learning sample, not a modern production template.

## CodelyTV/typescript-ddd-example

Repository: https://github.com/CodelyTV/typescript-ddd-example

Useful for:

- TypeScript bounded context organization;
- application handlers around domain concepts;
- domain events and test organization.

Caution:

- it reflects a specific teaching style and should not force CQRS or event-driven patterns into every project.

## stemmlerjs/ddd-forum

Repository: https://github.com/stemmlerjs/ddd-forum

Useful for:

- TypeScript value objects and aggregate naming;
- clean architecture boundaries;
- repository adapter examples.

Caution:

- it is full-stack educational code. Keep the domain lessons and discard stack-specific assumptions.

## ardalis/Specification

Repository: https://github.com/ardalis/Specification

Useful for:

- repository-facing query specification abstraction;
- avoiding repository method proliferation.

Caution:

- it is query-oriented and includes concerns such as includes, ordering, paging, caching, and tracking. That is useful for contrast, but too infrastructure-shaped for a pure domain predicate model.
