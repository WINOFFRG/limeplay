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
    name: "custom-demo-controls",
    type: "registry:ui",
    files: [
      {
        path: "internal/custom-demo-controls.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "player-hooks-demo",
    type: "registry:ui",
    registryDependencies: [
      "use-media-state",
      "use-shaka-player",
      "use-timeline",
      "use-volume",
    ],
    files: [
      {
        path: "internal/player-hooks-demo.tsx",
        type: "registry:ui",
      },
    ],
  },
]
