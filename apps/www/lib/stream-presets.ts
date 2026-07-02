export type StreamFeature =
  | "4K"
  | "5.1"
  | "AES-128"
  | "Audio Only"
  | "Captions"
  | "ClearKey"
  | "Dolby Atmos"
  | "Dolby Vision"
  | "FairPlay"
  | "HD"
  | "HDR"
  | "LIVE"
  | "Low Latency"
  | "Multi-Language"
  | "PlayReady"
  | "Subtitles"
  | "Thumbnails"
  | "Trick Play"
  | "VR"
  | "Widevine"

export type StreamGroup =
  | "Audio"
  | "DASH"
  | "DRM"
  | "HLS"
  | "Live"
  | "Progressive"
  | "Special"

export interface StreamPreset {
  config?: Record<string, unknown>
  description?: string
  features: StreamFeature[]
  format: "dash" | "hls" | "progressive"
  group: StreamGroup
  id: string
  poster?: string
  src: string
  thumbnail?: string
  title: string
  type: "audio" | "video"
}

export const STREAM_PRESETS: StreamPreset[] = [
  // ── HLS ────────────────────────────────────────────────────────────────────

  {
    description: "Mux HLS stream — animation short film",
    features: ["HD"],
    format: "hls",
    group: "HLS",
    id: "mux-big-buck-bunny",
    src: "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
    title: "Big Buck Bunny",
    type: "video",
  },
  {
    description: "Apple advanced HLS — Dolby Vision + Atmos, 4K, thumbnails",
    features: [
      "4K",
      "HDR",
      "Dolby Vision",
      "Dolby Atmos",
      "Subtitles",
      "Thumbnails",
      "Trick Play",
    ],
    format: "hls",
    group: "HLS",
    id: "apple-advanced-hls",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8",
    title: "Apple Advanced Stream",
    type: "video",
  },
  {
    description: "Apple HLS test stream with captions",
    features: ["HD", "Captions"],
    format: "hls",
    group: "HLS",
    id: "apple-bipbop-hls",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
    title: "Apple Bipbop",
    type: "video",
  },
  {
    description: "Shaka HLS stream — Big Buck Bunny short film",
    features: ["HD"],
    format: "hls",
    group: "HLS",
    id: "shaka-bbb-dark-truths-hls",
    src: "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8",
    title: "Dark Truths",
    type: "video",
  },

  // ── DASH ───────────────────────────────────────────────────────────────────

  {
    description: "Shaka multi-codec DASH — multiple languages and subtitles",
    features: ["Multi-Language", "Subtitles"],
    format: "dash",
    group: "DASH",
    id: "shaka-angel-one-dash",
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd",
    title: "Angel One",
    type: "video",
  },
  {
    description: "Shaka 4K DASH — Sintel open movie with subtitles",
    features: ["4K", "Subtitles"],
    format: "dash",
    group: "DASH",
    id: "shaka-sintel-4k",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd",
    title: "Sintel 4K",
    type: "video",
  },
  {
    description: "Bitmovin DASH demo with seek thumbnails and chapters",
    features: ["HD", "Thumbnails"],
    format: "dash",
    group: "DASH",
    id: "bitmovin-dash",
    src: "https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    thumbnail:
      "https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/thumbnails/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.vtt",
    title: "Art of Motion",
    type: "video",
  },
  {
    description: "Shaka DASH — Tears of Steel with 5.1 surround audio",
    features: ["HD", "5.1"],
    format: "dash",
    group: "DASH",
    id: "shaka-tears-surround",
    src: "https://storage.googleapis.com/shaka-demo-assets/tos-surround/dash.mpd",
    title: "Tears of Steel",
    type: "video",
  },

  // ── Live ───────────────────────────────────────────────────────────────────

  {
    description: "DASH-IF live stream simulator — 2s segments with UTC timing",
    features: ["LIVE"],
    format: "dash",
    group: "Live",
    id: "dash-if-live",
    src: "https://livesim2.dashif.org/livesim2/utc_head/testpic_2s/Manifest.mpd",
    title: "DASH-IF Live Sim",
    type: "video",
  },
  {
    description: "Shaka DASH live — player source history stream",
    features: ["LIVE", "HD"],
    format: "dash",
    group: "Live",
    id: "shaka-live-dash",
    src: "https://storage.googleapis.com/shaka-live-assets/player-source.mpd",
    title: "Shaka Player History",
    type: "video",
  },
  {
    description: "Shaka HLS live — player source history stream",
    features: ["LIVE", "HD"],
    format: "hls",
    group: "Live",
    id: "shaka-live-hls",
    src: "https://storage.googleapis.com/shaka-live-assets/player-source.m3u8",
    title: "Shaka Player History (HLS)",
    type: "video",
  },
  {
    description: "DASH-IF low-latency live — chunked transfer encoding",
    features: ["LIVE", "Low Latency"],
    format: "dash",
    group: "Live",
    id: "dash-if-ll-live",
    src: "https://livesim2.dashif.org/livesim2/chunkdur_1/ato_7/testpic4_8s/Manifest300.mpd",
    title: "Low Latency DASH",
    type: "video",
  },

  // ── DRM ────────────────────────────────────────────────────────────────────

  {
    config: {
      drm: {
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
      },
    },
    description: "Shaka DASH — Widevine DRM protected, multi-language",
    features: ["Widevine", "Multi-Language", "Subtitles"],
    format: "dash",
    group: "DRM",
    id: "shaka-angel-widevine",
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd",
    title: "Angel One",
    type: "video",
  },
  {
    config: {
      drm: {
        servers: {
          "org.w3.clearkey":
            "https://cwip-shaka-proxy.appspot.com/clearkey?_u3wDe7erb7v8Lqt8A3QDQ=ABEiM0RVZneImaq7zN3u_w",
        },
      },
    },
    description: "Shaka DASH — ClearKey DRM protected, multi-language",
    features: ["ClearKey", "Multi-Language", "Subtitles"],
    format: "dash",
    group: "DRM",
    id: "shaka-angel-clearkey",
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd",
    title: "Angel One",
    type: "video",
  },
  {
    config: {
      drm: {
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
      },
    },
    description: "Shaka HLS — Widevine DRM with surround audio",
    features: ["Widevine", "Multi-Language", "Subtitles", "5.1"],
    format: "hls",
    group: "DRM",
    id: "shaka-angel-hls-widevine",
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine-hls/hls.m3u8",
    title: "Angel One (HLS)",
    type: "video",
  },
  {
    config: {
      drm: {
        advanced: {
          "com.widevine.alpha": {
            serverCertificateUri:
              "https://cwip-shaka-proxy.appspot.com/service-cert",
          },
        },
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
      },
    },
    description: "Shaka 4K DASH — Widevine DRM with server certificate",
    features: ["Widevine", "4K", "Subtitles"],
    format: "dash",
    group: "DRM",
    id: "shaka-sintel-widevine",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd",
    title: "Sintel 4K",
    type: "video",
  },
  {
    description: "Bitmovin HLS — AES-128 encrypted transport stream",
    features: ["AES-128", "HD"],
    format: "hls",
    group: "DRM",
    id: "bitmovin-hls-aes128",
    src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/m3u8s/11331.m3u8",
    title: "Art of Motion",
    type: "video",
  },

  // ── Audio ──────────────────────────────────────────────────────────────────

  {
    description: "Shaka DASH audio-only — Dig the Uke",
    features: ["Audio Only"],
    format: "dash",
    group: "Audio",
    id: "shaka-dig-uke",
    src: "https://storage.googleapis.com/shaka-demo-assets/dig-the-uke-clear/dash.mpd",
    title: "Dig the Uke",
    type: "audio",
  },
  {
    description: "Apple HLS audio-only — raw AAC containerless stream",
    features: ["Audio Only"],
    format: "hls",
    group: "Audio",
    id: "apple-hls-audio-aac",
    src: "https://storage.googleapis.com/shaka-demo-assets/raw-hls-audio-only/manifest.m3u8",
    title: "HLS Audio (AAC)",
    type: "audio",
  },

  // ── Progressive ────────────────────────────────────────────────────────────

  {
    description: "Progressive MP4 — no adaptive streaming",
    features: ["HD"],
    format: "progressive",
    group: "Progressive",
    id: "mp4-bunny-progressive",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big Buck Bunny",
    type: "video",
  },
  {
    description: "Progressive MP4 — Elephants Dream",
    features: ["HD"],
    format: "progressive",
    group: "Progressive",
    id: "mp4-elephants-dream",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephants Dream",
    type: "video",
  },

  // ── Special ────────────────────────────────────────────────────────────────

  {
    description: "Shaka DASH — trick mode track for fast seeking",
    features: ["Trick Play", "Subtitles"],
    format: "dash",
    group: "Special",
    id: "shaka-sintel-trick",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-trickplay/dash.mpd",
    title: "Sintel",
    type: "video",
  },
  {
    description: "DASH-IF 4K with tiled thumbnail tracks for seek preview",
    features: ["4K", "Thumbnails"],
    format: "dash",
    group: "Special",
    id: "dash-if-thumbnails",
    src: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_with_tiled_thumbnails.mpd",
    title: "Big Buck Bunny",
    type: "video",
  },
  {
    description: "Bitmovin DASH VR — equirectangular projection",
    features: ["4K", "VR"],
    format: "dash",
    group: "Special",
    id: "bitmovin-vr",
    src: "https://cdn.bitmovin.com/content/assets/playhouse-vr/mpds/105560.mpd",
    title: "VR Playhouse",
    type: "video",
  },
]

export function getPresetById(id: string): StreamPreset | undefined {
  return STREAM_PRESETS.find((p) => p.id === id)
}

export function getPresetsForType(type: "audio" | "video"): StreamPreset[] {
  return STREAM_PRESETS.filter((p) => p.type === type)
}
