# Decisions And ADRs

Use this reference when a behavior may need an architecture decision record, RFC, decision note, or equivalent durable project decision. "ADR" here means any accepted project decision format; follow the repository's naming and path conventions.

## Purpose

Decision records sit above local behavior specs. They explain why a model, boundary, lifecycle, public contract, or cross-cutting policy exists. Local specs then describe concrete commands, queries, workflows, events, errors, and tests under that decision.

Do not use ADRs as a dumping ground for every requirement. Use them when future work needs to know the tradeoff, authority, and consequences behind a durable choice.

## Required When

Create or update a decision record before local specs or code when the change affects:

- bounded context boundaries or aggregate ownership;
- lifecycle ownership, state stages, readiness gates, retry, rollback, or async acceptance semantics;
- command/query boundary, operation identity, or public capability catalog shape;
- durable state shape, migration policy, or compatibility alias policy;
- canonical domain language used across docs, code, tests, events, errors, APIs, CLI, UI, or help;
- transaction, consistency, event publication, or unit-of-work policy;
- security, tenancy, authorization, audit, privacy, or compliance semantics;
- public API, CLI, configuration, message, tool/MCP, or documentation contract semantics;
- repository, specification, visitor, dependency-injection, or inversion-of-control policy that many modules will follow.

## Usually Not Needed

A new decision record is usually unnecessary when:

- the behavior fits an existing accepted decision and domain model;
- the change is a small local implementation detail with no model or contract consequence;
- the behavior only fills a missing test for already specified semantics;
- a local spec can fully describe the change without altering ownership, lifecycle, language, or public contracts.

Still record the no-ADR-needed rationale in the behavior dossier for non-trivial work.

## Source-Of-Truth Order

Use repository rules first. If the project has no explicit order, apply:

1. Accepted decisions and repository rules.
2. Domain model and ubiquitous language.
3. Local behavior specs and public contracts.
4. Test matrices and executable tests.
5. Implementation plans and code.

If a local spec conflicts with an accepted decision, do not silently update code to match the spec. Enter Sync or Spec Round and decide whether the decision or spec should change.

## Decision Shape

Use the project's template when one exists. Otherwise keep the record short:

```md
# ADR-XXX: <Decision Title>

Status: Proposed | Accepted | Superseded
Date: YYYY-MM-DD

## Context

- What behavior, boundary, lifecycle, or language problem forced a durable decision?
- Which existing decisions, domain docs, specs, or constraints apply?

## Decision

- What is the chosen model or policy?
- Which canonical terms must docs, code, tests, events, errors, and entrypoints use?

## Consequences

- What becomes easier?
- What tradeoffs or constraints does this impose?
- Which specs, tests, public docs, adapters, or persistence modules must align?

## Migration Gaps

- What existing code, docs, or tests temporarily diverge?
- What follow-up round closes each gap?
```

## Decision Dossier Fields

For non-trivial work, classify decisions in the behavior dossier:

- Decision state: existing | update-required | new-required | no-ADR-needed
- Governing decisions:
- New or updated decision path:
- No-ADR-needed rationale:
- Affected ubiquitous language:
- Affected specs/tests/entrypoints:
- Migration gaps:

Do not enter Code Round while `update-required` or `new-required` decision work remains unresolved.
