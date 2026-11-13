import { describe, expect, test } from "bun:test"
import { immer } from "zustand/middleware/immer"
import { createStore } from "zustand/vanilla"

interface ProbeState {
  player: { instance: null | object; preloadManagers: Map<string, number> }
}

describe("store maps", () => {
  test("a Map read from the store is frozen after any update", () => {
    const store = createStore<ProbeState>()(
      immer(() => ({ player: { instance: null, preloadManagers: new Map() } }))
    )

    store.setState((state) => {
      state.player.instance = {}
    })

    expect(() =>
      store.getState().player.preloadManagers.set("asset", 1)
    ).toThrow()
  })

  test("copy, mutate the copy, assign the copy", () => {
    const store = createStore<ProbeState>()(
      immer(() => ({ player: { instance: null, preloadManagers: new Map() } }))
    )

    const updatedManagers = new Map(store.getState().player.preloadManagers)
    updatedManagers.set("asset", 1)
    store.setState((state) => {
      state.player.preloadManagers = updatedManagers
    })

    expect(store.getState().player.preloadManagers.get("asset")).toBe(1)
  })
})
