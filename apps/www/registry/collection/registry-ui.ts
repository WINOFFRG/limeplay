import { type Registry } from "shadcn/registry"

export const ui: Registry["items"] = [
  {
    name: "mute-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["media-provider", "use-volume-states"],
    files: [
      {
        path: "ui/mute-control.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "media-provider",
    type: "registry:ui",
    files: [
      {
        path: "ui/media-provider.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "player-layout",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs"],
    registryDependencies: ["media-provider", "use-player-root-store"],
    files: [
      {
        path: "ui/player-layout.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "media",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs"],
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "ui/media.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "volume-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slider"],
    registryDependencies: ["media-provider", "utils", "media-provider"],
    files: [
      {
        path: "ui/volume-control.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "playback-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["use-media-state-states", "media-provider"],
    files: [
      {
        path: "ui/playback-control.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "player-hooks",
    type: "registry:ui",
    registryDependencies: ["use-shaka-player"],
    files: [
      {
        path: "ui/player-hooks.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "timeline-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slider"],
    registryDependencies: ["utils", "media-provider", "utils"],
    files: [
      {
        path: "ui/timeline-control.tsx",
        type: "registry:ui",
      },
    ],
  },
]
