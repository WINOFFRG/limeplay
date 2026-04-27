---
description: "Use when creating, editing, or reviewing Limeplay feature hooks"
applyTo: "apps/www/registry/default/hooks/**"
---

# Feature Hook Patterns

## Structure

Every hook file exports: `xxxFeature()`, `useXxxStore()`, and optionally a `useXxx()` convenience API.

```ts
export const XXX_FEATURE_KEY = "xxx"

export interface XxxEvents {
  eventname: PayloadType
}

export interface XxxStore extends MediaEventSlice<XxxEvents> {
  [XXX_FEATURE_KEY]: {
    // state fields
    // action methods
  }
}

export function xxxFeature(): MediaFeature<XxxStore> {
  return {
    createSlice: (set, get, _store, events) => ({
      [XXX_FEATURE_KEY]: {
        // ...state and actions
      },
    }),
    key: XXX_FEATURE_KEY,
    Setup: XxxSetup,
  }
}

export function useXxxStore<T>(selector: (state: XxxStore["xxx"]) => T): T {
  return useMediaFeatureStore<XxxStore, T>(
    XXX_FEATURE_KEY,
    (state) => selector(state[XXX_FEATURE_KEY])
  )
}
```

## Rules

- `createSlice` receives 4 args: `(set, get, store, events)` — use `events.emit()` for state change notifications
- No `on*` callback fields in store interfaces — use `MediaEventEmitter` events
- Event names are lowercase native format: `volumechange`, `timeupdate`, `durationchange`
- Setup components read state lazily via `api.getState()` inside event handlers, NOT closed-over render variables
- Effect deps should be minimal and stable — never put inline-computed values in deps
- Async functions need abort/generation guards after each `await`
- Polling intervals must suspend when not observable (check playback status)

## Registry

After creating/modifying a hook, update `apps/www/registry/collection/registry-hooks.ts`:

```ts
{
  name: "use-xxx",
  type: "registry:hook",
  dependencies: [],           // npm packages
  registryDependencies: [],   // other registry items like "use-media", "media-provider"
  files: [{
    path: "hooks/use-xxx.ts",
    target: "hooks/limeplay/use-xxx.ts",
    type: "registry:hook",
  }],
}
```
