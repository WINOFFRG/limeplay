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
        path: "internal/media.ts",
        type: "registry:lib",
      },
    ],
    name: "internal-media",
    registryDependencies: [
      "media-provider",
      "use-asset",
      "use-captions",
      "use-media",
      "use-picture-in-picture",
      "use-playback",
      "use-playback-rate",
      "use-player",
      "use-playlist",
      "use-timeline",
      "use-volume",
    ],
    type: "registry:lib",
  },
]
