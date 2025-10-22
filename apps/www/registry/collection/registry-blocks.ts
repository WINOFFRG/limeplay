import { type Registry } from "shadcn/schema"

const BASE_SRC_URL = "blocks/linear-player"

export const blocks: Registry["items"] = [
  {
    name: "linear-player",
    type: "registry:block",
    author: "Rohan Gupta (@winoffrg)",
    description: "Modern seamless flat linear.app Media Player",
    dependencies: [
      "@phosphor-icons/react",
      "@base-ui-components/react",
      "@radix-ui/react-toggle",
      "zustand",
      "shaka-player",
      "lodash.clamp",
    ],
    registryDependencies: [
      "dropdown-menu",
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
      "use-player",
      "use-track-events",
      "utils",
      "create-media-store",
      "fallback-poster",
      "timeline-labels",
      "use-shaka-player",
      "limeplay-logo",
      "root-container",
      "captions",
      "use-captions",
      "use-playback-rate",
    ],
    files: [
      {
        path: `${BASE_SRC_URL}/page.tsx`,
        type: "registry:page",
        target: "app/player/page.tsx",
      },
      {
        path: `${BASE_SRC_URL}/components/media-player.tsx`,
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
        path: `${BASE_SRC_URL}/ui/button.tsx`,
        type: "registry:ui",
      },
      {
        path: `${BASE_SRC_URL}/lib/create-media-store.ts`,
        type: "registry:lib",
      },
      {
        path: `${BASE_SRC_URL}/components/playlist.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/lib/playlist.ts`,
        type: "registry:lib",
      },
      {
        path: `${BASE_SRC_URL}/components/captions-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/playback-rate-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/ui/toggle.tsx`,
        type: "registry:ui",
        target: "components/ui/toggle.tsx",
      },
    ],
    meta: {
      iframeHeight: "750px",
      props: {
        src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
      },
    },
  },
  {
    name: "basic-player",
    type: "registry:block",
    author: "Rohan Gupta (@winoffrg)",
    description: "Limeplay Basic Player",
    dependencies: ["@phosphor-icons/react", "zustand", "shaka-player"],
    registryDependencies: [
      "media-provider",
      "player-layout",
      "root-container",
      "fallback-poster",
      "limeplay-logo",
      "media",
      "utils",
      "button",
      "playback-control",
      "use-player",
      "use-shaka-player",
    ],
    files: [
      {
        path: `blocks/basic-player/page.tsx`,
        type: "registry:page",
        target: "app/player/page.tsx",
      },
      {
        path: `blocks/basic-player/components/media-player.tsx`,
        type: "registry:component",
      },
      {
        path: `blocks/basic-player/components/playback-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `blocks/basic-player/components/player-hooks.tsx`,
        type: "registry:component",
      },
      {
        path: `blocks/basic-player/components/media-element.tsx`,
        type: "registry:component",
      },
    ],
    meta: {
      iframeHeight: "750px",
      props: {
        src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
      },
    },
  },
]
