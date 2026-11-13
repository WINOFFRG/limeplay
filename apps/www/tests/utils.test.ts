import { describe, expect, test } from "bun:test"

import { toFixedNumber } from "@/registry/default/lib/utils"

describe("toFixedNumber", () => {
  test("rounds to the requested number of decimal places", () => {
    expect(toFixedNumber(1.23456, 2)).toBe(1.23)
    expect(toFixedNumber(1.005, 0)).toBe(1)
  })
})
