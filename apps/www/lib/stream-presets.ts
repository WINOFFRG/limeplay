export interface StreamPreset {
  description?: string
  format: "dash" | "hls" | "progressive"
  id: string
  name: string
  poster?: string
  src: string
  tags?: string[]
  type: "audio" | "video"
}

export const VIDEO_PRESETS: StreamPreset[] = [
  {
    description: "Mux HLS stream — animation short film",
    format: "hls",
    id: "mux-big-buck-bunny",
    name: "Big Buck Bunny",
    poster: "https://files.vidstack.io/sprite-fight/poster.webp",
    src: "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
    tags: ["hls", "vod"],
    type: "video",
  },
  {
    description: "Apple advanced HLS — Dolby Vision + Atmos",
    format: "hls",
    id: "apple-advanced-hls",
    name: "Apple Advanced Stream",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8",
    tags: ["hls", "dolby", "hdr"],
    type: "video",
  },
  {
    description: "Apple HEVC HLS test stream",
    format: "hls",
    id: "apple-bipbop-hls",
    name: "Apple Bipbop (HLS)",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8",
    tags: ["hls", "hevc", "vod"],
    type: "video",
  },
  {
    description: "DASH-IF test vector — Big Buck Bunny 30fps",
    format: "dash",
    id: "dash-if-tears",
    name: "Tears of Steel (DASH)",
    src: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
    tags: ["dash", "vod"],
    type: "video",
  },
  {
    description: "Bitmovin DASH demo — Art of Motion",
    format: "dash",
    id: "bitmovin-dash",
    name: "Bitmovin Art of Motion (DASH)",
    src: "https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    tags: ["dash", "vod"],
    type: "video",
  },
  {
    description: "DASH-IF live stream simulator",
    format: "dash",
    id: "dash-if-live",
    name: "DASH-IF Live Sim (DASH)",
    src: "https://livesim2.dashif.org/livesim2/testpic_2s/Manifest.mpd",
    tags: ["dash", "live"],
    type: "video",
  },
  {
    description: "Progressive MP4 — no adaptive streaming",
    format: "progressive",
    id: "mp4-bunny-progressive",
    name: "Big Buck Bunny (MP4)",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    tags: ["progressive", "vod"],
    type: "video",
  },
  {
    description: "Progressive MP4 — Elephants Dream",
    format: "progressive",
    id: "mp4-elephants-dream",
    name: "Elephants Dream (MP4)",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    tags: ["progressive", "vod"],
    type: "video",
  },
]

export const AUDIO_PRESETS: StreamPreset[] = [
  {
    description: "Apple HLS audio-capable stream",
    format: "hls",
    id: "audio-hls-aac",
    name: "HLS Audio (AAC)",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
    tags: ["hls", "audio"],
    type: "audio",
  },
]

export function getPresetById(id: string): StreamPreset | undefined {
  return [...VIDEO_PRESETS, ...AUDIO_PRESETS].find((p) => p.id === id)
}

export function getPresetsForType(type: "audio" | "video"): StreamPreset[] {
  return type === "audio" ? AUDIO_PRESETS : VIDEO_PRESETS
}

const STORAGE_PREFIX = "limeplay-dial"

export function loadDialState(playerType: "audio" | "video") {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${playerType}`)
    if (!raw) return null
    return JSON.parse(raw) as {
      customConfig?: string
      customFormat?: "dash" | "hls" | "progressive"
      customSrc?: string
      mode: "custom" | "preset"
      presetId?: string
    }
  } catch {
    return null
  }
}

export function saveDialState(
  playerType: "audio" | "video",
  state: {
    customConfig?: string
    customFormat?: "dash" | "hls" | "progressive"
    customSrc?: string
    mode: "custom" | "preset"
    presetId?: string
  }
) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}:${playerType}`,
      JSON.stringify(state)
    )
  } catch {
    // quota exceeded — silently ignore
  }
}
