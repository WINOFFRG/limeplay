import { type Registry, registryItemSchema } from "shadcn/schema";
import { z } from "zod";

import { blocks } from "@/registry/collection/registry-blocks";
import { examples } from "@/registry/collection/registry-examples";
import { hooks } from "@/registry/collection/registry-hooks";
import { internal, lib } from "@/registry/collection/registry-lib";
import { ui } from "@/registry/collection/registry-ui";

export const registry: Registry = {
  name: "limeplay/ui",
  homepage: "https://limeplay.winoffrg.dev",
  items: z.array(registryItemSchema).parse([
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
    ...internal,
    ...examples,
  ]),
};
