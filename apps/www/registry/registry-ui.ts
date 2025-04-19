import { type Registry } from "shadcn/registry";

export const ui: Registry["items"] = [
  {
    name: "mute-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/mute-control.tsx",
        type: "registry:ui",
        target: "components/player/mute-control.tsx",
      },
    ],
  },
  {
    name: "media-provider",
    type: "registry:ui",
    dependencies: ["zustand"],
    files: [
      {
        path: "ui/mute-control.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "player-layout",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-compose-refs"],
    files: [
      {
        path: "ui/player-layout.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/media-provider.tsx",
        type: "registry:ui",
      },
    ],
  },
];
