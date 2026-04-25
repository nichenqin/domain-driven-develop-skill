# Roadmap And Versioning

Use this reference when selecting the next behavior, checking release readiness, changing a public surface, or deciding whether a behavior has patch, minor, major, prerelease, or no version impact.

This reference is generic. Project roadmap targets, release promises, supported-version ranges, and product milestones belong in the target repository or local project profile, not in this skill.

## Source-Of-Truth Inputs

Locate and read the project's own sources before classifying version impact:

- product roadmap, release plan, milestone board, or backlog;
- version policy, release runbook, SemVer policy, or changelog rules;
- public API or public contract definition;
- public documentation, CLI help, tool schema, config schema, event schema, and API contract docs;
- compatibility, deprecation, migration, and support-window policy;
- accepted decisions or ADRs governing public surfaces, persistence shape, lifecycle, or language.

If the project does not define its public surface or version policy, record `version impact: unknown` and treat release-sensitive work as blocked for release readiness until a policy exists.

## Public Surface

Define the public surface from the project's point of view. It may include:

- library APIs;
- HTTP/RPC/GraphQL/protobuf contracts;
- CLI commands, arguments, exit codes, help text, and machine-readable output;
- config files and repository templates;
- event, webhook, message, plugin, or tool schemas;
- database or state schema only when users, plugins, integrations, or operational runbooks depend on it;
- public docs, examples, and generated SDKs.

Do not assume source-code internals are public. Do not assume a behavior is private when docs, CLI, APIs, events, or config expose it.

## SemVer Classification

Use the project's policy first. When the project uses Semantic Versioning, classify by public-surface compatibility:

| Impact | Meaning |
| --- | --- |
| `none` | Purely internal change with no public behavior, public docs, support promise, or compatibility impact. |
| `patch` | Backward-compatible bug fix or correction to existing public behavior. |
| `minor` | Backward-compatible new public capability, public field, supported option, or deprecation notice. |
| `major` | Backward-incompatible public contract, behavior, schema, persistence, or support change. |
| `pre-1.0-policy` | The project is before 1.0.0; SemVer allows instability, but the project policy still decides what users must be told and migrated through. |
| `unknown` | The public surface or version policy is not defined enough to classify. |

Prerelease and build metadata are release mechanics. They do not replace the compatibility classification.

Deprecation is a public compatibility event. If the project uses SemVer, a new deprecation normally belongs in a minor release before removal in a later major release, unless the project's pre-1.0 or support policy says otherwise.

## Roadmap Gate

Before recommending or implementing a behavior:

1. Identify the current roadmap target or milestone.
2. Check whether the behavior belongs to the current target, a later target, a hotfix, or an unplanned support issue.
3. Prefer the smallest behavior that advances the current target or unblocks a documented release gate.
4. Do not pull later-roadmap behavior forward silently. If doing it early is useful, record why and update the roadmap or implementation plan.
5. If a release target claims the behavior, verify that specs, tests, docs, and entrypoints match the claim before calling it release-ready.

Roadmap entries are not implementation permission by themselves. A behavior still needs source-of-truth semantics, domain ownership, tests, and entrypoint decisions.

## Version Gate

For release-sensitive work, record in the behavior dossier and final report:

- roadmap target or milestone;
- current released version or development line when known;
- intended version target when the project has one;
- compatibility impact: `none`, `patch`, `minor`, `major`, `pre-1.0-policy`, or `unknown`;
- affected public surfaces;
- docs, changelog, migration, or release-note requirement;
- whether an ADR/decision record is needed for compatibility, support, or migration policy.

If the compatibility impact is `major` or `unknown`, do not treat Code Round as release-ready until a decision record or project policy resolves the version path.

## Round Behavior

During Discover or Next Behavior Selection:

- include roadmap target and compatibility risk in candidate ranking;
- prefer release-gate gaps over unrelated polish when the user asks what to do next;
- call out later-roadmap behavior instead of presenting it as current work.

During Spec Round:

- update roadmap, release-plan, public contract, deprecation, migration, and docs requirements when semantics change;
- describe public compatibility expectations in the same language as the domain model and public contracts.

During Testing/Test-First Round:

- add compatibility, migration, schema, and public-contract tests when version impact is not `none`;
- include stable ids for backward compatibility, deprecation, or breaking-change behavior.

During Code Round:

- implement only the version impact and public-surface behavior already governed by specs and decisions;
- update changelog or release-note inputs only when the project uses those artifacts and the round scope includes them.

During Post-Implementation Sync:

- verify roadmap target, version impact, public-surface docs, and tests still match the implemented behavior;
- record remaining release blockers explicitly.
