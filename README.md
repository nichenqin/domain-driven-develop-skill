# Domain Driven Develop Skill

An installable Codex skill for developing domain-driven software from source-of-truth specifications through implementation.

## Install

Install with the standard `skills` CLI:

```bash
npx skills add https://github.com/nichenqin/domain-driven-develop-skill/tree/main/skills/domain-driven-develop
```

Non-interactive global install:

```bash
npx skills add https://github.com/nichenqin/domain-driven-develop-skill/tree/main/skills/domain-driven-develop \
  --global \
  --yes \
  --skill domain-driven-develop
```

You can list available skills first:

```bash
npx skills add https://github.com/nichenqin/domain-driven-develop-skill --list --full-depth
```

Restart your agent app after installation if it does not pick up newly installed skills automatically.

## Initialize A Project With Natural Language

The global skill is intentionally generic. It becomes useful when a project has local source-of-truth docs and a thin project profile skill. Ask the agent to initialize those artifacts with natural language:

```text
Use domain-driven-develop to initialize a new CRM product in this repository. Start with Init Round: create the project profile skill, domain model, ubiquitous language, behavior/spec docs, and test matrix foundation. Do not write production code yet.
```

The Init Round should create or update local project artifacts such as:

```text
.codex/skills/<project>-develop/SKILL.md
docs/DOMAIN_MODEL.md
docs/decisions/**
docs/operations/**
docs/commands/**
docs/queries/**
docs/events/**
docs/workflows/**
docs/errors/**
docs/testing/**
docs/documentation/**
```

The project profile should stay thin: it points back to `domain-driven-develop`, binds source-of-truth paths, and does not duplicate business facts.

## Skill Path

The installable skill lives at:

```text
skills/domain-driven-develop
```

## What It Covers

- Domain Driven Develop as the entry workflow.
- Spec-Driven Develop as process control.
- Domain model source-of-truth binding.
- ADR/decision-record gating for durable boundary, lifecycle, ownership, language, persistence, and public-contract choices.
- Ubiquitous language alignment across docs, code, tests, events, errors, and entrypoints.
- Aggregate roots, value objects, domain services, repositories, application services, specifications, visitors, dependency injection, and inversion of control.
- TypeScript examples with room for additional language references.

## License

MIT
