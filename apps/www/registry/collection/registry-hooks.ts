import { type Registry } from "shadcn/registry"

const TARGET_BASE_PATH = "hooks/limeplay"

export const hooks: Registry["items"] = [
  {
    name: "use-player-root-store",
    type: "registry:hook",
    dependencies: ["zustand"],
    registryDependencies: ["player-hooks"],
    files: [
      {
        path: "hooks/use-player-root-store.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-player-root-store.ts`,
      },
    ],
  },
  {
    name: "use-volume",
    type: "registry:hook",
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    registryDependencies: [
      "use-player-root-store",
      "utils",
      "media-provider",
      "player-hooks",
    ],
    files: [
      {
        path: "hooks/use-volume.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-volume.ts`,
      },
    ],
  },
  {
    name: "use-track-events",
    type: "registry:hook",
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    registryDependencies: ["player-hooks"],
    files: [
      {
        path: "hooks/use-track-events.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-track-events.ts`,
      },
    ],
  },
  {
    name: "use-timeline",
    type: "registry:hook",
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    registryDependencies: [
      "use-player-root-store",
      "utils",
      "media-provider",
      "use-interval",
      "player-hooks",
    ],
    files: [
      {
        path: "hooks/use-timeline.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-timeline.ts`,
      },
    ],
  },
  {
    name: "use-media-state",
    type: "registry:hook",
    dependencies: ["zustand"],
    registryDependencies: [
      "use-player-root-store",
      "utils",
      "media-provider",
      "player-hooks",
    ],
    files: [
      {
        path: "hooks/use-media-state.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-media-state.ts`,
      },
    ],
  },
  {
    name: "use-shaka-player",
    type: "registry:hook",
    dependencies: ["shaka-player"],
    registryDependencies: ["media-provider", "player-hooks"],
    files: [
      {
        path: "hooks/use-shaka-player.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-shaka-player.ts`,
      },
    ],
  },
  {
    name: "use-interval",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-interval.ts",
        type: "registry:hook",
        target: `${TARGET_BASE_PATH}/use-interval.ts`,
      },
    ],
  },
]
