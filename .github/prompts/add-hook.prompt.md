---
description: "End-to-end workflow to add a new Limeplay feature hook: implementation, registry, example, docs"
agent: "agent"
argument-hint: "Feature name and what it manages (e.g. 'fullscreen - manages fullscreen state')"
---

# Add Limeplay Hook

You are adding a new feature hook to Limeplay. Follow these phases in order.

## Phase 1: Implement the Hook

Create the hook file at `apps/www/registry/default/hooks/use-{name}.ts`.

Follow the patterns in [hooks instructions](./../instructions/hooks.instructions.md).

Reference existing hooks for patterns:
- Simple state + actions: [use-volume.ts](../../apps/www/registry/default/hooks/use-volume.ts)
- With Setup component: [use-playback.ts](../../apps/www/registry/default/hooks/use-playback.ts)
- Complex with external API: [use-player.ts](../../apps/www/registry/default/hooks/use-player.ts)

Required exports: `xxxFeature()`, `useXxxStore()`, `XXX_FEATURE_KEY`, `XxxStore`, `XxxEvents`.

## Phase 2: Register in Registry

Add entry to `apps/www/registry/collection/registry-hooks.ts`.
Follow the patterns in [registry instructions](./../instructions/registry.instructions.md).

Ensure `registryDependencies` includes all registry items the hook imports.

## Phase 3: Create Example

Create `apps/www/registry/default/examples/{name}-demo.tsx`.
Follow the patterns in [examples instructions](./../instructions/examples.instructions.md).

Register in `apps/www/registry/collection/registry-examples.ts`.

## Phase 4: Write Documentation

Create `apps/www/content/docs/hooks/use-{name}.mdx`.
Follow the patterns in [docs instructions](./../instructions/docs.instructions.md).

Must include: Installation, Feature registration, Store tables, Events table, AutoTypeTable.

## Phase 5: Validate

1. Check for TypeScript errors in the new hook file
2. Verify registry builds: `cd apps/www && bun run registry:build`
3. Confirm the docs page renders: check for broken imports or missing references
