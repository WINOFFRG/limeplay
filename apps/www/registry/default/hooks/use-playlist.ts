"use client"

import clamp from "lodash/clamp"
import pull from "lodash/pull"
import reject from "lodash/reject"
import shuffle from "lodash/shuffle"
import React from "react"
import { useShallow } from "zustand/react/shallow"

import type {
  MediaEventSlice,
  MediaFeature,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export interface PlaylistChangeEvent<T = Record<string, unknown>> {
  currentIndex: number
  currentItem: null | PlaylistItem<T>
  previousIndex: number
  previousItem: null | PlaylistItem<T>
  reason: "load" | "next" | "previous" | "remove" | "skip"
}

export interface PlaylistItem<T = Record<string, unknown>> {
  id: string
  properties: T
}

export interface PlaylistItemInput<T = Record<string, unknown>> {
  id: string
  properties?: T
}

export type RepeatMode = "all" | "off" | "one"

export const PLAYLIST_FEATURE_KEY = "playlist"

export interface PlaylistEvents {
  playlistchange: PlaylistChangeEvent
}

export interface PlaylistStore extends MediaEventSlice<PlaylistEvents> {
  [PLAYLIST_FEATURE_KEY]: {
    append: <T>(items: PlaylistItemInput<T>[]) => void
    clear: () => void
    currentIndex: number
    currentItem: null | PlaylistItem
    cycleRepeatMode: () => void
    getItem: <T>(id: string) => null | PlaylistItem<T>
    getNextIndex: () => number
    getPreviousIndex: () => number
    history: PlaylistItem[]
    insert: <T>(items: PlaylistItemInput<T>[], atIndex: number) => void
    load: <T>(items: PlaylistItemInput<T>[], startIndex?: number) => void
    newSession: () => string
    next: () => boolean
    playNext: <T>(items: PlaylistItemInput<T>[]) => void
    prepend: <T>(items: PlaylistItemInput<T>[]) => void
    queue: PlaylistItem[]
    remove: (id: string) => void
    removeAt: (index: number) => void
    reorder: (fromIndex: number, toIndex: number) => void
    repeatMode: RepeatMode
    sessionId: string
    setRepeatMode: (mode: RepeatMode) => void
    setShuffle: (enabled: boolean) => void
    shuffle: boolean
    shuffleOrder: number[]
    skipTo: (index: number) => boolean
    skipToId: (id: string) => boolean
    toggleShuffle: () => void
  }
}

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

export function playlistFeature(): MediaFeature<PlaylistStore> {
  return {
    createSlice: (set, get, _store, events) => ({
      [PLAYLIST_FEATURE_KEY]: {
        append: (items) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const normalized = normalizeItems(items)
          const newQueue = [...playlist.queue, ...normalized]

          let newShuffleOrder = playlist.shuffleOrder
          if (playlist.shuffle) {
            const newIndices = Array.from(
              { length: normalized.length },
              (_, i) => playlist.queue.length + i
            )
            newShuffleOrder = [...playlist.shuffleOrder, ...shuffle(newIndices)]
          }

          set(({ playlist }) => {
            playlist.queue = newQueue as PlaylistItem[]
            playlist.shuffleOrder = newShuffleOrder
          })
        },
        clear: () => {
          set(({ playlist }) => {
            playlist.currentIndex = -1
            playlist.currentItem = null
            playlist.history = []
            playlist.queue = []
            playlist.shuffleOrder = []
          })
        },
        currentIndex: -1,
        currentItem: null,
        cycleRepeatMode: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const modes = getRepeatModes(playlist.queue.length)
          const currentMode = normalizeRepeatMode(
            playlist.repeatMode,
            playlist.queue.length
          )
          const modeIndex = modes.indexOf(currentMode)
          const nextMode = modes[(modeIndex + 1) % modes.length]

          set(({ playlist }) => {
            playlist.repeatMode = nextMode
          })
        },
        getItem: <T>(id: string) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const item = playlist.queue.find((entry) => entry.id === id)
          return (item as PlaylistItem<T> | undefined) ?? null
        },
        getNextIndex: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]

          if (playlist.queue.length === 0) return -1

          if (playlist.repeatMode === "one") return playlist.currentIndex

          if (playlist.shuffle && playlist.shuffleOrder.length > 0) {
            const currentPos = playlist.shuffleOrder.indexOf(
              playlist.currentIndex
            )
            const nextPos = currentPos + 1
            if (nextPos < playlist.shuffleOrder.length) {
              return playlist.shuffleOrder[nextPos]
            }
            if (playlist.repeatMode === "all") {
              return playlist.shuffleOrder[0]
            }
            return -1
          }

          const nextIndex = playlist.currentIndex + 1
          if (nextIndex < playlist.queue.length) return nextIndex
          if (playlist.repeatMode === "all") return 0
          return -1
        },
        getPreviousIndex: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]

          if (playlist.queue.length === 0) return -1

          if (playlist.repeatMode === "one") return playlist.currentIndex

          if (playlist.history.length > 0) {
            const lastItem = playlist.history[playlist.history.length - 1]
            const idx = playlist.queue.findIndex(
              (entry) => entry.id === lastItem.id
            )
            if (idx !== -1) return idx
          }

          if (playlist.shuffle && playlist.shuffleOrder.length > 0) {
            const currentPos = playlist.shuffleOrder.indexOf(
              playlist.currentIndex
            )
            if (currentPos > 0) return playlist.shuffleOrder[currentPos - 1]
            return playlist.currentIndex
          }

          return playlist.currentIndex > 0
            ? playlist.currentIndex - 1
            : playlist.currentIndex
        },
        history: [],
        insert: (items, atIndex) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const normalized = normalizeItems(items)
          const idx = clamp(atIndex, 0, playlist.queue.length)
          const newQueue = [
            ...playlist.queue.slice(0, idx),
            ...normalized,
            ...playlist.queue.slice(idx),
          ]
          const newCurrentIndex =
            playlist.currentIndex >= idx
              ? playlist.currentIndex + normalized.length
              : playlist.currentIndex

          let newShuffleOrder = playlist.shuffleOrder
          if (playlist.shuffle) {
            newShuffleOrder = playlist.shuffleOrder.map((i) =>
              i >= idx ? i + normalized.length : i
            )
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

          set(({ playlist }) => {
            playlist.currentIndex = newCurrentIndex
            playlist.queue = newQueue as PlaylistItem[]
            playlist.shuffleOrder = newShuffleOrder
          })
        },
        load: (items, startIndex = 0) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const normalized = normalizeItems(items)
          const shuffleOrder = playlist.shuffle
            ? createShuffleOrder(normalized.length, startIndex)
            : []

          set(({ playlist }) => {
            playlist.currentIndex = -1
            playlist.currentItem = null
            playlist.history = []
            playlist.queue = normalized as PlaylistItem[]
            playlist.sessionId = generateSessionId()
            playlist.shuffleOrder = shuffleOrder
          })

          if (normalized.length > 0 && startIndex < normalized.length) {
            const startItem = normalized[startIndex] as PlaylistItem

            set(({ playlist }) => {
              playlist.currentIndex = startIndex
              playlist.currentItem = startItem
            })

            emitPlaylistChange(
              events.emit,
              startIndex,
              startItem,
              -1,
              null,
              "load"
            )
          }
        },
        newSession: () => {
          const sessionId = generateSessionId()
          set(({ playlist }) => {
            playlist.sessionId = sessionId
          })
          return sessionId
        },
        next: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const nextIndex = playlist.getNextIndex()
          if (nextIndex === -1 || nextIndex >= playlist.queue.length)
            return false

          // When shuffle+repeatMode=all and we're at the end of the current order,
          // generate and persist a new shuffle order for the next cycle
          if (
            playlist.shuffle &&
            playlist.shuffleOrder.length > 0 &&
            playlist.repeatMode === "all"
          ) {
            const currentPos = playlist.shuffleOrder.indexOf(
              playlist.currentIndex
            )
            if (currentPos === playlist.shuffleOrder.length - 1) {
              const newShuffleOrder = createShuffleOrder(playlist.queue.length)
              set(({ playlist: p }) => {
                p.shuffleOrder = newShuffleOrder
              })
            }
          }

          if (playlist.currentItem) {
            set(({ playlist: p }) => {
              p.history = [...playlist.history, playlist.currentItem!]
            })
          }

          const nextItem = playlist.queue[nextIndex] as PlaylistItem

          set(({ playlist: p }) => {
            p.currentIndex = nextIndex
            p.currentItem = nextItem
          })

          emitPlaylistChange(
            events.emit,
            nextIndex,
            nextItem,
            playlist.currentIndex,
            playlist.currentItem,
            "next"
          )
          return true
        },
        playNext: (items) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          playlist.insert(items, playlist.currentIndex + 1)
        },
        prepend: (items) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const normalized = normalizeItems(items)
          const newQueue = [...normalized, ...playlist.queue]
          const newCurrentIndex =
            playlist.currentIndex >= 0
              ? playlist.currentIndex + normalized.length
              : playlist.currentIndex

          let newShuffleOrder = playlist.shuffleOrder.map(
            (idx) => idx + normalized.length
          )

          if (playlist.shuffle) {
            const newIndices = Array.from(
              { length: normalized.length },
              (_, i) => i
            )
            const pos = playlist.shuffleOrder.indexOf(playlist.currentIndex)
            newShuffleOrder = [
              ...newShuffleOrder.slice(0, pos + 1),
              ...shuffle(newIndices),
              ...newShuffleOrder.slice(pos + 1),
            ]
          }

          set(({ playlist: p }) => {
            p.currentIndex = newCurrentIndex
            p.queue = newQueue as PlaylistItem[]
            p.shuffleOrder = newShuffleOrder
          })
        },
        queue: [],
        remove: (id) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const removeIndex = playlist.queue.findIndex((item) => item.id === id)
          if (removeIndex === -1) return

          const newQueue = reject(playlist.queue, { id }) as PlaylistItem[]
          let newCurrentIndex = playlist.currentIndex
          let newCurrentItem = playlist.currentItem

          let newShuffleOrder = playlist.shuffleOrder
          if (playlist.shuffle) {
            newShuffleOrder = playlist.shuffleOrder
              .filter((i) => i !== removeIndex)
              .map((i) => (i > removeIndex ? i - 1 : i))
          }

          if (removeIndex < playlist.currentIndex) {
            newCurrentIndex = playlist.currentIndex - 1
          } else if (removeIndex === playlist.currentIndex) {
            newCurrentIndex = Math.min(
              playlist.currentIndex,
              newQueue.length - 1
            )
            newCurrentItem = newQueue[newCurrentIndex] ?? null

            set(({ playlist: p }) => {
              p.currentIndex = newCurrentIndex
              p.currentItem = newCurrentItem
              p.queue = newQueue
              p.shuffleOrder = newShuffleOrder
            })

            emitPlaylistChange(
              events.emit,
              newCurrentIndex,
              newCurrentItem,
              playlist.currentIndex,
              playlist.currentItem,
              "remove"
            )
            return
          }

          set(({ playlist: p }) => {
            p.currentIndex = newCurrentIndex
            p.currentItem = newCurrentItem
            p.queue = newQueue
            p.shuffleOrder = newShuffleOrder
          })
        },
        removeAt: (index) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          if (index >= 0 && index < playlist.queue.length) {
            playlist.remove(playlist.queue[index].id)
          }
        },
        reorder: (fromIndex, toIndex) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          if (
            fromIndex < 0 ||
            fromIndex >= playlist.queue.length ||
            toIndex < 0 ||
            toIndex >= playlist.queue.length
          ) {
            return
          }

          const newQueue = [...playlist.queue]
          const [removed] = newQueue.splice(fromIndex, 1)
          newQueue.splice(toIndex, 0, removed)

          let newCurrentIndex = playlist.currentIndex
          if (fromIndex === playlist.currentIndex) {
            newCurrentIndex = toIndex
          } else if (
            fromIndex < playlist.currentIndex &&
            toIndex >= playlist.currentIndex
          ) {
            newCurrentIndex = playlist.currentIndex - 1
          } else if (
            fromIndex > playlist.currentIndex &&
            toIndex <= playlist.currentIndex
          ) {
            newCurrentIndex = playlist.currentIndex + 1
          }

          let newShuffleOrder = playlist.shuffleOrder
          if (playlist.shuffle) {
            newShuffleOrder = playlist.shuffleOrder.map((i) => {
              if (i === fromIndex) return toIndex
              if (fromIndex < toIndex) {
                if (i > fromIndex && i <= toIndex) return i - 1
              } else if (i >= toIndex && i < fromIndex) {
                return i + 1
              }
              return i
            })
          }

          set(({ playlist: p }) => {
            p.currentIndex = newCurrentIndex
            p.queue = newQueue
            p.shuffleOrder = newShuffleOrder
          })
        },
        repeatMode: "off",
        sessionId: generateSessionId(),
        setRepeatMode: (mode) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          set(({ playlist: p }) => {
            p.repeatMode = normalizeRepeatMode(mode, playlist.queue.length)
          })
        },
        setShuffle: (enabled) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          if (playlist.shuffle === enabled) return

          set(({ playlist: p }) => {
            p.shuffle = enabled
            p.shuffleOrder =
              enabled && playlist.queue.length > 0
                ? createShuffleOrder(
                    playlist.queue.length,
                    playlist.currentIndex
                  )
                : []
          })
        },
        shuffle: false,
        shuffleOrder: [],
        skipTo: (index) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          if (index < 0 || index >= playlist.queue.length) return false

          if (playlist.currentItem) {
            set(({ playlist: p }) => {
              p.history = [...playlist.history, playlist.currentItem!]
            })
          }

          const item = playlist.queue[index] as PlaylistItem
          set(({ playlist: p }) => {
            p.currentIndex = index
            p.currentItem = item
          })

          emitPlaylistChange(
            events.emit,
            index,
            item,
            playlist.currentIndex,
            playlist.currentItem,
            "skip"
          )
          return true
        },
        skipToId: (id) => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const index = playlist.queue.findIndex((item) => item.id === id)
          if (index === -1) return false
          return playlist.skipTo(index)
        },
        toggleShuffle: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const newShuffle = !playlist.shuffle
          set(({ playlist: p }) => {
            p.shuffle = newShuffle
            p.shuffleOrder =
              newShuffle && playlist.queue.length > 0
                ? createShuffleOrder(
                    playlist.queue.length,
                    playlist.currentIndex
                  )
                : []
          })
        },
      },
    }),
    key: PLAYLIST_FEATURE_KEY,
    Setup: PlaylistSetup,
  }
}

export function usePlaylist<T>(): UsePlaylistReturn<T> {
  const api = useMediaFeatureApi<PlaylistStore>(PLAYLIST_FEATURE_KEY)
  const events = useMediaEvents<PlaylistEvents>()
  const currentIndex = usePlaylistStore((state) => state.currentIndex)
  const queue = usePlaylistStore((state) => state.queue)
  const shuffle = usePlaylistStore((state) => state.shuffle)
  const shuffleOrder = usePlaylistStore((state) => state.shuffleOrder)
  const repeatMode = usePlaylistStore((state) => state.repeatMode)

  const state = usePlaylistStore(
    useShallow((playlist) => ({
      append: playlist.append as UsePlaylistReturn<T>["append"],
      clear: playlist.clear,
      currentIndex: playlist.currentIndex,
      cycleRepeatMode: playlist.cycleRepeatMode,
      getItem: playlist.getItem as UsePlaylistReturn<T>["getItem"],
      insert: playlist.insert as UsePlaylistReturn<T>["insert"],
      load: playlist.load as UsePlaylistReturn<T>["load"],
      newSession: playlist.newSession,
      next: playlist.next,
      playNext: playlist.playNext as UsePlaylistReturn<T>["playNext"],
      prepend: playlist.prepend as UsePlaylistReturn<T>["prepend"],
      remove: playlist.remove,
      removeAt: playlist.removeAt,
      reorder: playlist.reorder,
      setRepeatMode: playlist.setRepeatMode,
      setShuffle: playlist.setShuffle,
      skipTo: playlist.skipTo,
      skipToId: playlist.skipToId,
      toggleShuffle: playlist.toggleShuffle,
    }))
  )

  const currentItem = React.useMemo((): null | PlaylistItem<T> => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      return queue[currentIndex] as PlaylistItem<T>
    }
    return null
  }, [currentIndex, queue])

  const nextItem = React.useMemo((): null | PlaylistItem<T> => {
    const nextIndex = api.getState().playlist.getNextIndex()
    if (nextIndex >= 0 && nextIndex < queue.length) {
      return queue[nextIndex] as PlaylistItem<T>
    }
    return null
  }, [api, queue, currentIndex, shuffle, shuffleOrder, repeatMode])

  const previousItem = React.useMemo((): null | PlaylistItem<T> => {
    const prevIndex = api.getState().playlist.getPreviousIndex()
    if (prevIndex >= 0 && prevIndex < queue.length) {
      return queue[prevIndex] as PlaylistItem<T>
    }
    return null
  }, [api, queue, currentIndex, shuffle, shuffleOrder, repeatMode])

  const orderedItems = React.useMemo((): PlaylistItem<T>[] => {
    const typedQueue = queue as unknown as PlaylistItem<T>[]

    if (!shuffle || shuffleOrder.length === 0) {
      return typedQueue
    }

    return shuffleOrder.map((index) => typedQueue[index])
  }, [queue, shuffle, shuffleOrder])

  const hasNext =
    (repeatMode === "all" && queue.length > 0) ||
    api.getState().playlist.getNextIndex() !== -1

  const hasPrevious =
    (repeatMode === "all" && queue.length > 0) ||
    api.getState().playlist.getPreviousIndex() !== -1

  const previous = React.useCallback(() => {
    const prevIndex = api.getState().playlist.getPreviousIndex()
    if (prevIndex === -1 || prevIndex >= queue.length) return false

    const playlist = api.getState().playlist as PlaylistStore["playlist"]

    if (playlist.history.length > 0) {
      api.setState(({ playlist: p }) => {
        p.history = playlist.history.slice(0, -1)
      })
    }

    const targetItem = queue[prevIndex] as PlaylistItem
    api.setState(({ playlist: p }) => {
      p.currentIndex = prevIndex
      p.currentItem = targetItem
    })
    emitPlaylistChange(
      events.emit,
      prevIndex,
      targetItem,
      playlist.currentIndex,
      playlist.currentItem,
      "previous"
    )
    return true
  }, [api, events, queue])

  return {
    append: state.append,
    clear: state.clear,
    currentIndex: state.currentIndex,
    currentItem,
    cycleRepeatMode: state.cycleRepeatMode,
    getItem: state.getItem,
    hasNext,
    hasPrevious,
    insert: state.insert,
    load: state.load,
    newSession: state.newSession,
    next: state.next,
    nextItem,
    orderedItems,
    playNext: state.playNext,
    prepend: state.prepend,
    previous,
    previousItem,
    remove: state.remove,
    removeAt: state.removeAt,
    reorder: state.reorder,
    setRepeatMode: state.setRepeatMode,
    setShuffle: state.setShuffle,
    skipTo: state.skipTo,
    skipToId: state.skipToId,
    toggleShuffle: state.toggleShuffle,
  }
}

export function usePlaylistStore<TSelected>(
  selector: (state: PlaylistStore["playlist"]) => TSelected
): TSelected {
  return useMediaFeatureStore<PlaylistStore, TSelected>(
    PLAYLIST_FEATURE_KEY,
    (state) => selector(state.playlist)
  )
}

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

function emitPlaylistChange(
  emit: (name: "playlistchange", payload: PlaylistChangeEvent) => void,
  nextIndex: number,
  nextItem: null | PlaylistItem,
  previousIndex: number,
  previousItem: null | PlaylistItem,
  reason: PlaylistChangeEvent["reason"]
) {
  emit("playlistchange", {
    currentIndex: nextIndex,
    currentItem: nextItem,
    previousIndex,
    previousItem,
    reason,
  })
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

function PlaylistSetup() {
  const api = useMediaFeatureApi<PlaylistStore>(PLAYLIST_FEATURE_KEY)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const repeatMode = usePlaylistStore((state) => state.repeatMode)

  React.useEffect(() => {
    if (!mediaElement) return

    mediaElement.loop = repeatMode === "one"
  }, [mediaElement, repeatMode])

  React.useEffect(() => {
    const playlist = api.getState().playlist as PlaylistStore["playlist"]

    if (playlist.queue.length <= 1 && repeatMode === "all") {
      api.setState(({ playlist }) => {
        playlist.repeatMode = "one"
      })
    }
  }, [api, repeatMode])

  return null
}
