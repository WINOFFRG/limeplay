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
];
