import { type Registry } from "shadcn/registry";

export const hooks: Registry["items"] = [
  {
    name: "use-player-root-store",
    type: "registry:hook",
    dependencies: ["zustand"],
    files: [
      {
        path: "hooks/use-player-root-store.ts",
        type: "registry:hook",
      },
    ],
  },
];
