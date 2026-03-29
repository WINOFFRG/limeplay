"use client"

import type { StateCreator } from "zustand"

import clamp from "lodash/clamp"
import pull from "lodash/pull"
import reject from "lodash/reject"
import shuffle from "lodash/shuffle"
import React from "react"

import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

/**
 * Event payload when the playlist cursor changes.
 */
export interface PlaylistChangeEvent<T = Record<string, unknown>> {
  currentIndex: number
  currentItem: null | PlaylistItem<T>
  previousIndex: number
  previousItem: null | PlaylistItem<T>
  reason: "load" | "next" | "previous" | "remove" | "skip"
}

/**
 * A playlist item is just an ID + user-defined properties.
 * No status, no error — those are playback concerns.
 */
export interface PlaylistItem<T = Record<string, unknown>> {
  id: string
  properties: T
}

export interface PlaylistItemInput<T = Record<string, unknown>> {
  id: string
  properties?: T
}

export interface PlaylistStore {
  currentIndex: number
  currentItem: null | PlaylistItem
  history: PlaylistItem[]
  onPlaylistChange?: (event: PlaylistChangeEvent) => void
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

function getRepeatModes(queueLength: number): RepeatMode[] {
  if (queueLength <= 1) {
    return ["off", "one"]
  }

  return ["off", "all", "one"]
}

function normalizeItems<T>(inputs: PlaylistItemInput<T>[]): PlaylistItem<T>[] {
  return inputs.map((input) => ({
    id: input.id,
    properties: input.properties ?? ({} as T),
  }))
}

function normalizeRepeatMode(
  mode: RepeatMode,
  queueLength: number
): RepeatMode {
  if (queueLength <= 1 && mode === "all") {
    return "one"
  }

  return mode
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
  onPlaylistChange: undefined,
  queue: [],
  repeatMode: "off",

  sessionId: generateSessionId(),
  shuffle: false,
  shuffleOrder: [],
})

export interface UsePlaylistReturn<T> {
  append: (items: PlaylistItemInput<T>[]) => void
  clear: () => void
  currentIndex: number
  currentItem: null | PlaylistItem<T>
  cycleRepeatMode: () => void
  getItem: (id: string) => null | PlaylistItem<T>
  hasNext: boolean
  hasPrevious: boolean
  insert: (items: PlaylistItemInput<T>[], atIndex: number) => void
  load: (items: PlaylistItemInput<T>[], startIndex?: number) => void
  newSession: () => string
  next: () => boolean
  nextItem: null | PlaylistItem<T>
  orderedItems: PlaylistItem<T>[]
  playNext: (items: PlaylistItemInput<T>[]) => void
  prepend: (items: PlaylistItemInput<T>[]) => void
  previous: () => boolean
  previousItem: null | PlaylistItem<T>
  remove: (id: string) => void
  removeAt: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setRepeatMode: (mode: RepeatMode) => void
  setShuffle: (enabled: boolean) => void
  skipTo: (index: number) => boolean
  skipToId: (id: string) => boolean
  toggleShuffle: () => void
}

/**
 * usePlaylist — Pure queue management, zero media awareness.
 * Navigation methods are synchronous — they move the cursor and fire onPlaylistChange.
 * The composition layer (use-asset) reacts to cursor changes and orchestrates loading.
 */
export function usePlaylist<T>(): UsePlaylistReturn<T> {
  const store = useGetStore()
  const currentIndex = useMediaStore((s) => s.currentIndex)
  const history = useMediaStore((s) => s.history)
  const queue = useMediaStore((s) => s.queue)
  const repeatMode = useMediaStore((s) => s.repeatMode)
  const shuffleEnabled = useMediaStore((s) => s.shuffle)
  const shuffleOrder = useMediaStore((s) => s.shuffleOrder)

  const emitChange = React.useCallback(
    (
      nextIndex: number,
      nextItem: null | PlaylistItem,
      previousIndex: number,
      previousItem: null | PlaylistItem,
      reason: PlaylistChangeEvent["reason"]
    ) => {
      store.getState().onPlaylistChange?.({
        currentIndex: nextIndex,
        currentItem: nextItem,
        previousIndex,
        previousItem,
        reason,
      })
    },
    [store]
  )

  const getNextIndex = React.useCallback((): number => {
    if (queue.length === 0) return -1

    if (shuffleEnabled && shuffleOrder.length > 0) {
      const currentPos = shuffleOrder.indexOf(currentIndex)
      const nextPos = currentPos + 1
      if (nextPos < shuffleOrder.length) return shuffleOrder[nextPos]
      if (repeatMode === "all") {
        return createShuffleOrder(queue.length)[0]
      }
      return -1
    }

    const nextIndex = currentIndex + 1
    if (nextIndex < queue.length) return nextIndex
    if (repeatMode === "all") return 0
    return -1
  }, [currentIndex, queue.length, repeatMode, shuffleEnabled, shuffleOrder])

  const getPreviousIndex = React.useCallback((): number => {
    if (queue.length === 0) return -1

    if (history.length > 0) {
      const lastItem = history[history.length - 1]
      const idx = queue.findIndex((q: PlaylistItem) => q.id === lastItem.id)
      if (idx !== -1) return idx
    }

    if (shuffleEnabled && shuffleOrder.length > 0) {
      const currentPos = shuffleOrder.indexOf(currentIndex)
      if (currentPos > 0) return shuffleOrder[currentPos - 1]
      return currentIndex
    }

    return currentIndex > 0 ? currentIndex - 1 : currentIndex
  }, [currentIndex, history, queue, shuffleEnabled, shuffleOrder])

  const next = React.useCallback((): boolean => {
    const {
      currentIndex: prevIndex,
      currentItem: prevItem,
      history,
      queue,
    } = store.getState()
    const nextIndex = getNextIndex()
    if (nextIndex === -1 || nextIndex >= queue.length) return false

    if (prevItem) {
      store.setState({ history: [...history, prevItem] })
    }

    const nextItem = queue[nextIndex] as PlaylistItem
    store.setState({
      currentIndex: nextIndex,
      currentItem: nextItem,
    })

    emitChange(nextIndex, nextItem, prevIndex, prevItem, "next")
    return true
  }, [store, getNextIndex, emitChange])

  const previous = React.useCallback((): boolean => {
    const {
      currentIndex: prevIndex,
      currentItem: prevItem,
      history,
      queue,
    } = store.getState()
    const prevItemIndex = getPreviousIndex()
    if (prevItemIndex === -1 || prevItemIndex >= queue.length) return false

    const targetItem = queue[prevItemIndex] as PlaylistItem

    if (history.length > 0) {
      store.setState({ history: history.slice(0, -1) })
    }

    store.setState({
      currentIndex: prevItemIndex,
      currentItem: targetItem,
    })

    emitChange(prevItemIndex, targetItem, prevIndex, prevItem, "previous")
    return true
  }, [store, getPreviousIndex, emitChange])

  const skipTo = React.useCallback(
    (index: number): boolean => {
      const {
        currentIndex: prevIndex,
        currentItem: prevItem,
        history,
        queue,
      } = store.getState()
      if (index < 0 || index >= queue.length) return false

      if (prevItem) {
        store.setState({ history: [...history, prevItem] })
      }

      const item = queue[index] as PlaylistItem
      store.setState({ currentIndex: index, currentItem: item })

      emitChange(index, item, prevIndex, prevItem, "skip")
      return true
    },
    [store, emitChange]
  )

  const skipToId = React.useCallback(
    (id: string): boolean => {
      const { queue } = store.getState()
      const index = queue.findIndex((item: PlaylistItem) => item.id === id)
      if (index === -1) return false
      return skipTo(index)
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
        const startItem = normalized[startIndex] as PlaylistItem
        store.setState({
          currentIndex: startIndex,
          currentItem: startItem,
        })

        emitChange(startIndex, startItem, -1, null, "load")
      }
    },
    [store, emitChange]
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
      const {
        currentIndex,
        queue,
        shuffle: isShuffleEnabled,
        shuffleOrder,
      } = store.getState()
      const normalized = normalizeItems(items)
      const idx = clamp(atIndex, 0, queue.length)
      const newQueue = [
        ...queue.slice(0, idx),
        ...normalized,
        ...queue.slice(idx),
      ]
      const newCurrentIndex =
        currentIndex >= idx ? currentIndex + normalized.length : currentIndex

      let newShuffleOrder = shuffleOrder
      if (isShuffleEnabled) {
        // Shift existing indices >= idx up by the number of inserted items
        newShuffleOrder = shuffleOrder.map((i: number) =>
          i >= idx ? i + normalized.length : i
        )
        // Add new shuffled indices for the inserted items
        const newIndices = Array.from(
          { length: normalized.length },
          (_, i) => idx + i
        )
        const currentPos = newShuffleOrder.indexOf(newCurrentIndex)
        newShuffleOrder = [
          ...newShuffleOrder.slice(0, currentPos + 1),
          ...shuffle(newIndices),
          ...newShuffleOrder.slice(currentPos + 1),
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

  const playNext = React.useCallback(
    (items: PlaylistItemInput<T>[]): void => {
      const { currentIndex } = store.getState()
      insert(items, currentIndex + 1)
    },
    [store, insert]
  )

  const remove = React.useCallback(
    (id: string): void => {
      const {
        currentIndex,
        currentItem,
        queue,
        shuffle: isShuffleEnabled,
        shuffleOrder,
      } = store.getState()
      const removeIndex = queue.findIndex(
        (item: PlaylistItem) => item.id === id
      )
      if (removeIndex === -1) return

      const newQueue = reject(queue, { id }) as PlaylistItem[]
      let newCurrentIndex = currentIndex
      let newCurrentItem = currentItem

      // Rebase shuffleOrder: remove the deleted index and shift those above it
      let newShuffleOrder = shuffleOrder
      if (isShuffleEnabled) {
        newShuffleOrder = shuffleOrder
          .filter((i: number) => i !== removeIndex)
          .map((i: number) => (i > removeIndex ? i - 1 : i))
      }

      if (removeIndex < currentIndex) {
        newCurrentIndex = currentIndex - 1
      } else if (removeIndex === currentIndex) {
        newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
        newCurrentItem = newQueue[newCurrentIndex] ?? null

        store.setState({
          currentIndex: newCurrentIndex,
          currentItem: newCurrentItem,
          queue: newQueue,
          shuffleOrder: newShuffleOrder,
        })

        emitChange(
          newCurrentIndex,
          newCurrentItem,
          currentIndex,
          currentItem,
          "remove"
        )
        return
      }

      store.setState({
        currentIndex: newCurrentIndex,
        currentItem: newCurrentItem,
        queue: newQueue,
        shuffleOrder: newShuffleOrder,
      })
    },
    [store, emitChange]
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
      const {
        currentIndex,
        queue,
        shuffle: isShuffleEnabled,
        shuffleOrder,
      } = store.getState()
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

      // Remap shuffleOrder to reflect the splice-based reorder
      let newShuffleOrder = shuffleOrder
      if (isShuffleEnabled) {
        newShuffleOrder = shuffleOrder.map((i: number) => {
          if (i === fromIndex) return toIndex
          if (fromIndex < toIndex) {
            // Item moved forward: indices in (fromIndex, toIndex] shift down by 1
            if (i > fromIndex && i <= toIndex) return i - 1
          } else {
            // Item moved backward: indices in [toIndex, fromIndex) shift up by 1
            if (i >= toIndex && i < fromIndex) return i + 1
          }
          return i
        })
      }

      store.setState({
        currentIndex: newCurrentIndex,
        queue: newQueue,
        shuffleOrder: newShuffleOrder,
      })
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
      const queueLength = store.getState().queue.length
      const nextMode = normalizeRepeatMode(mode, queueLength)
      store.setState({ repeatMode: nextMode })
    },
    [store]
  )

  const cycleRepeatMode = React.useCallback((): void => {
    const { queue, repeatMode } = store.getState()
    const modes = getRepeatModes(queue.length)
    const currentMode = normalizeRepeatMode(repeatMode, queue.length)
    const modeIndex = modes.indexOf(currentMode)
    const nextMode = modes[(modeIndex + 1) % modes.length]
    store.setState({ repeatMode: nextMode })
  }, [store])

  React.useEffect(() => {
    if (queue.length <= 1 && repeatMode === "all") {
      store.setState({ repeatMode: "one" })
    }
  }, [queue.length, repeatMode, store])

  /**
   * Get the next item without navigating
   */
  const nextItem = React.useMemo((): null | PlaylistItem<T> => {
    const nextIndex = getNextIndex()
    if (nextIndex >= 0 && nextIndex < queue.length) {
      return queue[nextIndex] as PlaylistItem<T>
    }
    return null
  }, [getNextIndex, queue])

  /**
   * Get the previous item without navigating
   */
  const previousItem = React.useMemo((): null | PlaylistItem<T> => {
    const prevIndex = getPreviousIndex()
    if (prevIndex >= 0 && prevIndex < queue.length) {
      return queue[prevIndex] as PlaylistItem<T>
    }
    return null
  }, [getPreviousIndex, queue])

  const orderedItems = React.useMemo((): PlaylistItem<T>[] => {
    const typedQueue = queue as unknown as PlaylistItem<T>[]

    if (!shuffleEnabled || shuffleOrder.length === 0) {
      return typedQueue
    }

    return shuffleOrder.map((index) => typedQueue[index])
  }, [queue, shuffleEnabled, shuffleOrder])

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
  const currentItem = React.useMemo((): null | PlaylistItem<T> => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      return queue[currentIndex] as PlaylistItem<T>
    }
    return null
  }, [currentIndex, queue])

  const newSession = React.useCallback((): string => {
    const sessionId = generateSessionId()
    store.setState({ sessionId })
    return sessionId
  }, [store])

  /**
   * Has next item in queue
   */
  const hasNext = React.useMemo((): boolean => {
    if (repeatMode === "all" && queue.length > 0) {
      return true
    }
    return getNextIndex() !== -1
  }, [repeatMode, queue.length, getNextIndex])

  const hasPrevious = React.useMemo((): boolean => {
    if (repeatMode === "all" && queue.length > 0) {
      return true
    }
    return getPreviousIndex() !== -1
  }, [repeatMode, queue.length, getPreviousIndex])

  return {
    append,
    clear,
    currentIndex,
    currentItem,
    cycleRepeatMode,
    getItem,
    hasNext,
    hasPrevious,
    insert,
    load,
    newSession,
    next,
    nextItem,
    orderedItems,
    playNext,
    prepend,
    previous,
    previousItem,
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
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const repeatMode = useMediaStore((state) => state.repeatMode)

  React.useEffect(() => {
    if (!mediaRef.current) return

    mediaRef.current.loop = repeatMode === "one"
  }, [mediaRef, repeatMode])
}
