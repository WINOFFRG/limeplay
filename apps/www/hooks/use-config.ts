import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { Style } from "@/registry/collection/registry-styles"

interface Config {
  style: Style["name"]
  radius: number
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  radius: 0.5,
  packageManager: "pnpm",
  installationType: "cli",
})

export function useConfig() {
  return useAtom(configAtom)
}
