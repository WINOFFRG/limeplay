import { type Registry, registryItemSchema } from "shadcn/schema"
import { z } from "zod"

import { blocks } from "@/registry/collection/registry-blocks"
import { examples } from "@/registry/collection/registry-examples"
import { hooks } from "@/registry/collection/registry-hooks"
import { internal, lib } from "@/registry/collection/registry-lib"
import { ui } from "@/registry/collection/registry-ui"

export const registry: Registry = {
  homepage: "https://limeplay.winoffrg.dev",
  items: z.array(registryItemSchema).parse([
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
  ]),
  name: "limeplay/ui",
}
