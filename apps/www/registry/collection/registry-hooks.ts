import { type Registry } from "shadcn/registry";

export const hooks: Registry["items"] = [
  {
    name: "use-player-root-store",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-player-root-store.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-volume-states",
    type: "registry:hook",
    registryDependencies: ["media-provider", "utils"],
    files: [
      {
        path: "hooks/use-volume-states.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-media-state-states",
    type: "registry:hook",
    registryDependencies: ["utils", "media-provider"],
    files: [
      {
        path: "hooks/use-media-state-states.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-shaka-player",
    type: "registry:hook",
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "hooks/use-shaka-player.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-timeline-states",
    type: "registry:hook",
    registryDependencies: ["media-provider", "utils"],
    files: [
      {
        path: "hooks/use-timeline-states.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-media-state-store",
    type: "registry:hook",
    registryDependencies: ["media-provider"],
    files: [
      {
        path: "hooks/use-media-state-store.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-timeline-store",
    type: "registry:hook",
    dependencies: ["lodash.clamp"],
    registryDependencies: ["use-player-root-store", "utils"],
    files: [
      {
        path: "hooks/use-timeline-store.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-volume-store",
    type: "registry:hook",
    dependencies: ["lodash.clamp"],
    registryDependencies: ["use-player-root-store"],
    files: [
      {
        path: "hooks/use-volume-store.ts",
        type: "registry:hook",
      },
    ],
  },
];
