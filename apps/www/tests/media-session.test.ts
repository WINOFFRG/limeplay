import { describe, expect, test } from "bun:test"

import {
  canStartMediaSessionPlayback,
  getMediaSessionMetadataValue,
  getMediaSessionPlaybackState,
  getMediaSessionPositionState,
  isMediaSessionPlaylistSource,
} from "@/registry/default/hooks/use-media-session"

describe("media session playback", () => {
  test("maps active state and player status", () => {
    expect(
      getMediaSessionPlaybackState({ active: false, status: "playing" })
    ).toBe("none")
    expect(
      getMediaSessionPlaybackState({ active: true, status: "playing" })
    ).toBe("playing")
    expect(
      getMediaSessionPlaybackState({ active: true, status: "paused" })
    ).toBe("paused")
    expect(
      getMediaSessionPlaybackState({ active: true, status: "buffering" })
    ).toBe("paused")
  })

  test("does not start playback from init or error", () => {
    expect(canStartMediaSessionPlayback("error")).toBe(false)
    expect(canStartMediaSessionPlayback("init")).toBe(false)
    expect(canStartMediaSessionPlayback("paused")).toBe(true)
  })
})

describe("media session position", () => {
  test("returns a valid position", () => {
    expect(
      getMediaSessionPositionState({
        active: true,
        currentTime: 5,
        duration: 10,
      })
    ).toEqual({ duration: 10, playbackRate: 1, position: 5 })
  })

  test("rejects inactive or invalid positions", () => {
    expect(
      getMediaSessionPositionState({
        active: false,
        currentTime: 5,
        duration: 10,
      })
    ).toBeNull()

    for (const position of [
      { currentTime: 5, duration: Infinity },
      { currentTime: 5, duration: 0 },
      { currentTime: -1, duration: 10 },
      { currentTime: NaN, duration: 10 },
    ]) {
      expect(
        getMediaSessionPositionState({ active: true, ...position })
      ).toBeNull()
    }
  })
})

describe("media session metadata and source", () => {
  test("uses the first nonblank metadata value", () => {
    expect(getMediaSessionMetadataValue(undefined, "  ", "Title")).toBe("Title")
    expect(getMediaSessionMetadataValue(null, 7)).toBe("7")
    expect(getMediaSessionMetadataValue()).toBeUndefined()
  })

  test("recognizes playlist sources", () => {
    expect(isMediaSessionPlaylistSource("playlist")).toBe(true)
    expect(isMediaSessionPlaylistSource("asset")).toBe(false)
    expect(isMediaSessionPlaylistSource(null)).toBe(false)
  })
})
