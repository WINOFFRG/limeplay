import { type Registry } from "shadcn/registry"

export const hooks: Registry["items"] = [
  {
    name: "use-player-root-store",
    type: "registry:hook",
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-player-root-store.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-volume",
    type: "registry:hook",
    dependencies: ["lodash.clamp", "zustand"],
    registryDependencies: ["use-player-root-store", "utils", "media-provider"],
    files: [
      {
        path: "hooks/use-volume.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-track-events",
    type: "registry:hook",
    dependencies: ["lodash.clamp"],
    files: [
      {
        path: "hooks/use-track-events.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-timeline",
    type: "registry:hook",
    dependencies: ["lodash.clamp", "zustand"],
    registryDependencies: ["use-player-root-store", "utils", "media-provider"],
    files: [
      {
        path: "hooks/use-timeline.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-media-state",
    type: "registry:hook",
    dependencies: ["zustand"],
    registryDependencies: ["use-player-root-store", "utils", "media-provider"],
    files: [
      {
        path: "hooks/use-media-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-shaka-player",
    type: "registry:hook",
    dependencies: ["shaka-player"],
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "hooks/use-shaka-player.ts",
        type: "registry:hook",
      },
    ],
  },
]
