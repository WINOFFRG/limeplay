import { type Registry } from "shadcn/registry";

const BASE_SRC_URL = "blocks/linear-player";

export const blocks: Registry["items"] = [
  {
    name: "linear-player",
    type: "registry:block",
    dependencies: ["zustand", "shaka-player", "motion"],
    registryDependencies: ["media"],
    files: [
      {
        path: `${BASE_SRC_URL}/media-player.tsx`,
        type: "registry:ui",
        target: "components/linear-player/media-player.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/volume-state-control.tsx`,
        type: "registry:ui",
        target: "components/linear-player/components/volume-state-control.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/playback-state-control.tsx`,
        type: "registry:ui",
        target:
          "components/linear-player/components/playback-state-control.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/volume-slider-control.tsx`,
        type: "registry:ui",
        target: "components/linear-player/components/volume-slider-control.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/timeline-slider-control.tsx`,
        type: "registry:ui",
        target:
          "components/linear-player/components/timeline-slider-control.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/motion-container.tsx`,
        type: "registry:ui",
        target: "components/linear-player/components/motion-container.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/custom-player-wrapper.tsx`,
        type: "registry:ui",
        target: "components/linear-player/components/custom-player-wrapper.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/bottom-controls.tsx`,
        type: "registry:ui",
        target: "components/linear-player/components/bottom-controls.tsx",
      },
    ],
  },
];
