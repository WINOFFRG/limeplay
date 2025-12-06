import { type Registry } from "shadcn/schema"

export const lib: Registry["items"] = [
  {
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
    name: "utils",
    type: "registry:lib",
  },
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "lib/create-media-store.ts",
        type: "registry:lib",
      },
    ],
    name: "create-media-store",
    registryDependencies: ["use-player"],
    type: "registry:lib",
  },
  {
    dependencies: ["date-fns"],
    files: [
      {
        path: "lib/time.ts",
        type: "registry:lib",
      },
    ],
    name: "time",
    type: "registry:lib",
  },
]

// Internal components (used internally by other registry components)
export const internal: Registry["items"] = [
  {
    files: [
      {
        path: "internal/custom-demo-controls.tsx",
        type: "registry:ui",
      },
    ],
    name: "custom-demo-controls",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "internal/player-hooks-demo.tsx",
        type: "registry:ui",
      },
    ],
    name: "player-hooks-demo",
    registryDependencies: [
      "use-player",
      "use-shaka-player",
      "use-timeline",
      "use-volume",
      "use-captions",
      "use-playback-rate",
    ],
    type: "registry:ui",
  },
]
