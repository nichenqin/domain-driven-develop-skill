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

When the user points to a reference repository as the desired style, inspect its package boundaries, dependency direction, and tactical object conventions before scaffolding. Record the adopted parts in an ADR or architecture doc.

## appaloft/appaloft

Repository: https://github.com/appaloft/appaloft

Useful for:

- a TypeScript monorepo style with a central `core` package and separate application/persistence/adapter packages;
- class-based value objects, entities, aggregates, and result/error helpers;
- keeping persistence and external adapters outside core;
- repository ports and specifications near application/core boundaries instead of one package per bounded context.

Caution:

- do not copy Appaloft domain facts or file names blindly;
- split bounded contexts into packages only when the target project's lifecycle and ADR justify it.

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
