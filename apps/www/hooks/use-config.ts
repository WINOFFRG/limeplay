import { getDefaultStore, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { Style } from "@/registry/collection/registry-styles"

interface Config {
  installationType: "cli" | "manual"
  packageManager: "bun" | "npm" | "pnpm" | "yarn"
  radius: number
  style: Style["name"]
}

const configAtom = atomWithStorage<Config>("config", {
  installationType: "cli",
  packageManager: "pnpm",
  radius: 0.5,
  style: "default",
})

export function atomReader() {
  const store = getDefaultStore()
  const value = store.get(configAtom)
  return value
}

export function useConfig() {
  return useAtom(configAtom)
}
