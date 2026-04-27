---
description: "End-to-end workflow to add a new Limeplay UI component: implementation, registry, example, docs"
agent: "agent"
argument-hint: "Component name and what it controls (e.g. 'fullscreen-control - button to toggle fullscreen')"
---

# Add Limeplay UI Component

You are adding a new UI component to Limeplay. Follow these phases in order.

## Phase 1: Implement the Component

Create the component at `apps/www/registry/default/ui/{name}.tsx`.

Follow the patterns in [UI instructions](./../instructions/ui-components.instructions.md).

Reference existing components for patterns:
- Simple control: [playback-control.tsx](../../apps/www/registry/default/ui/playback-control.tsx)
- Compound component: [volume-control.tsx](../../apps/www/registry/default/ui/volume-control.tsx)
- Complex with pointer tracking: [timeline-control.tsx](../../apps/www/registry/default/ui/timeline-control.tsx)

Requirements: `asChild` support, ARIA attributes, keyboard interaction, `"use client"` directive.

## Phase 2: Register in Registry

Add entry to `apps/www/registry/collection/registry-ui.ts`.
Follow the patterns in [registry instructions](./../instructions/registry.instructions.md).

Ensure `registryDependencies` includes the feature hook and `media-provider`.

## Phase 3: Create Example

Create `apps/www/registry/default/examples/{name}-demo.tsx`.
Follow the patterns in [examples instructions](./../instructions/examples.instructions.md).

Register in `apps/www/registry/collection/registry-examples.ts`.

## Phase 4: Write Documentation

Create `apps/www/content/docs/components/{name}.mdx`.
Follow the patterns in [docs instructions](./../instructions/docs.instructions.md).

Must include: ComponentPreview, Installation, Callout for required features, Usage code block, Components section.

## Phase 5: Validate

1. Check for TypeScript errors in the new component
2. Verify registry builds: `cd apps/www && bun run registry:build`
3. Confirm the docs page renders with preview working
