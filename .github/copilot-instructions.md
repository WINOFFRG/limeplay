# Limeplay — Architecture Context

Limeplay is a **shadcn/ui-based, headless media player UI library** built on Shaka Player. Users install components via `npx shadcn add @limeplay/xxx`.

## Stack

React 19, Next.js 16, Tailwind CSS v4, Zustand + Immer, Shaka Player, fumadocs (docs).

## Architecture

- **Feature composition**: `createMediaKit({ features: [...] as const })` — each feature is `xxxFeature()` returning `MediaFeature<XxxStore>` with `createSlice`, `key`, and optional `Setup` component
- **State access**: Per-feature selectors `useXxxStore(s => s.field)` — always granular, never entire slices
- **Events**: `MediaEventEmitter` via `useMediaEvents()` → `events.on("eventname", handler)` — 18 lowercase event names matching native format
- **Setup auto-mount**: Feature `Setup` components mount inside `MediaProvider` automatically — no manual wiring

## Available Features

`mediaFeature`, `playerFeature`, `playbackFeature`, `volumeFeature`, `timelineFeature`, `playlistFeature`, `captionsFeature`, `playbackRateFeature`, `pictureInPictureFeature`, `assetFeature`

## Workspace Layout

- `apps/www/registry/default/hooks/` — Feature hooks (source of truth)
- `apps/www/registry/default/ui/` — UI components (source of truth)
- `apps/www/registry/default/blocks/` — Composed reference implementations
- `apps/www/registry/default/examples/` — Demo components for docs
- `apps/www/registry/collection/` — Registry metadata (`registry-hooks.ts`, `registry-ui.ts`, `registry-examples.ts`, `registry-lib.ts`, `registry-blocks.ts`)
- `apps/www/content/docs/` — Documentation (fumadocs MDX)
- `apps/www/registry/pro/` — Pro/premium blocks

## Deleted APIs (DO NOT USE)

`usePlayback()`, `useVolume()`, `useTimeline()`, `usePlaybackRate()`, `usePictureInPicture()`, `useMedia()`, `PlayerHooks`, `usePlayerStates`, `useVolumeStates`, `useTimelineStates`, `createPlaybackStore`, `createVolumeStore`, `createMediaStore`, `mediaRef`, all `on*` callback fields.

## Key Patterns

- Event handlers in effects: read state lazily via `api.getState()` inside handlers, NOT closed-over render variables
- Async load functions: use abort/generation guards after each `await`
- Polling intervals: suspend when not observable (paused/ended)
- Components: support `asChild` via `@radix-ui/react-slot`, never block event propagation
- Imports in docs: use `@/hooks/limeplay/*` and `@/components/limeplay/*` — NEVER `@/registry/...`
