import { type Registry } from "shadcn/registry";

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "create-media-store",
    type: "registry:lib",
    dependencies: ["zustand"],
    files: [
      {
        path: "lib/create-media-store.ts",
        type: "registry:lib",
      },
      {
        path: "hooks/use-player-root-store.ts",
        type: "registry:hook",
      },
    ],
  },
];
