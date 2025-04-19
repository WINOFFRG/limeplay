import { type Registry } from "shadcn/registry";

const BASE_SRC_URL = "blocks/linear-player";

export const blocks: Registry["items"] = [
  {
    name: "linear-player",
    type: "registry:block",
    author: "Rohan Gupta (@winoffrg)",
    description: "Modern seamless flat linear.app Media Player",
    dependencies: ["@phosphor-icons/react"],
    registryDependencies: [
      "player-layout",
      "media",
      "media-provider",
      "mute-control",
      "player-hooks",
      "playback-control",
      "timeline-control",
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
        path: `${BASE_SRC_URL}/components/motion-container.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/custom-player-wrapper.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/bottom-controls.tsx`,
        type: "registry:component",
      },
    ],
  },
];
