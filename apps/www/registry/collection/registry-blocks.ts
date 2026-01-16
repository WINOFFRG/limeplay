import { type Registry } from "shadcn/schema"

const BASE_SRC_URL = "blocks/linear-player"

export const blocks: Registry["items"] = [
  {
    author: "Rohan Gupta (@winoffrg)",
    dependencies: [
      "@phosphor-icons/react",
      "@base-ui/react",
      "@radix-ui/react-toggle",
      "zustand",
      "shaka-player",
      "lodash.clamp",
    ],
    description: "Modern seamless flat linear.app Media Player",
    files: [
      {
        path: `${BASE_SRC_URL}/page.tsx`,
        target: "app/player/page.tsx",
        type: "registry:page",
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
        path: `${BASE_SRC_URL}/components/captions-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/components/playback-rate-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${BASE_SRC_URL}/ui/toggle.tsx`,
        target: "components/ui/toggle.tsx",
        type: "registry:ui",
      },
      {
        path: `${BASE_SRC_URL}/components/volume-group-control.tsx`,
        type: "registry:component",
      },
    ],
    meta: {
      iframeHeight: "750px",
      props: {
        src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
      },
    },
    name: "linear-player",
    registryDependencies: [
      "dropdown-menu",
      "player-layout",
      "media",
      "media-provider",
      "mute-control",
      "player-hooks",
      "playback-control",
      "picture-in-picture-control",
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
      "limeplay-logo",
      "root-container",
      "captions",
      "use-captions",
      "playback-rate",
      "use-playback-rate",
      "use-playback",
      "use-picture-in-picture",
      "use-playlist",
      "use-asset",
    ],
    type: "registry:block",
  },
  {
    author: "Rohan Gupta (@winoffrg)",
    dependencies: ["@phosphor-icons/react", "zustand", "shaka-player"],
    description: "Limeplay Basic Player",
    files: [
      {
        path: `blocks/basic-player/page.tsx`,
        target: "app/player/page.tsx",
        type: "registry:page",
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
    name: "basic-player",
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
      "use-playback",
    ],
    type: "registry:block",
  },
]
