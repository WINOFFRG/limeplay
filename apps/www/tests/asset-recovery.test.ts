import { describe, expect, test } from "bun:test"

import { canSkipAfterLoadError } from "@/registry/default/hooks/use-asset"

const playlist = {
  currentIndex: 0,
  queue: ["first", "second", "third"],
  repeatMode: "off",
  shuffle: false,
  shuffleOrder: [],
}

describe("canSkipAfterLoadError", () => {
  test("does not skip an empty queue", () => {
    expect(canSkipAfterLoadError({ ...playlist, queue: [] })).toBe(false)
  })

  test("does not retry the same item in repeat-one mode", () => {
    expect(canSkipAfterLoadError({ ...playlist, repeatMode: "one" })).toBe(
      false
    )
  })

  test("moves forward from the middle of a list", () => {
    expect(canSkipAfterLoadError(playlist)).toBe(true)
  })

  test("stops at the last item with repeat off", () => {
    expect(canSkipAfterLoadError({ ...playlist, currentIndex: 2 })).toBe(false)
  })

  test("does not wrap from the last item with repeat all", () => {
    expect(
      canSkipAfterLoadError({
        ...playlist,
        currentIndex: 2,
        repeatMode: "all",
      })
    ).toBe(false)
  })

  test("moves forward through the shuffle order", () => {
    expect(
      canSkipAfterLoadError({
        ...playlist,
        currentIndex: 2,
        shuffle: true,
        shuffleOrder: [2, 0, 1],
      })
    ).toBe(true)
  })

  test("stops at the final shuffled item even with repeat all", () => {
    expect(
      canSkipAfterLoadError({
        ...playlist,
        currentIndex: 1,
        repeatMode: "all",
        shuffle: true,
        shuffleOrder: [2, 0, 1],
      })
    ).toBe(false)
  })
})
