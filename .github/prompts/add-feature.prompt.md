---
description: "End-to-end workflow to add a complete Limeplay feature: hook + UI component + examples + registry + docs"
agent: "agent"
argument-hint: "Feature name and what it does (e.g. 'fullscreen - manages fullscreen state with a toggle button')"
---

# Add Limeplay Feature

You are adding a complete feature to Limeplay — hook, UI component, examples, registry entries, and documentation. Follow these phases in order.

## Phase 1: Implement the Hook

Create `apps/www/registry/default/hooks/use-{name}.ts`.

Follow the patterns in [hooks instructions](./../instructions/hooks.instructions.md).

Reference existing hooks for patterns:
- Simple state + actions: [use-volume.ts](../../apps/www/registry/default/hooks/use-volume.ts)
- With Setup component: [use-playback.ts](../../apps/www/registry/default/hooks/use-playback.ts)
- Complex with external API: [use-player.ts](../../apps/www/registry/default/hooks/use-player.ts)

Required exports: `xxxFeature()`, `useXxxStore()`, `XXX_FEATURE_KEY`, `XxxStore`, `XxxEvents`.

## Phase 2: Implement the UI Component

Create `apps/www/registry/default/ui/{name}-control.tsx`.

Follow the patterns in [UI instructions](./../instructions/ui-components.instructions.md).

Reference existing components:
- Simple control: [playback-control.tsx](../../apps/www/registry/default/ui/playback-control.tsx)
- Compound component: [volume-control.tsx](../../apps/www/registry/default/ui/volume-control.tsx)
- Complex with pointer tracking: [timeline-control.tsx](../../apps/www/registry/default/ui/timeline-control.tsx)

Requirements: `asChild` support, ARIA attributes, keyboard interaction, `"use client"` directive.

## Phase 3: Create Examples

Create demo components at `apps/www/registry/default/examples/`.

Follow the patterns in [examples instructions](./../instructions/examples.instructions.md).

Create at minimum:
1. `{name}-demo.tsx` — Primary demo showing the UI component in action
2. `{name}-state-control-demo.tsx` — Demo showing store selector usage (if applicable)

## Phase 4: Register Everything

Update these files in `apps/www/registry/collection/`:

Follow the patterns in [registry instructions](./../instructions/registry.instructions.md).

1. **`registry-hooks.ts`** — Add the hook entry with correct `registryDependencies`
2. **`registry-ui.ts`** — Add the component entry, depends on the hook + `media-provider`
3. **`registry-examples.ts`** — Add all example entries

## Phase 5: Write Documentation

Follow the patterns in [docs instructions](./../instructions/docs.instructions.md).

Create two docs pages:

### Hook doc: `apps/www/content/docs/hooks/use-{name}.mdx`
Must include: Installation, Feature registration, Store (State + Actions tables), Events table, AutoTypeTable.

### Component doc: `apps/www/content/docs/components/{name}-control.mdx`
Must include: ComponentPreview, Installation, Callout for required features, Usage code block, Components section.

## Phase 6: Validate

1. Check for TypeScript errors in all new files
2. Verify registry builds: `cd apps/www && bun run registry:build`
3. Confirm no broken imports or missing references
