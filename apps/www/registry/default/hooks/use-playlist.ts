"use client"

import type { StateCreator } from "zustand"

import clamp from "lodash/clamp"
import pull from "lodash/pull"
import reject from "lodash/reject"
import shuffle from "lodash/shuffle"
import React from "react"

import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface PlaylistItem<T = Record<string, unknown>> {
  error?: Error | null
  id: string
  properties: T
  status: PlaylistItemStatus
}

export interface PlaylistItemInput<T = Record<string, unknown>> {
  id: string
  properties?: T
}

export type PlaylistItemStatus =
  | "error"
  | "idle"
  | "loading"
  | "played"
  | "playing"
  | "ready"
  | "skipped"

export interface PlaylistStore {
  currentIndex: number
  currentItem: null | PlaylistItem
  history: PlaylistItem[]
  onItemError?: (payload: { error: Error; item: PlaylistItem }) => void
  onItemLoad?: (payload: { index: number; item: PlaylistItem }) => void
  onPlaylistChange?: (payload: {
    currentIndex: number
    currentItem: null | PlaylistItem
  }) => void
  queue: PlaylistItem[]
  repeatMode: RepeatMode

  sessionId: string
  shuffle: boolean
  shuffleOrder: number[]
}

export type RepeatMode = "all" | "off" | "one"

function createShuffleOrder(length: number, excludeIndex?: number): number[] {
  const indices = Array.from({ length }, (_, i) => i)

  if (
    excludeIndex !== undefined &&
    excludeIndex >= 0 &&
    excludeIndex < length
  ) {
    const shuffledIndices = shuffle(pull([...indices], excludeIndex))
    return [excludeIndex, ...shuffledIndices]
  }

  return shuffle(indices)
}

function generateSessionId(): string {
  return `lp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function normalizeItems<T>(inputs: PlaylistItemInput<T>[]): PlaylistItem<T>[] {
  return inputs.map((input) => ({
    error: null,
    id: input.id,
    properties: input.properties ?? ({} as T),
    status: "idle" as const,
  }))
}

export const createPlaylistStore: StateCreator<
  PlaylistStore,
  [],
  [],
  PlaylistStore
> = () => ({
  currentIndex: -1,
  currentItem: null,
  history: [],
  onItemError: undefined,
  onItemLoad: undefined,
  onPlaylistChange: undefined,
  queue: [],
  repeatMode: "off",

  sessionId: generateSessionId(),
  shuffle: false,
  shuffleOrder: [],
})

/**
 * Options for usePlaylist hook
 */
export interface UsePlaylistOptions<T> {
  onError?: (item: PlaylistItem<T>, error: Error) => void
  onLoadItem: (item: PlaylistItem<T>) => Promise<void>
}

export interface UsePlaylistReturn<T> {
  append: (items: PlaylistItemInput<T>[]) => void
  clear: () => void
  cycleRepeatMode: () => void
  getCurrentItem: () => null | PlaylistItem<T>
  getItem: (id: string) => null | PlaylistItem<T>
  getNextItem: () => null | PlaylistItem<T>
  getPrevItem: () => null | PlaylistItem<T>
  hasNext: () => boolean
  insert: (items: PlaylistItemInput<T>[], atIndex: number) => void
  load: (items: PlaylistItemInput<T>[], startIndex?: number) => void
  newSession: () => string
  next: () => Promise<boolean>
  playNext: (items: PlaylistItemInput<T>[]) => void
  prepend: (items: PlaylistItemInput<T>[]) => void
  previous: () => Promise<boolean>
  remove: (id: string) => void
  removeAt: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setRepeatMode: (mode: RepeatMode) => void
  setShuffle: (enabled: boolean) => void
  skipTo: (index: number) => Promise<void>
  skipToId: (id: string) => Promise<void>
  toggleShuffle: () => void
}

/**
 * usePlaylist - Queue management with user-provided load callbacks
 */
export function usePlaylist<T>(
  options: UsePlaylistOptions<T>
): UsePlaylistReturn<T> {
  const store = useGetStore()
  const mediaRef = useMediaStore((s) => s.mediaRef)
  const { onError, onLoadItem } = options

  const updateItemStatus = React.useCallback(
    (itemId: string, status: PlaylistItemStatus, error?: Error) => {
      const { queue } = store.getState()
      const idx = queue.findIndex((q: PlaylistItem) => q.id === itemId)
      if (idx !== -1) {
        const updated = [...queue]
        updated[idx] = { ...updated[idx], error: error ?? null, status }
        store.setState({ queue: updated })
      }
    },
    [store]
  )

  const loadItem = React.useCallback(
    async (item: PlaylistItem<T>): Promise<boolean> => {
      updateItemStatus(item.id, "loading")

      try {
        await onLoadItem(item)
        updateItemStatus(item.id, "playing")

        const currentIndex = store
          .getState()
          .queue.findIndex((q) => q.id === item.id)
        store
          .getState()
          .onItemLoad?.({ index: currentIndex, item: item as PlaylistItem })

        return true
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        updateItemStatus(item.id, "error", err)

        store
          .getState()
          .onItemError?.({ error: err, item: item as PlaylistItem })

        onError?.(item, err)
        return false
      }
    },
    [onLoadItem, onError, updateItemStatus, store]
  )

  const getNextIndex = React.useCallback((): number => {
    const {
      currentIndex,
      queue,
      repeatMode,
      shuffle: isShuffleEnabled,
      shuffleOrder,
    } = store.getState()
    if (queue.length === 0) return -1
    if (repeatMode === "one") return currentIndex

    if (isShuffleEnabled && shuffleOrder.length > 0) {
      const currentPos = shuffleOrder.indexOf(currentIndex)
      const nextPos = currentPos + 1
      if (nextPos < shuffleOrder.length) return shuffleOrder[nextPos]
      if (repeatMode === "all") {
        const newOrder = createShuffleOrder(queue.length)
        store.setState({ shuffleOrder: newOrder })
        return newOrder[0]
      }
      return -1
    }

    const nextIndex = currentIndex + 1
    if (nextIndex < queue.length) return nextIndex
    if (repeatMode === "all") return 0
    return -1
  }, [store])

  const getPreviousIndex = React.useCallback((): number => {
    const {
      currentIndex,
      history,
      queue,
      shuffle: isShuffleEnabled,
      shuffleOrder,
    } = store.getState()
    if (queue.length === 0) return -1

    if (mediaRef.current && mediaRef.current.currentTime > 3) {
      return currentIndex
    }

    if (history.length > 0) {
      const lastItem = history[history.length - 1]
      const idx = queue.findIndex((q: PlaylistItem) => q.id === lastItem.id)
      if (idx !== -1) return idx
    }

    if (isShuffleEnabled && shuffleOrder.length > 0) {
      const currentPos = shuffleOrder.indexOf(currentIndex)
      if (currentPos > 0) return shuffleOrder[currentPos - 1]
      return currentIndex
    }

    return currentIndex > 0 ? currentIndex - 1 : currentIndex
  }, [store, mediaRef])

  const next = React.useCallback(async (): Promise<boolean> => {
    const { currentItem, history, queue } = store.getState()
    const nextIndex = getNextIndex()
    if (nextIndex === -1 || nextIndex >= queue.length) return false

    if (currentItem) {
      store.setState({ history: [...history, currentItem] })
    }

    const nextItem = queue[nextIndex] as PlaylistItem<T>
    store.setState({
      currentIndex: nextIndex,
      currentItem: nextItem as PlaylistItem,
    })

    store.getState().onPlaylistChange?.({
      currentIndex: nextIndex,
      currentItem: nextItem as PlaylistItem,
    })

    return loadItem(nextItem)
  }, [store, getNextIndex, loadItem])

  const previous = React.useCallback(async (): Promise<boolean> => {
    const { currentIndex, history, queue } = store.getState()
    const prevIndex = getPreviousIndex()
    if (prevIndex === -1 || prevIndex >= queue.length) return false

    const prevItem = queue[prevIndex] as PlaylistItem<T>

    if (prevIndex === currentIndex && mediaRef.current) {
      mediaRef.current.currentTime = 0
      return true
    }

    if (history.length > 0) {
      store.setState({ history: history.slice(0, -1) })
    }

    store.setState({
      currentIndex: prevIndex,
      currentItem: prevItem as PlaylistItem,
    })
    return loadItem(prevItem)
  }, [store, getPreviousIndex, loadItem, mediaRef])

  const skipTo = React.useCallback(
    async (index: number): Promise<void> => {
      const { currentItem, history, queue } = store.getState()
      if (index < 0 || index >= queue.length) return

      if (currentItem) {
        updateItemStatus(currentItem.id, "skipped")
        store.setState({ history: [...history, currentItem] })
      }

      const item = queue[index] as PlaylistItem<T>
      store.setState({ currentIndex: index, currentItem: item as PlaylistItem })
      await loadItem(item)
    },
    [store, loadItem, updateItemStatus]
  )

  const skipToId = React.useCallback(
    async (id: string): Promise<void> => {
      const { queue } = store.getState()
      const index = queue.findIndex((item: PlaylistItem) => item.id === id)
      if (index !== -1) await skipTo(index)
    },
    [store, skipTo]
  )

  const load = React.useCallback(
    (items: PlaylistItemInput<T>[], startIndex = 0): void => {
      const normalized = normalizeItems(items)
      const { shuffle: isShuffleEnabled } = store.getState()
      const shuffleOrder = isShuffleEnabled
        ? createShuffleOrder(normalized.length, startIndex)
        : []

      store.setState({
        currentIndex: -1,
        currentItem: null,
        history: [],
        queue: normalized as PlaylistItem[],
        sessionId: generateSessionId(),
        shuffleOrder,
      })

      if (normalized.length > 0 && startIndex < normalized.length) {
        const startItem = normalized[startIndex] as PlaylistItem<T>
        store.setState({
          currentIndex: startIndex,
          currentItem: startItem as PlaylistItem,
        })
        void loadItem(startItem)
      }
    },
    [store, loadItem]
  )

  const append = React.useCallback(
    (items: PlaylistItemInput<T>[]): void => {
      const {
        queue,
        shuffle: isShuffleEnabled,
        shuffleOrder,
      } = store.getState()
      const normalized = normalizeItems(items)
      const newQueue = [...queue, ...normalized]

      let newShuffleOrder = shuffleOrder
      if (isShuffleEnabled) {
        const newIndices = Array.from(
          { length: normalized.length },
          (_, i) => queue.length + i
        )
        newShuffleOrder = [...shuffleOrder, ...shuffle(newIndices)]
      }

      store.setState({
        queue: newQueue as PlaylistItem[],
        shuffleOrder: newShuffleOrder,
      })
    },
    [store]
  )

  const prepend = React.useCallback(
    (items: PlaylistItemInput<T>[]): void => {
      const {
        currentIndex,
        queue,
        shuffle: isShuffleEnabled,
        shuffleOrder,
      } = store.getState()
      const normalized = normalizeItems(items)
      const newQueue = [...normalized, ...queue]
      const newCurrentIndex =
        currentIndex >= 0 ? currentIndex + normalized.length : currentIndex

      let newShuffleOrder = shuffleOrder.map(
        (idx: number) => idx + normalized.length
      )

      if (isShuffleEnabled) {
        const newIndices = Array.from(
          { length: normalized.length },
          (_, i) => i
        )
        const pos = shuffleOrder.indexOf(currentIndex)
        newShuffleOrder = [
          ...newShuffleOrder.slice(0, pos + 1),
          ...shuffle(newIndices),
          ...newShuffleOrder.slice(pos + 1),
        ]
      }

      store.setState({
        currentIndex: newCurrentIndex,
        queue: newQueue as PlaylistItem[],
        shuffleOrder: newShuffleOrder,
      })
    },
    [store]
  )

  const insert = React.useCallback(
    (items: PlaylistItemInput<T>[], atIndex: number): void => {
      const { currentIndex, queue } = store.getState()
      const normalized = normalizeItems(items)
      const idx = clamp(atIndex, 0, queue.length)
      const newQueue = [
        ...queue.slice(0, idx),
        ...normalized,
        ...queue.slice(idx),
      ]
      const newCurrentIndex =
        currentIndex >= idx ? currentIndex + normalized.length : currentIndex

      store.setState({
        currentIndex: newCurrentIndex,
        queue: newQueue as PlaylistItem[],
      })
    },
    [store]
  )

  const playNext = React.useCallback(
    (items: PlaylistItemInput<T>[]): void => {
      const { currentIndex } = store.getState()
      insert(items, currentIndex + 1)
    },
    [store, insert]
  )

  const remove = React.useCallback(
    (id: string): void => {
      const { currentIndex, currentItem, queue } = store.getState()
      const removeIndex = queue.findIndex(
        (item: PlaylistItem) => item.id === id
      )
      if (removeIndex === -1) return

      const newQueue = reject(queue, { id }) as PlaylistItem[]
      let newCurrentIndex = currentIndex
      let newCurrentItem = currentItem

      if (removeIndex < currentIndex) {
        newCurrentIndex = currentIndex - 1
      } else if (removeIndex === currentIndex) {
        newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
        newCurrentItem = newQueue[newCurrentIndex] ?? null
      }

      store.setState({
        currentIndex: newCurrentIndex,
        currentItem: newCurrentItem,
        queue: newQueue,
      })
    },
    [store]
  )

  const removeAt = React.useCallback(
    (index: number): void => {
      const { queue } = store.getState()
      if (index >= 0 && index < queue.length) {
        remove(queue[index].id)
      }
    },
    [store, remove]
  )

  const reorder = React.useCallback(
    (fromIndex: number, toIndex: number): void => {
      const { currentIndex, queue } = store.getState()
      if (
        fromIndex < 0 ||
        fromIndex >= queue.length ||
        toIndex < 0 ||
        toIndex >= queue.length
      )
        return

      const newQueue = [...queue]
      const [removed] = newQueue.splice(fromIndex, 1)
      newQueue.splice(toIndex, 0, removed)

      let newCurrentIndex = currentIndex
      if (fromIndex === currentIndex) {
        newCurrentIndex = toIndex
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        newCurrentIndex = currentIndex - 1
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        newCurrentIndex = currentIndex + 1
      }

      store.setState({ currentIndex: newCurrentIndex, queue: newQueue })
    },
    [store]
  )

  const clear = React.useCallback((): void => {
    store.setState({
      currentIndex: -1,
      currentItem: null,
      history: [],
      queue: [],
      shuffleOrder: [],
    })
  }, [store])

  const toggleShuffle = React.useCallback((): void => {
    const { currentIndex, queue, shuffle: isShuffleOn } = store.getState()
    const newShuffle = !isShuffleOn
    const shuffleOrder =
      newShuffle && queue.length > 0
        ? createShuffleOrder(queue.length, currentIndex)
        : []
    store.setState({ shuffle: newShuffle, shuffleOrder })
  }, [store])

  const setShuffle = React.useCallback(
    (enabled: boolean): void => {
      const { currentIndex, queue, shuffle: current } = store.getState()
      if (current === enabled) return
      const shuffleOrder =
        enabled && queue.length > 0
          ? createShuffleOrder(queue.length, currentIndex)
          : []
      store.setState({ shuffle: enabled, shuffleOrder })
    },
    [store]
  )

  const setRepeatMode = React.useCallback(
    (mode: RepeatMode): void => {
      store.setState({ repeatMode: mode })
    },
    [store]
  )

  const cycleRepeatMode = React.useCallback((): void => {
    const { repeatMode } = store.getState()
    const modes: RepeatMode[] = ["off", "all", "one"]
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length]
    store.setState({ repeatMode: nextMode })
  }, [store])

  /**
   * Get the next item without navigating
   */
  const getNextItem = React.useCallback((): null | PlaylistItem<T> => {
    const nextIndex = getNextIndex()
    const { queue } = store.getState()
    if (nextIndex >= 0 && nextIndex < queue.length) {
      return queue[nextIndex] as PlaylistItem<T>
    }
    return null
  }, [getNextIndex, store])

  /**
   * Get the previous item without navigating
   */
  const getPrevItem = React.useCallback((): null | PlaylistItem<T> => {
    const prevIndex = getPreviousIndex()
    const { queue } = store.getState()
    if (prevIndex >= 0 && prevIndex < queue.length) {
      return queue[prevIndex] as PlaylistItem<T>
    }
    return null
  }, [getPreviousIndex, store])

  /**
   * Get item by id
   */
  const getItem = React.useCallback(
    (id: string): null | PlaylistItem<T> => {
      const { queue } = store.getState()
      const item = queue.find((q: PlaylistItem) => q.id === id)
      return item ? (item as PlaylistItem<T>) : null
    },
    [store]
  )

  /**
   * Get the currently active item
   */
  const getCurrentItem = React.useCallback((): null | PlaylistItem<T> => {
    const { currentItem } = store.getState()
    return currentItem ? (currentItem as PlaylistItem<T>) : null
  }, [store])

  const newSession = React.useCallback((): string => {
    const sessionId = generateSessionId()
    store.setState({ sessionId })
    return sessionId
  }, [store])

  /**
   * Has next item in queue
   */
  const hasNext = React.useCallback((): boolean => {
    const { currentIndex, queue, repeatMode } = store.getState()
    if (repeatMode === "all" && queue.length > 0) {
      return true
    }
    return currentIndex >= 0 && currentIndex < queue.length - 1
  }, [store])

  return {
    append,
    clear,
    cycleRepeatMode,
    getCurrentItem,
    getItem,
    getNextItem,
    getPrevItem,
    hasNext,
    insert,
    load,
    newSession,
    next,
    playNext,
    prepend,
    previous,
    remove,
    removeAt,
    reorder,
    setRepeatMode,
    setShuffle,
    skipTo,
    skipToId,
    toggleShuffle,
  }
}

export function usePlaylistStates() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)

  React.useEffect(() => {
    if (!mediaRef.current) return noop

    const media = mediaRef.current

    if (media.loop) {
      console.warn(
        "[use-playlist] Media is in loop mode, some features may not work as expected"
      )
    }

    const endedHandler = () => {
      const { currentIndex, currentItem, queue, repeatMode } = store.getState()

      if (currentItem && currentIndex >= 0 && currentIndex < queue.length) {
        const updatedQueue = [...queue]

        updatedQueue[currentIndex] = {
          ...updatedQueue[currentIndex],
          status: "played",
        }
        store.setState({ queue: updatedQueue })
      }

      if (repeatMode === "one") {
        if (!media.loop) {
          media.loop = true
        }
      } else {
        if (media.loop) {
          media.loop = false
        }
      }
    }

    on(media, "ended", endedHandler)
    return () => off(media, "ended", endedHandler)
  }, [mediaRef, store])
}
