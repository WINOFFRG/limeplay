# v3 events prototype

This is the existing store-composition architecture plus a typed event emitter.

Users still compose store slices:

```ts
export type TypeMediaStore = PlaybackStore & VolumeStore
```

They do not import `VolumeEvents`. `VolumeStore` carries that type:

```ts
export interface VolumeStore extends PlayerEventSlice<VolumeEvents> {
  hasAudio: boolean
  muted: boolean
  volume: number
}
```

So after `VolumeStore` is installed, event names and payloads are inferred:

```tsx
const events = usePlayerEvents()

React.useEffect(() => {
  return events.on("volumechange", ({ muted, volume }) => {
    console.log({ muted, volume })
  })
}, [events])
```

The event listeners are not stored in Zustand. Runtime listeners live in a
module `WeakMap` keyed by the current provider's store.
