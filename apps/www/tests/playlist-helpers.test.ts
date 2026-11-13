import { describe, expect, test } from "bun:test"

import {
  createShuffleOrder,
  getPreviousPlaylistTarget,
  getRepeatModes,
  normalizeRepeatMode,
} from "@/registry/default/hooks/use-playlist"

type Playlist = Parameters<typeof getPreviousPlaylistTarget>[0]

function createPlaylist({
  currentIndex = 0,
  queueLength = 3,
  repeatMode = "off",
}: {
  currentIndex?: number
  queueLength?: number
  repeatMode?: Playlist["repeatMode"]
} = {}): Playlist {
  return {
    currentIndex,
    history: [],
    queue: Array.from({ length: queueLength }, (_, index) => ({
      id: `item-${index}`,
      properties: {},
    })),
    repeatMode,
    shuffle: false,
    shuffleOrder: [],
  } as unknown as Playlist
}

describe("playlist shuffle helpers", () => {
  test("includes every index exactly once", () => {
    const order = createShuffleOrder(5)
    expect(order).toHaveLength(5)
    expect([...order].sort()).toEqual([0, 1, 2, 3, 4])
  })

  test("places the excluded index first without losing an item", () => {
    const order = createShuffleOrder(5, 2)
    expect(order[0]).toBe(2)
    expect([...order].sort()).toEqual([0, 1, 2, 3, 4])
  })

  test("returns no indices for an empty queue", () => {
    expect(createShuffleOrder(0)).toEqual([])
  })
})

describe("playlist repeat helpers", () => {
  test("lists valid modes for the queue length", () => {
    expect(getRepeatModes(1)).toEqual(["off", "one"])
    expect(getRepeatModes(3)).toEqual(["off", "all", "one"])
  })

  test("normalizes all only for a single item", () => {
    expect(normalizeRepeatMode("all", 1)).toBe("one")
    expect(normalizeRepeatMode("all", 2)).toBe("all")
    expect(normalizeRepeatMode("off", 1)).toBe("off")
  })
})

describe("getPreviousPlaylistTarget", () => {
  test("has no target for an empty queue", () => {
    expect(
      getPreviousPlaylistTarget(createPlaylist({ queueLength: 0 }))
    ).toEqual({ historyIndex: -1, index: -1 })
  })

  test("repeats the current item in one mode", () => {
    expect(
      getPreviousPlaylistTarget(
        createPlaylist({ currentIndex: 2, repeatMode: "one" })
      )
    ).toEqual({ historyIndex: -1, index: 2 })
  })

  test("uses the prior queue item when history is empty", () => {
    expect(
      getPreviousPlaylistTarget(createPlaylist({ currentIndex: 2 }))
    ).toEqual({ historyIndex: -1, index: 1 })
  })

  test("stops at the first item when repeat is off", () => {
    expect(getPreviousPlaylistTarget(createPlaylist())).toEqual({
      historyIndex: -1,
      index: -1,
    })
  })

  test("wraps to the final item when repeat is all", () => {
    expect(
      getPreviousPlaylistTarget(createPlaylist({ repeatMode: "all" }))
    ).toEqual({ historyIndex: -1, index: 2 })
  })
})
