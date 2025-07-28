import { type Registry } from "shadcn/registry"

const BASE_SRC_URL = "blocks/linear-player"

export const blocks: Registry["items"] = [
  {
    name: "linear-player",
    type: "registry:block",
    author: "Rohan Gupta (@winoffrg)",
    description: "Modern seamless flat linear.app Media Player",
    dependencies: [
      "@phosphor-icons/react",
      "@base-ui-components/react/slider",
      "zustand",
      "shaka-player",
      "lodash.clamp",
    ],
    registryDependencies: [
      "player-layout",
      "media",
      "media-provider",
      "mute-control",
      "player-hooks",
      "playback-control",
      "timeline-control",
      "volume-control",
      "use-timeline",
      "use-volume",
      "use-media-state",
      "use-track-events",
      "use-player-root-store",
      "utils",
      "create-media-store",
      "fallback-poster",
      "timeline-labels",
      "use-shaka-player",
    ],
    files: [
      {
        path: `${BASE_SRC_URL}/media-player.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/volume-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/playback-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/volume-slider-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/timeline-slider-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/bottom-controls.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/media-element.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/player-hooks.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/custom-player-wrapper.tsx`,
        type: "registry:component",
      },
    ],
  },
]
