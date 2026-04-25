"use client"

import * as React from "react"
import { useStore } from "zustand"
import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"

import {
  type MediaProviderProps,
  type MediaStore,
} from "@/registry/default/hooks/use-media"

export type { MediaProviderProps, MediaStore }

/**
 * A Zustand store API extended with Immer-style `setState`.
 *
 * Unlike vanilla Zustand's `setState(partial)`, this accepts a mutator function
 * that receives a mutable draft of the state:
 *
 * ```ts
 * store.setState(({ volume }) => {
 *   volume.level = 0.5
 * })
 * ```
 */
export type ImmerStoreApi<T> = StoreApi<T> & {
  setState: (updater: (state: T) => void) => void
}

// ── Event bridge ──────────────────────────────────────────────────────

export declare const mediaEventMap: unique symbol

/**
 * Typed event emitter interface. Features call `emit()`, consumers call `on()` / `once()`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MediaEvents<TEvents extends {} = {}> {
  emit: <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    ...args: EventArgs<TEvents[TName]>
  ) => void
  on: <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => () => void
  once: <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => () => void
}

/**
 * Brand interface that marks a store slice with its event types.
 * When multiple slices are intersected, their event maps merge automatically.
 *
 * ```ts
 * export interface VolumeEvents {
 *   volumeChange: { muted: boolean; volume: number }
 * }
 * export interface VolumeStore extends MediaEventSlice<VolumeEvents> {
 *   volume: { level: number; muted: boolean }
 * }
 * ```
 */
export interface MediaEventSlice<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  TEvents extends {} = {},
> {
  readonly [mediaEventMap]?: TEvents
}

/**
 * Defines a media feature slice. Each feature owns a namespaced key in the store.
 *
 * @typeParam TSlice - The shape of this feature's state (e.g. `VolumeStore`).
 * @typeParam TStore - The full store shape visible to `createSlice`. Defaults to the
 *   base `MediaStore`. Widen this when your slice needs cross-feature access
 *   (e.g. `MediaStore & PlayerStore`).
 *
 * ```ts
 * export function volumeFeature(): MediaFeature<VolumeStore> {
 *   return {
 *     key: "volume",
 *     createSlice: (set, get) => ({ volume: { level: 1, ... } }),
 *     Setup: VolumeSetup, // optional component mounted inside MediaProvider
 *   }
 * }
 * ```
 */
export interface MediaFeature<
  TSlice extends MediaShape,
  TStore extends MediaShape & MediaStore = AnyMediaStore,
> {
  createSlice: (
    set: ImmerStoreApi<TStore>["setState"],
    get: StoreApi<TStore>["getState"],
    store: ImmerStoreApi<TStore>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: MediaEvents<any>
  ) => TSlice
  key: keyof TSlice & string
  Setup?: React.ComponentType
}

/**
 * Derives the full store type from an array of features.
 *
 * ```ts
 * type Store = MediaStoreFromFeatures<typeof features>
 * // MediaStore & VolumeStore & PlaybackStore & ...
 * ```
 */
export type MediaStoreFromFeatures<
  TFeatures extends readonly MediaFeature<any, any>[],
> = Simplify<
  MediaStore & UnionToIntersection<SliceFromFeature<TFeatures[number]>>
>

// ── Event bridge internal types ───────────────────────────────────────

type AnyEventListener = (payload?: unknown) => void

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type AnyEvents = {}

type AnyMediaStore = MediaShape & MediaStore

type EventArgs<TPayload> = 0 extends 1 & TPayload
  ? [payload?: TPayload]
  : [TPayload] extends [void]
    ? []
    : [payload: TPayload]

type EventListener<TPayload> = [TPayload] extends [void]
  ? () => void
  : (payload: TPayload) => void

type EventsFromStore<TStore> =
  TStore extends MediaEventSlice<infer TEvents> ? TEvents : AnyEvents

interface MediaRuntimeContextValue {
  events: MediaEvents<AnyEvents>
  featureKeys: Set<string>
  store: ImmerStoreApi<AnyMediaStore>
}

type MediaShape = Record<string, any>

type Simplify<T> = { [Key in keyof T]: T[Key] } & {}

type SliceFromFeature<TFeature> =
  TFeature extends MediaFeature<infer TSlice, any> ? TSlice : never

type UnionToIntersection<TUnion> = (
  TUnion extends unknown ? (value: TUnion) => void : never
) extends (value: infer TIntersection) => void
  ? TIntersection
  : never

// ── Event bridge class ───────────────────────────────────────────────

class MediaEventEmitter<TEvents extends AnyEvents>
  implements MediaEvents<TEvents>
{
  private listeners = new Map<string, Set<AnyEventListener>>()

  emit = <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    ...args: EventArgs<TEvents[TName]>
  ) => {
    const listeners = this.listeners.get(name)
    if (!listeners) return

    for (const listener of [...listeners]) {
      try {
        listener(args[0])
      } catch (err) {
        console.error(`[MediaEvents] Error in "${name}" listener:`, err)
      }
    }
  }

  on = <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => {
    let listeners = this.listeners.get(name)

    if (!listeners) {
      listeners = new Set()
      this.listeners.set(name, listeners)
    }

    listeners.add(listener as AnyEventListener)

    return () => {
      listeners.delete(listener as AnyEventListener)

      if (listeners.size === 0) {
        this.listeners.delete(name)
      }
    }
  }

  once = <TName extends Extract<keyof TEvents, string>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => {
    const off = this.on(name, ((...args: unknown[]) => {
      off()
      ;(listener as AnyEventListener)(...args)
    }) as EventListener<TEvents[TName]>)

    return off
  }
}

const MediaRuntimeContext =
  React.createContext<MediaRuntimeContextValue | null>(null)

/**
 * Creates a fully-typed media runtime from a list of feature slices.
 *
 * Returns a `MediaProvider` component and typed hooks scoped to all registered features.
 *
 * ```ts
 * const media = createMediaKit({
 *   features: [
 *     mediaFeature(),
 *     playerFeature(),
 *     volumeFeature(),
 *   ] as const,
 * })
 *
 * // Use in your app:
 * <media.MediaProvider>
 *   <App />
 * </media.MediaProvider>
 *
 * // Access store from any child:
 * const volume = media.useMediaStore(s => s.volume.level)
 * const api = media.useMediaApi() // full store API for mutations
 * ```
 */
export function createMediaKit<
  const TFeatures extends readonly MediaFeature<any, any>[] =
    readonly MediaFeature<any, any>[],
>({ features }: { features: TFeatures }) {
  type RuntimeStore = MediaStoreFromFeatures<TFeatures>
  type RuntimeEvents = EventsFromStore<RuntimeStore>

  function createMediaStore() {
    const events = new MediaEventEmitter<RuntimeEvents>()

    const store = createStore<RuntimeStore>()(
      immer((set, get, store) =>
        Object.assign(
          {},
          ...features.map((feature) =>
            feature.createSlice(
              set as ImmerStoreApi<RuntimeStore>["setState"],
              get as StoreApi<RuntimeStore>["getState"],
              store as ImmerStoreApi<RuntimeStore>,
              events as unknown as MediaEvents<EventsFromStore<RuntimeStore>>
            )
          )
        )
      )
    )

    return {
      events: events as MediaEvents<RuntimeEvents>,
      store: store as unknown as ImmerStoreApi<RuntimeStore>,
    }
  }

  function MediaProvider({ children }: React.PropsWithChildren) {
    const runtimeRef = React.useRef<null | {
      events: MediaEvents<RuntimeEvents>
      store: ImmerStoreApi<RuntimeStore>
    }>(null)
    const featureKeysRef = React.useRef(
      new Set<string>(features.map((feature) => feature.key))
    )

    if (!runtimeRef.current) {
      runtimeRef.current = createMediaStore()
    }

    const runtime = runtimeRef.current

    return (
      <MediaRuntimeContext.Provider
        value={{
          events: runtime.events as unknown as MediaEvents<AnyEvents>,
          featureKeys: featureKeysRef.current,
          store: runtime.store as ImmerStoreApi<AnyMediaStore>,
        }}
      >
        {children}
        {features.map((feature) => {
          if (!feature.Setup) {
            return null
          }

          const Setup = feature.Setup

          return <Setup key={feature.key} />
        })}
      </MediaRuntimeContext.Provider>
    )
  }

  function useTypedMediaStore<TSelected>(
    selector: (state: RuntimeStore) => TSelected
  ): TSelected {
    const { store } = useMediaRuntime()

    return useStore(store as unknown as StoreApi<RuntimeStore>, selector)
  }

  function useTypedMediaApi(): ImmerStoreApi<RuntimeStore> {
    const { store } = useMediaRuntime()

    return store as unknown as ImmerStoreApi<RuntimeStore>
  }

  function useTypedMediaEvents(): MediaEvents<RuntimeEvents> {
    const { events } = useMediaRuntime()

    return events as unknown as MediaEvents<RuntimeEvents>
  }

  return {
    features,
    MediaProvider,
    useMediaApi: useTypedMediaApi,
    useMediaEvents: useTypedMediaEvents,
    useMediaStore: useTypedMediaStore,
  }
}

/**
 * Returns the raw Immer store API for direct state reads and mutations.
 * Use this in effects, callbacks, or when you need `getState()` / `setState()`
 * without subscribing to re-renders.
 *
 * For most components, prefer `useMediaStore` or per-feature hooks instead.
 *
 * ```ts
 * const api = useMediaApi()
 * api.getState().volume.level       // read without subscribing
 * api.setState(({ volume }) => {
 *   volume.level = 0.5
 * })
 * ```
 */
export function useMediaApi<TStore extends AnyMediaStore = AnyMediaStore>() {
  const { store } = useMediaRuntime()

  return store as unknown as ImmerStoreApi<TStore>
}

/**
 * Returns the event emitter for the current MediaProvider.
 * Features emit events; consumers subscribe via `on()` / `once()`.
 *
 * ```ts
 * const events = useMediaEvents<VolumeStore>()
 * useEffect(() => {
 *   return events.on(\"volumechange\", ({ volume }) => {
 *     console.log("Volume:", volume)
 *   })
 * }, [events])
 * ```
 */
export function useMediaEvents<
  TEvents extends AnyEvents = AnyEvents,
>(): MediaEvents<TEvents> {
  const { events } = useMediaRuntime()

  return events as unknown as MediaEvents<TEvents>
}

/**
 * Returns the Immer store API scoped to a specific feature slice.
 * Throws if the feature is not registered in `createMediaKit`.
 *
 * Primarily used inside `Setup` components and hooks that belong to a feature.
 *
 * ```ts
 * const store = useMediaFeatureApi<VolumeStore>("volume")
 * store.getState().volume.level
 * store.setState(({ volume }) => { volume.muted = true })
 * ```
 */
export function useMediaFeatureApi<TSlice extends MediaShape>(
  featureKey: string
): ImmerStoreApi<MediaStore & TSlice> {
  const { featureKeys, store } = useMediaRuntime()

  assertFeature(featureKey, featureKeys)

  return store as unknown as ImmerStoreApi<MediaStore & TSlice>
}

/**
 * Subscribes to a specific feature's state with a selector.
 * Throws if the feature is not registered. Only re-renders when the
 * selected value changes (compared via `Object.is`).
 *
 * Typically wrapped by per-feature convenience hooks like `useVolumeStore`.
 *
 * ```ts
 * const level = useMediaFeatureStore<VolumeStore, number>(
 *   "volume",
 *   (state) => state.volume.level
 * )
 * ```
 */
export function useMediaFeatureStore<TSlice extends MediaShape, TSelected>(
  featureKey: string,
  selector: (state: MediaStore & TSlice) => TSelected
): TSelected {
  const { featureKeys, store } = useMediaRuntime()

  assertFeature(featureKey, featureKeys)

  return useStore(store as StoreApi<MediaStore & TSlice>, selector)
}

function assertFeature(featureKey: string, featureKeys: Set<string>) {
  if (!featureKeys.has(featureKey)) {
    throw new Error(
      `Missing "${featureKey}" feature in MediaProvider. Add ${featureKey}Feature() to createMediaKit({ features }).`
    )
  }
}

function useMediaRuntime() {
  const context = React.useContext(MediaRuntimeContext)

  if (!context) {
    throw new Error("Missing MediaProvider in root")
  }

  return context
}
