# Project Initialization

Use this reference when a repository has no project-specific domain docs or local Domain Driven Develop profile yet.

## Purpose

The global `domain-driven-develop` skill provides method and guardrails. A real project also needs local facts:

- bounded contexts;
- ubiquitous language;
- aggregate ownership;
- behavior specs;
- decisions;
- tests and acceptance criteria;
- entrypoint/help surfaces.

The `init` command scaffolds those local places without inventing business facts.

## Commands

Install the global skill:

```bash
npx skills add https://github.com/nichenqin/domain-driven-develop-skill/tree/main/skills/domain-driven-develop
```

Initialize a project profile and docs from a project root:

```bash
npx github:nichenqin/domain-driven-develop-skill init --project my-project
```

Check local state:

```bash
npx github:nichenqin/domain-driven-develop-skill doctor
```

## Generated Profile

The generated `.codex/skills/<project>-develop/SKILL.md` is intentionally thin. It should:

- say to use global `domain-driven-develop`;
- bind source-of-truth categories to project paths;
- require ubiquitous language consistency;
- point to `docs/DOMAIN_MODEL.md` and local specs;
- avoid copying domain facts.

## Follow-Up Prompt

After `init`, ask Codex:

```text
Use domain-driven-develop and <project>-develop to discover this project's bounded contexts, ubiquitous language, behavior specs, and test matrix from the business logic. Start with Discover Round and do not write production code.
```

Then review the generated source-of-truth docs before Code Round.
