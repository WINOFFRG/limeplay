import { type Registry, registrySchema } from "shadcn/schema"

import { blocks } from "@/registry/collection/registry-blocks"
import { examples } from "@/registry/collection/registry-examples"
import { hooks } from "@/registry/collection/registry-hooks"
import { internal, lib } from "@/registry/collection/registry-lib"
import { ui } from "@/registry/collection/registry-ui"

const result = registrySchema.safeParse({
  homepage: "https://limeplay.winoffrg.dev",
  items: [
    {
      cssVars: {},
      dependencies: ["class-variance-authority", "lucide-react"],
      devDependencies: ["tw-animate-css"],
      files: [],
      name: "index",
      registryDependencies: ["utils"],
      type: "registry:style",
    },
    ...ui,
    ...blocks,
    ...lib,
    ...hooks,
    ...internal,
    ...examples,
  ],
  name: "limeplay/ui",
})

if (!result.success) {
  console.error("❌ Registry validation failed:")
  console.error(JSON.stringify(result.error.format(), null, 2))
  throw new Error("Invalid registry schema")
}

export const registry: Registry = result.data
