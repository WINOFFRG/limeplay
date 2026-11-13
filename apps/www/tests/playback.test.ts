import { describe, expect, test } from "bun:test"

import { isPlayInterruption } from "@/registry/default/hooks/use-playback"

describe("isPlayInterruption", () => {
  test("treats blocked autoplay as an interruption", () => {
    expect(
      isPlayInterruption(new DOMException("blocked", "NotAllowedError"))
    ).toBe(true)
  })

  test("treats an aborted play request as an interruption", () => {
    expect(isPlayInterruption(new DOMException("aborted", "AbortError"))).toBe(
      true
    )
  })

  test("does not hide real failures", () => {
    expect(
      isPlayInterruption(new DOMException("bad", "NotSupportedError"))
    ).toBe(false)
    expect(isPlayInterruption(new Error("AbortError"))).toBe(false)
    expect(isPlayInterruption(null)).toBe(false)
  })
})
