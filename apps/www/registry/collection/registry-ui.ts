import { type Registry } from "shadcn/registry"

export const ui: Registry["items"] = [
  {
    name: "fallback-poster",
    type: "registry:ui",
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "ui/fallback-poster.tsx",
        type: "registry:ui",
        target: "components/player/fallback-poster.tsx",
      },
    ],
  },
  {
    name: "mute-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["media-provider", "use-volume"],
    files: [
      {
        path: "ui/mute-control.tsx",
        type: "registry:ui",
        target: "components/player/mute-control.tsx",
      },
    ],
  },
  {
    name: "media-provider",
    type: "registry:ui",
    dependencies: ["zustand"],
    registryDependencies: [
      "create-media-store",
      "use-media-state",
      "use-player-root-store",
      "use-timeline",
      "use-volume",
    ],
    files: [
      {
        path: "ui/media-provider.tsx",
        type: "registry:ui",
        target: "components/player/media-provider.tsx",
      },
    ],
  },
  {
    name: "player-layout",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    registryDependencies: ["media-provider", "use-player-root-store"],
    files: [
      {
        path: "ui/player-layout.tsx",
        type: "registry:ui",
        target: "components/player/player-layout.tsx",
      },
    ],
  },
  {
    name: "media",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "ui/media.tsx",
        type: "registry:ui",
        target: "components/player/media.tsx",
      },
    ],
  },
  {
    name: "volume-control",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: [
      "media-provider",
      "utils",
      "use-volume",
      "use-track-events",
    ],
    files: [
      {
        path: "ui/volume-control.tsx",
        type: "registry:ui",
        target: "components/player/volume-control.tsx",
      },
    ],
  },
  {
    name: "playback-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["use-media-state", "media-provider"],
    files: [
      {
        path: "ui/playback-control.tsx",
        type: "registry:ui",
        target: "components/player/playback-control.tsx",
      },
    ],
  },
  {
    name: "timeline-labels",
    type: "registry:ui",
    registryDependencies: ["media-provider", "utils", "time"],
    files: [
      {
        path: "ui/timeline-labels.tsx",
        type: "registry:ui",
        target: "components/player/timeline-labels.tsx",
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
        target: "components/player/player-hooks.tsx",
      },
    ],
  },
  {
    name: "timeline-control",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: [
      "media-provider",
      "utils",
      "use-timeline",
      "use-track-events",
    ],
    files: [
      {
        path: "ui/timeline-control.tsx",
        type: "registry:ui",
        target: "components/player/timeline-control.tsx",
      },
    ],
  },
]
