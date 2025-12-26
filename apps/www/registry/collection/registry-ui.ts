import { type Registry } from "shadcn/schema"

const TARGET_BASE_PATH = "components/limeplay"

export const ui: Registry["items"] = [
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
    registryDependencies: ["media-provider", "use-volume", "use-player"],
    type: "registry:ui",
  },
  {
    css: {
      "@utility -focus-area-x-*": {
        "--x": "--value(number) * -1",
      },
      "@utility -focus-area-y-*": {
        "--y": "--value(number) * -1",
      },
      "@utility focus-area": {
        "&:before": {
          content: '""',
          inset: "calc(var(--y) * 1px) calc(var(--x) * 1px)",
          position: "absolute",
        },

        position: "relative",
      },
      "@utility focus-area-x-*": {
        "--x": "--value(number)",
      },
      "@utility focus-area-y-*": {
        "--y": "--value(number)",
      },
    },
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
    dependencies: ["zustand"],
    files: [
      {
        path: "ui/media-provider.tsx",
        target: `${TARGET_BASE_PATH}/media-provider.tsx`,
        type: "registry:ui",
      },
    ],
    name: "media-provider",
    registryDependencies: ["create-media-store"],
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "background-image-lp-controls-fade": ` linear-gradient(
          to bottom,
          hsla(0, 0%, 0%, 0) 0%,
          hsla(0, 0%, 0%, 0.009) 8.1%,
          hsla(0, 0%, 0%, 0.035) 15.5%,
          hsla(0, 0%, 0%, 0.074) 22.5%,
          hsla(0, 0%, 0%, 0.125) 29%,
          hsla(0, 0%, 0%, 0.184) 35.3%,
          hsla(0, 0%, 0%, 0.25) 41.2%,
          hsla(0, 0%, 0%, 0.32) 47.1%,
          hsla(0, 0%, 0%, 0.39) 52.9%,
          hsla(0, 0%, 0%, 0.46) 58.8%,
          hsla(0, 0%, 0%, 0.526) 64.7%,
          hsla(0, 0%, 0%, 0.585) 71%,
          hsla(0, 0%, 0%, 0.636) 77.5%,
          hsla(0, 0%, 0%, 0.675) 84.5%,
          hsla(0, 0%, 0%, 0.701) 91.9%,
          hsla(0, 0%, 0%, 0.71) 100%
        )`,
      },
      light: {
        "background-image-lp-controls-fade": `linear-gradient(
          to bottom,
          hsla(0, 0%, 91%, 0) 0%,
          hsla(0, 0%, 91%, 0.002) 10.6%,
          hsla(0, 0%, 91%, 0.008) 19.7%,
          hsla(0, 0%, 91%, 0.019) 27.6%,
          hsla(0, 0%, 91%, 0.035) 34.4%,
          hsla(0, 0%, 91%, 0.057) 40.4%,
          hsla(0, 0%, 91%, 0.086) 45.7%,
          hsla(0, 0%, 91%, 0.122) 50.6%,
          hsla(0, 0%, 91%, 0.165) 55.3%,
          hsla(0, 0%, 91%, 0.217) 60%,
          hsla(0, 0%, 91%, 0.278) 65%,
          hsla(0, 0%, 91%, 0.349) 70.3%,
          hsla(0, 0%, 91%, 0.43) 76.3%,
          hsla(0, 0%, 91%, 0.522) 83.1%,
          hsla(0, 0%, 91%, 0.625) 90.9%,
          hsla(0, 0%, 91%, 0.74) 100%
        )`,
      },
    },
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
    registryDependencies: ["media-provider"],
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
      "use-player",
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
    registryDependencies: ["media-provider", "use-player"],
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
    registryDependencies: ["media-provider", "utils", "time"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/player-hooks.tsx",
        target: `${TARGET_BASE_PATH}/player-hooks.tsx`,
        type: "registry:ui",
      },
    ],
    name: "player-hooks",
    registryDependencies: ["use-shaka-player"],
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
      "use-player",
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
    files: [
      {
        path: "ui/root-container.tsx",
        target: `${TARGET_BASE_PATH}/root-container.tsx`,
        type: "registry:ui",
      },
    ],
    name: "root-container",
    registryDependencies: ["media-provider"],
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
    registryDependencies: ["media-provider", "use-seek", "use-player"],
    type: "registry:ui",
  },
  {
    categories: ["pro"],
    files: [
      {
        path: "ui/pip-control.tsx",
        target: "components/limeplay/pro/pip-control.tsx",
        type: "registry:ui",
      },
    ],
    name: "pip-control",
    registryDependencies: ["media-provider"],
    type: "registry:ui",
  },
]
