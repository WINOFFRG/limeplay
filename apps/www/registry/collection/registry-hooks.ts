import { type Registry } from "shadcn/schema"

const TARGET_BASE_PATH = "hooks/limeplay"

export const hooks: Registry["items"] = [
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-player.ts",
        target: `${TARGET_BASE_PATH}/use-player.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-player",
    registryDependencies: ["utils", "media-provider", "player-hooks"],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    files: [
      {
        path: "hooks/use-volume.ts",
        target: `${TARGET_BASE_PATH}/use-volume.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-volume",
    registryDependencies: [
      "use-player",
      "utils",
      "media-provider",
      "player-hooks",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    files: [
      {
        path: "hooks/use-track-events.ts",
        target: `${TARGET_BASE_PATH}/use-track-events.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-track-events",
    registryDependencies: ["player-hooks"],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.clamp", "zustand"],
    devDependencies: ["@types/lodash.clamp"],
    files: [
      {
        path: "hooks/use-timeline.ts",
        target: `${TARGET_BASE_PATH}/use-timeline.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-timeline",
    registryDependencies: [
      "use-player",
      "utils",
      "media-provider",
      "use-interval",
      "player-hooks",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["shaka-player"],
    files: [
      {
        path: "hooks/use-shaka-player.ts",
        target: `${TARGET_BASE_PATH}/use-shaka-player.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-shaka-player",
    registryDependencies: ["media-provider", "player-hooks"],
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "hooks/use-interval.ts",
        target: `${TARGET_BASE_PATH}/use-interval.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-interval",
    type: "registry:hook",
  },
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-captions.ts",
        target: `${TARGET_BASE_PATH}/use-captions.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-captions",
    registryDependencies: [
      "use-player",
      "utils",
      "media-provider",
      "player-hooks",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-playback-rate.ts",
        target: `${TARGET_BASE_PATH}/use-playback-rate.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-playback-rate",
    registryDependencies: [
      "use-player",
      "utils",
      "media-provider",
      "player-hooks",
    ],
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "hooks/use-seek.ts",
        target: `${TARGET_BASE_PATH}/use-seek.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-seek",
    registryDependencies: ["media-provider"],
    type: "registry:hook",
  },
]
