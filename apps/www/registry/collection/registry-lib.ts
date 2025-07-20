import { type Registry } from "shadcn/registry"

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "create-media-store",
    type: "registry:lib",
    dependencies: ["zustand"],
    registryDependencies: ["use-player-root-store"],
    files: [
      {
        path: "lib/create-media-store.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "time",
    type: "registry:lib",
    files: [
      {
        path: "lib/time.ts",
        type: "registry:lib",
      },
    ],
  },
]

// Internal components (used internally by other registry components)
export const internal: Registry["items"] = [
  {
    name: "create-media-store",
    type: "registry:lib",
    dependencies: ["zustand"],
    registryDependencies: ["use-player-root-store"],
    files: [
      {
        path: "internal/create-media-store.ts",
        type: "registry:lib",
      },
    ],
  },
]
