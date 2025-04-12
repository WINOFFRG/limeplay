import { type Registry } from "shadcn/registry"

export const ui: Registry["items"] = [
  {
    name: "mute-control",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/mute-control.tsx",
        type: "registry:ui",
      },
    ],
    // tailwind: {
    //   config: {
    //     theme: {
    //       extend: {
    //         keyframes: {
    //           "accordion-down": {
    //             from: { height: "0" },
    //             to: { height: "var(--radix-accordion-content-height)" },
    //           },
    //           "accordion-up": {
    //             from: { height: "var(--radix-accordion-content-height)" },
    //             to: { height: "0" },
    //           },
    //         },
    //         animation: {
    //           "accordion-down": "accordion-down 0.2s ease-out",
    //           "accordion-up": "accordion-up 0.2s ease-out",
    //         },
    //       },
    //     },
    //   },
    // },
  },
]
