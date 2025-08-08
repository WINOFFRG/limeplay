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
    registryDependencies: ["create-media-store"],
    files: [
      {
        path: "ui/media-provider.tsx",
        type: "registry:ui",
        target: "components/player/media-provider.tsx",
      },
    ],
    cssVars: {
      dark: {
        "lp-primary": "oklch(0.205 0 0)",
        "lp-primary-foreground": "oklch(0.985 0 0)",
        "lp-accent": "oklch(0.97 0 0)",
      },
      light: {
        "lp-primary": "oklch(0.205 0 0)",
        "lp-primary-foreground": "oklch(0.985 0 0)",
        "lp-accent": "oklch(0.269 0 0)",
      },
    },
    css: {
      "@utility focus-area": {
        position: "relative",
        "&::before": {
          position: "absolute",
          content: '""',
          inset: "calc(var(--y) * 1px) calc(var(--x) * 1px)",
        },
      },
      "@utility focus-area-x-*": {
        "--x": "--value(number)",
      },
      "@utility focus-area-y-*": {
        "--y": "--value(number)",
      },
      "@utility -focus-area-x-*": {
        "--x": "--value(number) * -1",
      },
      "@utility -focus-area-y-*": {
        "--y": "--value(number) * -1",
      },
    },
  },
  {
    name: "player-layout",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs", "@radix-ui/react-slot"],
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "ui/player-layout.tsx",
        type: "registry:ui",
        target: "components/player/player-layout.tsx",
      },
    ],
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
    cssVars: {
      theme: {
        "lp-timeline-track-height": "4px",
        "lp-timeline-track-height-active": "7px",
      },
      light: {
        "lp-timeline-buffered-color": "oklch(0.985 0 0 / 0.4)",
      },
      dark: {
        "lp-timeline-buffered-color": "oklch(0.985 0 0 / 0.4)",
      },
    },
  },
  {
    name: "limeplay-logo",
    type: "registry:ui",
    files: [
      {
        path: "ui/limeplay-logo.tsx",
        type: "registry:ui",
      },
    ],
  },
]
