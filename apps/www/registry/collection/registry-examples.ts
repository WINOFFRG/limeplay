import { type Registry } from "shadcn/registry"

export const examples: Registry["items"] = [
  {
    name: "fallback-poster",
    type: "registry:example",
    registryDependencies: ["fallback-poster"],
    files: [
      {
        path: "examples/fallback-poster.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "playback-state-control",
    type: "registry:example",
    registryDependencies: ["media-provider", "playback-control"],
    files: [
      {
        path: "examples/playback-state-control.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "player-demo-root",
    type: "registry:example",
    registryDependencies: ["media-provider", "media", "player-layout"],
    files: [
      {
        path: "examples/player-demo-root.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-slider-control-horizontal",
    type: "registry:example",
    registryDependencies: ["volume-state-control", "volume-control"],
    files: [
      {
        path: "examples/volume-slider-control-horizontal.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-slider-control-vertical",
    type: "registry:example",
    registryDependencies: ["volume-state-control", "volume-control"],
    files: [
      {
        path: "examples/volume-slider-control-vertical.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "volume-state-control",
    type: "registry:example",
    registryDependencies: ["media-provider", "mute-control"],
    files: [
      {
        path: "examples/volume-state-control.tsx",
        type: "registry:example",
      },
    ],
  },
]
