import type { Registry } from "shadcn/schema";

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
    registryDependencies: ["use-player"],
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
    dependencies: ["date-fns"],
    files: [
      {
        path: "lib/time.ts",
        type: "registry:lib",
      },
    ],
  },
];

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
      "use-player",
      "use-shaka-player",
      "use-timeline",
      "use-volume",
      "use-captions",
      "use-playback-rate",
    ],
    files: [
      {
        path: "internal/player-hooks-demo.tsx",
        type: "registry:ui",
      },
    ],
  },
];
