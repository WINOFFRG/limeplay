import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "player-root-demo",
    type: "registry:example",
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
    files: [
      {
        path: "examples/player-root-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "fallback-poster-demo",
    type: "registry:example",
    registryDependencies: ["fallback-poster", "limeplay-logo"],
    files: [
      {
        path: "examples/fallback-poster-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "playback-state-control-demo",
    type: "registry:example",
    registryDependencies: ["media-provider", "playback-control"],
    files: [
      {
        path: "examples/playback-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-slider-control-horizontal-demo",
    type: "registry:example",
    registryDependencies: ["volume-control", "volume-state-control-demo"],
    files: [
      {
        path: "examples/volume-slider-control-horizontal-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-slider-control-vertical-demo",
    type: "registry:example",
    registryDependencies: ["volume-control", "volume-state-control-demo"],
    files: [
      {
        path: "examples/volume-slider-control-vertical-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-state-control-demo",
    type: "registry:example",
    registryDependencies: ["media-provider", "mute-control"],
    files: [
      {
        path: "examples/volume-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "timeline-control-demo",
    type: "registry:example",
    registryDependencies: [
      "media-provider",
      "timeline-control",
      "timeline-labels",
    ],
    files: [
      {
        path: "examples/timeline-control-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "timeline-labels-demo",
    type: "registry:example",
    registryDependencies: [
      "media-provider",
      "timeline-control",
      "timeline-labels",
      "use-timeline",
    ],
    files: [
      {
        path: "examples/timeline-labels-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "captions-state-control-demo",
    type: "registry:example",
    registryDependencies: ["media-provider", "captions"],
    files: [
      {
        path: "examples/captions-state-control-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
