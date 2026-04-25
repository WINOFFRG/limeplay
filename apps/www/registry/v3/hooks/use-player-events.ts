import type { StoreApi } from "zustand"

import type { TypeMediaStore } from "@/registry/v3/lib/create-media-store"

import { useGetStore } from "@/registry/v3/ui/media-provider"

export declare const playerEventMap: unique symbol

export type PlayerEventMap = object

export interface PlayerEvents<TEvents extends PlayerEventMap> {
  emit: <TName extends EventName<TEvents>>(
    name: TName,
    ...args: EventArgs<TEvents[TName]>
  ) => void
  on: <TName extends EventName<TEvents>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => () => void
  once: <TName extends EventName<TEvents>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) => () => void
}

export interface PlayerEventSlice<TEvents extends PlayerEventMap> {
  readonly [playerEventMap]?: TEvents
}

type AnyEventListener = (payload?: unknown) => void

type EventArgs<TPayload> = [TPayload] extends [void] ? [] : [payload: TPayload]

type EventListener<TPayload> = [TPayload] extends [void]
  ? () => void
  : (payload: TPayload) => void

type EventName<TEvents extends PlayerEventMap> = Extract<keyof TEvents, string>

type PlayerEventsFromStore<TStore> =
  TStore extends PlayerEventSlice<infer TEvents> ? TEvents : unknown

type TypePlayerEvents = PlayerEventsFromStore<TypeMediaStore>

class PlayerEventEmitter<
  TEvents extends PlayerEventMap,
> implements PlayerEvents<TEvents> {
  private listeners = new Map<string, Set<AnyEventListener>>()

  emit<TName extends EventName<TEvents>>(
    name: TName,
    ...args: EventArgs<TEvents[TName]>
  ) {
    const listeners = this.listeners.get(name)
    if (!listeners) return

    for (const listener of [...listeners]) {
      try {
        listener(args[0])
      } catch (err) {
        console.error(`[PlayerEvents] Error in "${name}" listener:`, err)
      }
    }
  }

  on<TName extends EventName<TEvents>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) {
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

  once<TName extends EventName<TEvents>>(
    name: TName,
    listener: EventListener<TEvents[TName]>
  ) {
    const off = this.on(name, ((...args: unknown[]) => {
      off()
      ;(listener as AnyEventListener)(...args)
    }) as EventListener<TEvents[TName]>)

    return off
  }
}

const playerEvents = new WeakMap<
  StoreApi<TypeMediaStore>,
  PlayerEvents<TypePlayerEvents>
>()

export function usePlayerEvents() {
  const store = useGetStore()
  return getPlayerEvents(store)
}

function getPlayerEvents(store: StoreApi<TypeMediaStore>) {
  const events = playerEvents.get(store)

  if (events) {
    return events
  }

  const nextEvents = new PlayerEventEmitter<TypePlayerEvents>()

  playerEvents.set(store, nextEvents)

  return nextEvents
}
