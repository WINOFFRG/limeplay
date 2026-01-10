import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    files: [
      {
        path: "examples/player-root-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "player-root-demo",
    registryDependencies: [
      "player-layout",
      "media-provider",
      "media",
      "custom-demo-controls",
      "player-hooks-demo",
      "limeplay-logo",
      "fallback-poster",
      "root-container",
      "media-provider",
    ],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/fallback-poster-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "fallback-poster-demo",
    registryDependencies: ["fallback-poster", "limeplay-logo"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/playback-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "playback-state-control-demo",
    registryDependencies: ["media-provider", "playback-control"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/volume-slider-control-horizontal-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "volume-slider-control-horizontal-demo",
    registryDependencies: ["volume-control", "volume-state-control-demo"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/volume-slider-control-vertical-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "volume-slider-control-vertical-demo",
    registryDependencies: ["volume-control", "volume-state-control-demo"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/volume-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "volume-state-control-demo",
    registryDependencies: ["media-provider", "mute-control"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/timeline-control-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "timeline-control-demo",
    registryDependencies: [
      "media-provider",
      "timeline-control",
      "timeline-labels",
    ],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/timeline-labels-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "timeline-labels-demo",
    registryDependencies: [
      "media-provider",
      "timeline-control",
      "timeline-labels",
      "use-timeline",
    ],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/captions-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "captions-state-control-demo",
    registryDependencies: ["media-provider", "captions", "use-playback"],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/playback-rate-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "playback-rate-demo",
    registryDependencies: [
      "media-provider",
      "playback-rate",
      "use-playback-rate",
    ],
    type: "registry:example",
  },
  {
    files: [
      {
        path: "examples/seek-control-demo.tsx",
        type: "registry:example",
      },
    ],
    name: "seek-control-demo",
    registryDependencies: ["media-provider", "seek-controls"],
    type: "registry:example",
  },
]
