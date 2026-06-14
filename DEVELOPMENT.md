# Development

This repo uses Bun workspaces. The docs site and registry live in `apps/www`.

## Setup

```bash
bun install
cd apps/www
bun run dev
```

The local site runs on the Next.js dev server.

## Commands

Run these from the repo root unless the command says otherwise.

```bash
bun run lint
bun run format:check
bun run test:local
```

Registry and site checks:

```bash
cd apps/www
bun run registry:build
bun run validate:registries
bun run build
```

## Project Layout

| Path | Purpose |
| --- | --- |
| `apps/www/content/docs` | Fumadocs documentation |
| `apps/www/registry/default/ui` | Copyable UI primitives |
| `apps/www/registry/default/hooks` | Feature hooks and utilities |
| `apps/www/registry/default/blocks` | Complete player blocks |
| `apps/www/registry/collection` | shadcn registry metadata |
| `apps/www/public/r` | Generated registry JSON |
| `prompts` | Project rules for local assistants and review tooling |

## Contribution Notes

- Public examples should import from `@/components/limeplay/*` and `@/hooks/limeplay/*`, not `@/registry/*`.
- New or changed components, hooks, and utilities need registry metadata.
- Registry dependencies should be explicit and major versions with breaking changes should be pinned.
- Blocks should keep public loading props consistent: `source`, `loading`, `sourceKey`, `autoLoad`, `initialIndex`, and `mediaProps`.
- Use feature selectors and `useMediaEvents()` instead of deleted convenience hooks or `on*` callback fields.
