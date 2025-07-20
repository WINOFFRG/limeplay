import { registryItemSchema, type Registry } from "shadcn/registry"
import { z } from "zod"

import { blocks } from "@/registry/collection/registry-blocks"
import { examples } from "@/registry/collection/registry-examples"
import { hooks } from "@/registry/collection/registry-hooks"
import { internal, lib } from "@/registry/collection/registry-lib"
import { ui } from "@/registry/collection/registry-ui"

const DEPRECATED_ITEMS = [
  "toast",
  "toast-demo",
  "toast-destructive",
  "toast-simple",
  "toast-with-action",
  "toast-with-title",
]

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse(
    [
      {
        name: "index",
        type: "registry:style",
        dependencies: ["class-variance-authority", "lucide-react"],
        devDependencies: ["tw-animate-css"],
        registryDependencies: ["utils"],
        cssVars: {},
        files: [],
      },
      ...ui,
      ...blocks,
      ...lib,
      ...hooks,
      ...examples,
      ...internal,
    ].filter((item) => {
      return !DEPRECATED_ITEMS.includes(item.name)
    })
  ),
} satisfies Registry
