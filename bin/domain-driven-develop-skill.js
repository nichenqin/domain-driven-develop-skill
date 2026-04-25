#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const skillName = "domain-driven-develop";
const skillSource = path.join(packageRoot, "skills", skillName);

function printHelp() {
  console.log(`Domain Driven Develop Skill

Standard skill install:
  npx skills add https://github.com/nichenqin/domain-driven-develop-skill/tree/main/skills/domain-driven-develop

Usage:
  domain-driven-develop-skill install [--dest <skills-dir>] [--force]
  domain-driven-develop-skill init [--cwd <project-root>] [--project <name>] [--profile-name <name>] [--force]
  domain-driven-develop-skill doctor [--cwd <project-root>]

Examples:
  npx skills add https://github.com/nichenqin/domain-driven-develop-skill/tree/main/skills/domain-driven-develop
  npx github:nichenqin/domain-driven-develop-skill init --project appaloft
  npx github:nichenqin/domain-driven-develop-skill doctor
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const command = args[0] && !args[0].startsWith("-") ? args.shift() : "install";
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--force") {
      options.force = true;
      continue;
    }

    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
      options[toCamelCase(match[1])] = match[2];
      continue;
    }

    if (arg.startsWith("--")) {
      const key = toCamelCase(arg.slice(2));
      const next = args[index + 1];
      if (!next || next.startsWith("--")) {
        options[key] = true;
      } else {
        options[key] = next;
        index += 1;
      }
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  return { command, options };
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function ensureSkillSource() {
  if (!fs.existsSync(path.join(skillSource, "SKILL.md"))) {
    throw new Error(`Skill source not found at ${skillSource}`);
  }
}

function removeIfForce(target, force) {
  if (!fs.existsSync(target)) return;
  if (!force) {
    throw new Error(`${target} already exists. Re-run with --force to overwrite.`);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function copyDirectory(source, target, force) {
  removeIfForce(target, force);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

function install(options) {
  ensureSkillSource();
  const skillsDir = options.dest
    ? path.resolve(options.dest)
    : path.join(codexHome(), "skills");
  const target = path.join(skillsDir, skillName);

  copyDirectory(skillSource, target, Boolean(options.force));
  console.log(`Installed ${skillName} to ${target}`);
  console.log("Restart Codex to pick up new skills.");
}

function initProject(options) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const projectName = sanitizeName(options.project || path.basename(cwd));
  const profileName = sanitizeName(options.profileName || `${projectName}-develop`);

  if (!projectName) throw new Error("Project name is required.");
  if (!profileName) throw new Error("Profile name is required.");

  const files = new Map([
    [
      path.join(cwd, ".codex", "skills", profileName, "SKILL.md"),
      projectProfileSkill(projectName, profileName),
    ],
    [
      path.join(cwd, ".codex", "skills", profileName, "agents", "openai.yaml"),
      projectProfileOpenAiYaml(projectName),
    ],
    [path.join(cwd, "docs", "DOMAIN_MODEL.md"), domainModelTemplate(projectName)],
    [path.join(cwd, "docs", "decisions", "README.md"), decisionsTemplate(projectName)],
    [path.join(cwd, "docs", "commands", "README.md"), behaviorSpecTemplate("Commands")],
    [path.join(cwd, "docs", "queries", "README.md"), behaviorSpecTemplate("Queries")],
    [path.join(cwd, "docs", "events", "README.md"), behaviorSpecTemplate("Events")],
    [path.join(cwd, "docs", "workflows", "README.md"), behaviorSpecTemplate("Workflows")],
    [path.join(cwd, "docs", "errors", "README.md"), behaviorSpecTemplate("Errors")],
    [path.join(cwd, "docs", "testing", "README.md"), testingTemplate(projectName)],
    [path.join(cwd, "docs", "documentation", "README.md"), publicDocsTemplate(projectName)],
  ]);

  for (const [filePath, content] of files) {
    writeFile(filePath, content, Boolean(options.force));
  }

  console.log(`Initialized Domain Driven Develop profile: ${profileName}`);
  console.log(`Project root: ${cwd}`);
  console.log("");
  console.log("Next prompt for Codex:");
  console.log(
    `Use domain-driven-develop and ${profileName} to discover this project's bounded contexts, ubiquitous language, behavior specs, and test matrix from the business logic.`,
  );
}

function writeFile(filePath, content, force) {
  if (fs.existsSync(filePath) && !force) {
    console.log(`Skipped existing file: ${filePath}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Wrote ${filePath}`);
}

function sanitizeName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function title(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function projectProfileSkill(projectName, profileName) {
  const displayName = title(projectName);
  return `---
name: ${profileName}
description: Project-specific Domain Driven Develop profile for ${displayName}. Use with the global domain-driven-develop skill when Codex works on this repository's business behavior, domain model, specs, tests, entrypoints, or implementation. This profile binds generic Domain Driven Develop categories to this project's source-of-truth files and requires consistent ubiquitous language across docs, code, tests, events, errors, and entrypoints.
---

# ${displayName} Develop Profile

Use the global \`domain-driven-develop\` skill as the method and workflow. This local profile only binds that method to this repository's source-of-truth files.

Do not duplicate project domain facts in this profile. The domain model and specs below win.

## Source Of Truth

Read these before non-trivial behavior or domain work:

1. Repository rules: \`AGENTS.md\`, \`CONTRIBUTING.md\`, or equivalent when present.
2. Domain model: \`docs/DOMAIN_MODEL.md\`.
3. Decisions: \`docs/decisions/**\`.
4. Commands: \`docs/commands/**\`.
5. Queries: \`docs/queries/**\`.
6. Events: \`docs/events/**\`.
7. Workflows: \`docs/workflows/**\`.
8. Errors: \`docs/errors/**\`.
9. Testing: \`docs/testing/**\`.
10. Public docs/help: \`docs/documentation/**\`.

## Required Behavior

- Use the bounded context's ubiquitous language in docs, code, tests, events, errors, APIs, CLI commands, UI text, and help text.
- Treat undocumented naming drift as a blocker for Code Round.
- Keep this profile thin. Update \`docs/DOMAIN_MODEL.md\` or the relevant spec instead of adding facts here.
- When Code Round touches domain modeling, apply the relevant global references from \`domain-driven-develop\`.

## Init Follow-Up

Ask Codex to fill the project docs from actual business logic:

\`\`\`text
Use domain-driven-develop and ${profileName} to discover this project's bounded contexts, ubiquitous language, behavior specs, and test matrix from the business logic. Start with Discover Round and do not write production code.
\`\`\`
`;
}

function projectProfileOpenAiYaml(projectName) {
  const displayName = title(projectName);
  return `interface:
  display_name: "${displayName} Develop"
  short_description: "Project profile for Domain Driven Develop."
  default_prompt: "Use Domain Driven Develop with this project's source-of-truth docs."
`;
}

function domainModelTemplate(projectName) {
  const displayName = title(projectName);
  return `# Domain Model

> CORE DOCUMENT
>
> This file is the domain-model source of truth for ${displayName}.
> If package layout, code names, tests, or entrypoints conflict with this file, reconcile them or document a compatibility alias.

## Ubiquitous Language

Define canonical terms here. The same terms must be used in docs, code, tests, events, errors, APIs, CLI commands, UI/help text, and behavior specs.

| Canonical term | Meaning | Forbidden or legacy terms | Compatibility alias notes |
| --- | --- | --- | --- |
|  |  |  |  |

## Bounded Contexts

### Context Name

Owns:
- AggregateRoot

Implemented now:
- 

Boundary rules:
- 

## Aggregate Roots

### AggregateRoot

Owns:
- Entity
- ValueObject

Invariants:
- 

Domain operations:
- 

Events:
- 

## Value Objects

- 

## Domain Services

- 

## Current Implementation Notes And Migration Gaps

- 
`;
}

function decisionsTemplate(projectName) {
  return `# Decisions

Accepted decisions govern local specs and implementation for ${title(projectName)}.

Create or update a decision before local specs or code when a change touches:

- command/query boundary;
- aggregate ownership or lifecycle ownership;
- lifecycle stages, readiness gates, retry semantics, rollback semantics, or async acceptance;
- durable state shape;
- cross-boundary naming or canonical language;
- route/domain/security/public-contract semantics;
- long-running workflow behavior.
`;
}

function behaviorSpecTemplate(kind) {
  return `# ${kind}

Use this directory for source-of-truth ${kind.toLowerCase()} specs.

Each behavior spec should define:

- behavior name;
- bounded context and domain owner;
- canonical terms;
- input and output contract;
- expected events or state changes;
- error contract;
- public/API/CLI/tool surfaces when relevant;
- tests or matrix ids.
`;
}

function testingTemplate(projectName) {
  return `# Testing

Testing specs and matrices for ${title(projectName)}.

Each behavior row should include:

- stable id;
- behavior name in ubiquitous language;
- preferred automation level;
- source-of-truth spec link;
- expected entrypoint or observable result;
- current automation status.
`;
}

function publicDocsTemplate(projectName) {
  return `# Documentation

Public or user-facing documentation decisions for ${title(projectName)}.

For each user-visible behavior, record one outcome:

- public task page;
- concept page;
- reference page;
- troubleshooting page;
- stable anchor on an existing page;
- not user-facing, with reason;
- explicit docs migration gap.

Public wording may be task-oriented, but it must map back to canonical domain language.
`;
}

function doctor(options) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const installedSkill = path.join(codexHome(), "skills", skillName, "SKILL.md");
  const localProfiles = path.join(cwd, ".codex", "skills");

  console.log(`Package skill source: ${fs.existsSync(path.join(skillSource, "SKILL.md")) ? "ok" : "missing"}`);
  console.log(`Installed global skill: ${fs.existsSync(installedSkill) ? installedSkill : "not found"}`);
  console.log(`Project profiles dir: ${fs.existsSync(localProfiles) ? localProfiles : "not found"}`);

  if (fs.existsSync(localProfiles)) {
    const profiles = fs
      .readdirSync(localProfiles, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    console.log(`Project profiles: ${profiles.length ? profiles.join(", ") : "none"}`);
  }
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (options.help || command === "help") {
    printHelp();
    return;
  }

  if (command === "install") {
    install(options);
    return;
  }

  if (command === "init") {
    initProject(options);
    return;
  }

  if (command === "doctor") {
    doctor(options);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
