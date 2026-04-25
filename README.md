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

## Initialize A Project

The global skill is intentionally generic. It becomes useful when a project has local source-of-truth docs and a thin project profile skill.

From a project root:

```bash
npx github:nichenqin/domain-driven-develop-skill init --project my-project
```

This creates:

```text
.codex/skills/my-project-develop/
docs/DOMAIN_MODEL.md
docs/decisions/README.md
docs/commands/README.md
docs/queries/README.md
docs/events/README.md
docs/workflows/README.md
docs/errors/README.md
docs/testing/README.md
docs/documentation/README.md
```

Then ask Codex to use `domain-driven-develop` and the generated `<project>-develop` profile to fill the docs from your business logic.

Useful commands:

```bash
npx github:nichenqin/domain-driven-develop-skill init --project my-project --force
npx github:nichenqin/domain-driven-develop-skill doctor
```

The custom `npx github:nichenqin/domain-driven-develop-skill ...` CLI is for project bootstrapping. Use `npx skills add ...` for normal skill installation.

## Skill Path

The installable skill lives at:

```text
skills/domain-driven-develop
```

## What It Covers

- Domain Driven Develop as the entry workflow.
- Spec-Driven Develop as process control.
- Domain model source-of-truth binding.
- Ubiquitous language alignment across docs, code, tests, events, errors, and entrypoints.
- Aggregate roots, value objects, domain services, repositories, application services, specifications, visitors, dependency injection, and inversion of control.
- TypeScript examples with room for additional language references.

## License

MIT
