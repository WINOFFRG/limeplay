import { type Registry } from "shadcn/schema"

const TARGET_BASE_PATH = "hooks/limeplay"

export const hooks: Registry["items"] = [
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-media.ts",
        target: `${TARGET_BASE_PATH}/use-media.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-media",
    registryDependencies: ["media-provider"],
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
      "use-media",
      "use-player",
      "use-playback",
      "utils",
      "media-provider",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.clamp"],
    devDependencies: ["@types/lodash.clamp"],
    files: [
      {
        path: "hooks/use-track-events.ts",
        target: `${TARGET_BASE_PATH}/use-track-events.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-track-events",
    registryDependencies: [],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.clamp", "shaka-player", "zustand"],
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
      "use-media",
      "use-player",
      "use-playback",
      "utils",
      "media-provider",
      "use-interval",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["shaka-player", "zustand"],
    files: [
      {
        path: "hooks/use-player.ts",
        target: `${TARGET_BASE_PATH}/use-player.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-player",
    registryDependencies: [
      "use-media",
      "use-playback",
      "utils",
      "media-provider",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["shaka-player", "zustand"],
    files: [
      {
        path: "hooks/use-asset.ts",
        target: `${TARGET_BASE_PATH}/use-asset.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-asset",
    registryDependencies: [
      "use-media",
      "use-player",
      "use-playlist",
      "use-playback",
      "media-provider",
    ],
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
    dependencies: ["shaka-player", "zustand"],
    files: [
      {
        path: "hooks/use-captions.ts",
        target: `${TARGET_BASE_PATH}/use-captions.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-captions",
    registryDependencies: [
      "use-media",
      "use-player",
      "use-playback",
      "utils",
      "media-provider",
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
      "use-media",
      "use-player",
      "use-playback",
      "utils",
      "media-provider",
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
    registryDependencies: ["use-media", "media-provider"],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash", "zustand"],
    files: [
      {
        path: "hooks/use-playlist.ts",
        target: `${TARGET_BASE_PATH}/use-playlist.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-playlist",
    registryDependencies: ["use-media", "utils", "media-provider"],
    type: "registry:hook",
  },
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-playback.ts",
        target: `${TARGET_BASE_PATH}/use-playback.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-playback",
    registryDependencies: ["use-media", "media-provider", "utils"],
    type: "registry:hook",
  },
  {
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-picture-in-picture.ts",
        target: `${TARGET_BASE_PATH}/use-picture-in-picture.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-picture-in-picture",
    registryDependencies: [
      "use-media",
      "use-playback",
      "utils",
      "media-provider",
    ],
    type: "registry:hook",
  },
  {
    dependencies: ["lodash.throttle"],
    devDependencies: ["@types/lodash.throttle"],
    files: [
      {
        path: "hooks/use-idle.ts",
        target: `${TARGET_BASE_PATH}/use-idle.ts`,
        type: "registry:hook",
      },
    ],
    name: "use-idle",
    registryDependencies: ["utils"],
    type: "registry:hook",
  },
]
