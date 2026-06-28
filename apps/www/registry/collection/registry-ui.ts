import { type Registry } from "shadcn/schema"

const TARGET_BASE_PATH = "components/limeplay"

export const ui: Registry["items"] = [
  {
    dependencies: ["shaka-player@^4"],
    files: [
      {
        path: "ui/error-screen.tsx",
        target: `${TARGET_BASE_PATH}/error-screen.tsx`,
        type: "registry:ui",
      },
    ],
    name: "error-screen",
    registryDependencies: ["media-provider", "item"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/fallback-poster.tsx",
        target: `${TARGET_BASE_PATH}/fallback-poster.tsx`,
        type: "registry:ui",
      },
    ],
    name: "fallback-poster",
    registryDependencies: ["media-provider"],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/mute-control.tsx",
        target: `${TARGET_BASE_PATH}/mute-control.tsx`,
        type: "registry:ui",
      },
    ],
    name: "mute-control",
    registryDependencies: ["media-provider", "use-volume", "use-playback"],
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "lp-accent": "oklch(0.97 0 0)",
        "lp-primary": "oklch(0.205 0 0)",
        "lp-primary-foreground": "oklch(0.985 0 0)",
      },
      light: {
        "lp-accent": "oklch(0.269 0 0)",
        "lp-primary": "oklch(0.205 0 0)",
        "lp-primary-foreground": "oklch(0.985 0 0)",
      },
    },
    dependencies: ["zustand", "immer"],
    files: [
      {
        path: "ui/media-provider.tsx",
        target: `${TARGET_BASE_PATH}/media-provider.tsx`,
        type: "registry:ui",
      },
    ],
    name: "media-provider",
    registryDependencies: [],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    files: [
      {
        path: "ui/player-layout.tsx",
        target: `${TARGET_BASE_PATH}/player-layout.tsx`,
        type: "registry:ui",
      },
    ],
    name: "player-layout",
    registryDependencies: ["media-provider"],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    files: [
      {
        path: "ui/media.tsx",
        target: `${TARGET_BASE_PATH}/media.tsx`,
        type: "registry:ui",
      },
    ],
    name: "media",
    registryDependencies: ["media-provider", "use-media", "use-playback"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/volume-control.tsx",
        target: `${TARGET_BASE_PATH}/volume-control.tsx`,
        type: "registry:ui",
      },
    ],
    name: "volume-control",
    registryDependencies: [
      "media-provider",
      "utils",
      "use-volume",
      "use-track-events",
      "use-playback",
    ],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/playback-control.tsx",
        target: `${TARGET_BASE_PATH}/playback-control.tsx`,
        type: "registry:ui",
      },
    ],
    name: "playback-control",
    registryDependencies: ["media-provider", "use-playback"],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/picture-in-picture-control.tsx",
        target: `${TARGET_BASE_PATH}/picture-in-picture-control.tsx`,
        type: "registry:ui",
      },
    ],
    name: "picture-in-picture-control",
    registryDependencies: [
      "media-provider",
      "use-picture-in-picture",
      "use-playback",
    ],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/playback-rate.tsx",
        target: `${TARGET_BASE_PATH}/playback-rate.tsx`,
        type: "registry:ui",
      },
    ],
    name: "playback-rate",
    registryDependencies: ["media-provider", "use-playback-rate", "select"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/timeline-labels.tsx",
        target: `${TARGET_BASE_PATH}/timeline-labels.tsx`,
        type: "registry:ui",
      },
    ],
    name: "timeline-labels",
    registryDependencies: ["media-provider", "use-timeline", "utils", "time"],
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "lp-timeline-buffered-color": "oklch(0.985 0 0 / 0.4)",
      },
      light: {
        "lp-timeline-buffered-color": "oklch(0.985 0 0 / 0.4)",
      },
      theme: {
        "lp-timeline-track-height": "4px",
        "lp-timeline-track-height-active": "7px",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/timeline-control.tsx",
        target: `${TARGET_BASE_PATH}/timeline-control.tsx`,
        type: "registry:ui",
      },
    ],
    name: "timeline-control",
    registryDependencies: [
      "media-provider",
      "utils",
      "use-timeline",
      "use-track-events",
      "use-playback",
    ],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/limeplay-logo.tsx",
        target: `${TARGET_BASE_PATH}/limeplay-logo.tsx`,
        type: "registry:ui",
      },
    ],
    name: "limeplay-logo",
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    files: [
      {
        path: "ui/root-container.tsx",
        target: `${TARGET_BASE_PATH}/root-container.tsx`,
        type: "registry:ui",
      },
    ],
    name: "root-container",
    registryDependencies: [
      "media-provider",
      "use-media",
      "use-playback",
      "use-player",
    ],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    files: [
      {
        path: "ui/captions.tsx",
        target: `${TARGET_BASE_PATH}/captions.tsx`,
        type: "registry:ui",
      },
    ],
    name: "captions",
    registryDependencies: ["media-provider", "use-captions"],
    type: "registry:ui",
  },
  {
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/seek-controls.tsx",
        target: `${TARGET_BASE_PATH}/seek-controls.tsx`,
        type: "registry:ui",
      },
    ],
    name: "seek-controls",
    registryDependencies: ["media-provider", "use-seek", "use-playback"],
    type: "registry:ui",
  },
]
