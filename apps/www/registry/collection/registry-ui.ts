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
      },
    ],
  },
  {
    name: "media-provider",
    type: "registry:ui",
    dependencies: ["zustand"],
    files: [
      {
        path: "ui/media-provider.tsx",
        type: "registry:ui",
      },
      {
        path: "internal/create-media-store.ts",
        type: "registry:lib",
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
    dependencies: ["@base-ui-components/react/slider"],
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
      },
    ],
  },
  {
    name: "timeline-labels",
    type: "registry:ui",
    registryDependencies: ["media-provider", "utils"],
    files: [
      {
        path: "ui/timeline-labels.tsx",
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
    name: "timeline-slider",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react/slider"],
    registryDependencies: [
      "media-provider",
      "utils",
      "use-timeline",
      "use-track-events",
    ],
    files: [
      {
        path: "ui/timeline-slider.tsx",
        type: "registry:ui",
      },
    ],
  },
]
