# Docs Round

Use this reference when a behavior changes user-visible input, output, status, recovery, workflow sequencing, entrypoint affordances, help text, or public terminology.

## Purpose

Docs Round turns internal behavior into user-facing language without leaking implementation jargon. It also keeps public terms aligned with the bounded context's ubiquitous language.

## Outcomes

Choose one outcome:

- new task page;
- new concept page;
- new reference page;
- new troubleshooting page;
- stable anchor on an existing page;
- not user-facing, with reason;
- explicit docs migration gap.

## Help Surfaces

Check relevant surfaces:

- Web/UI help;
- CLI help and examples;
- API descriptions and schema docs;
- config file comments or reference docs;
- error messages and recovery guidance;
- messages/events surfaced to users;
- future tool or MCP descriptions;
- stable help anchors;
- search aliases;
- locale state when the project has localization;
- agent-readable docs or tool descriptions when the project exposes them.

## Language Rule

Public docs should use user-task language, but they must not invent a separate domain model.

If public wording differs from canonical domain language:

- keep the canonical term in internal docs and code;
- document the public term as an alias or user-facing label;
- translate at the boundary;
- avoid letting marketing or transport labels replace aggregate, command, event, or error names.

## Do Not

- Do not mirror internal DDD folders one-to-one into public docs.
- Do not expose DDD, CQRS, aggregate, repository, port, adapter, or handler terminology in primary user docs unless the page is explicitly advanced or contributor-facing.
- Do not call a user-visible behavior complete without a docs/help outcome or documented exception.
