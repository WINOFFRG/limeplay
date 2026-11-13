import { describe, expect, test } from "bun:test"

import { durationDateTime, formatTimestamp } from "@/registry/default/lib/time"

describe("formatTimestamp", () => {
  test("formats minutes and seconds", () => {
    expect(formatTimestamp(61)).toBe("01:01")
    expect(formatTimestamp(3661, true)).toBe("01:01:01")
  })

  test("returns zero for invalid or nonpositive times", () => {
    for (const value of [0, -5, NaN, Infinity]) {
      expect(formatTimestamp(value)).toBe("00:00")
      expect(formatTimestamp(value, true)).toBe("00:00:00")
    }
  })

  test("drops hours when showHours is false", () => {
    expect(formatTimestamp(3600, false)).toBe("00:00")
  })
})

describe("durationDateTime", () => {
  test("formats finite durations", () => {
    expect(durationDateTime(59)).toBe("PT59S")
    expect(durationDateTime(600)).toBe("PT10M")
    expect(durationDateTime(3661)).toBe("PT1H1M1S")
  })

  test("returns zero for invalid or nonpositive durations", () => {
    expect(durationDateTime(0)).toBe("PT0S")
    expect(durationDateTime(-1)).toBe("PT0S")
    expect(durationDateTime(NaN)).toBe("PT0S")
  })
})
