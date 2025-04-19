import { type Registry } from "shadcn/registry";

const BASE_SRC_URL = "blocks/linear-player";

export const blocks: Registry["items"] = [
  {
    name: "linear-player",
    type: "registry:block",
    author: "Rohan Gupta (@winoffrg)",
    description: "Modern seamless flat linear.app Media Player",
    dependencies: ["@phosphor-icons/react", "zustand", "shaka-player"],
    registryDependencies: [
      "player-layout",
      "media",
      "media-provider",
      "mute-control",
      "player-hooks",
      "playback-control",
      "timeline-control",
      "button",
      "volume-control",
      "use-timeline-states",
      "use-volume-store",
      "use-timeline-store",
      "use-media-state-store",
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
        path: `${BASE_SRC_URL}/lib/create-media-store.ts`,
        type: "registry:lib",
      },
    ],
  },
];
