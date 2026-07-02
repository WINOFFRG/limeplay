import { type Registry } from "shadcn/schema"

const VIDEO_PLAYER_SRC_URL = "blocks/video-player"

export const blocks: Registry["items"] = [
  {
    author: "Rohan Gupta (@winoffrg)",
    dependencies: [
      "@phosphor-icons/react",
      "@base-ui/react",
      "@radix-ui/react-toggle",
      "zustand",
      "shaka-player@^4",
      "lodash.clamp",
    ],
    description: "Modern seamless flat video player",
    files: [
      {
        path: `${VIDEO_PLAYER_SRC_URL}/player.tsx`,
        target: "components/video-player/player.tsx",
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/styles.css`,
        target: "components/video-player/styles.css",
        type: "registry:style",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/player-root-container.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/player-error-screen.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/top-overlay-container.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/volume-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/playback-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/volume-slider-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/timeline-slider-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/bottom-controls.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/button.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/lib/media-kit.ts`,
        type: "registry:lib",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/playlist.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/playlist-navigation-controls.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/captions-state-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/playback-rate-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/ui/toggle.tsx`,
        target: "components/ui/toggle.tsx",
        type: "registry:ui",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/volume-group-control.tsx`,
        type: "registry:component",
      },
      {
        path: `${VIDEO_PLAYER_SRC_URL}/components/pip-control.tsx`,
        type: "registry:component",
      },
    ],
    meta: {
      iframeHeight: "750px",
      props: {
        source:
          "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
      },
    },
    name: "video-player",
    registryDependencies: [
      "https://bazza.dev/r/hit-area",
      "dropdown-menu",
      "player-layout",
      "media",
      "media-provider",
      "mute-control",
      "playback-control",
      "picture-in-picture-control",
      "timeline-control",
      "volume-control",
      "use-timeline",
      "use-volume",
      "use-player",
      "use-track-events",
      "utils",
      "error-screen",
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
      "use-media",
      "use-controls-visibility",
      "use-playback-source",
    ],
    type: "registry:block",
  },
  {
    author: "Rohan Gupta (@winoffrg)",
    dependencies: [
      "@phosphor-icons/react",
      "@radix-ui/react-slot",
      "motion",
      "zustand",
      "shaka-player@^4",
    ],
    description: "Compact audio player with playlist support",
    files: [
      {
        path: "blocks/audio-player/player.tsx",
        target: "components/audio-player/player.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/lib/media-kit.ts",
        type: "registry:lib",
      },
      {
        path: "blocks/audio-player/components/audio-source.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/controls.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/playback-controls.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/action-controls.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/playback-mode-controls.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/volume-group-control.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/fixed-timeline-control.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/track-info.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/playlist.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/components/icons.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/hooks/use-playlist-asset.ts",
        type: "registry:hook",
      },
      {
        path: "blocks/audio-player/components/button.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/audio-player/styles.css",
        target: "components/audio-player/styles.css",
        type: "registry:style",
      },
    ],
    meta: {
      iframeHeight: "100px",
    },
    name: "audio-player",
    registryDependencies: [
      "https://bazza.dev/r/hit-area",
      "media-provider",
      "media",
      "root-container",
      "timeline-control",
      "timeline-labels",
      "mute-control",
      "volume-control",
      "playback-control",
      "dropdown-menu",
      "toggle-group",
      "use-player",
      "use-playback",
      "use-volume",
      "use-timeline",
      "use-captions",
      "use-playlist",
      "use-asset",
      "use-media",
      "use-playback-source",
      "limeplay-logo",
      "utils",
    ],
    title: "Audio Player",
    type: "registry:block",
  },
]
