import { type Registry } from "shadcn/registry"

export const examples: Registry["items"] = [
  {
    name: "playback-state-control",
    type: "registry:example",
    registryDependencies: ["media-provider", "button"],
    files: [
      {
        path: "examples/playback-state-control.tsx",
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
