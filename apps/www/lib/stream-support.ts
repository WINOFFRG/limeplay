import type { StreamFeature, StreamPreset } from "./stream-presets"

export interface StreamSupportResult {
  reason?: string
  supported: boolean
}

const DRM_KEY_SYSTEMS: Record<string, string[]> = {
  ClearKey: ["org.w3.clearkey"],
  FairPlay: ["com.apple.fps", "com.apple.fps.1_0"],
  PlayReady: [
    "com.microsoft.playready",
    "com.microsoft.playready.recommendation",
  ],
  Widevine: ["com.widevine.alpha"],
}

const drmSupportCache = new Map<string, boolean>()

function checkManifestSupport(format: StreamPreset["format"]): null | string {
  if (format === "progressive") return null

  if (format === "dash") {
    const hasMse =
      typeof MediaSource !== "undefined" ||
      "ManagedMediaSource" in globalThis
    if (!hasMse) return "DASH requires Media Source Extensions"
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (format === "hls") {
    const hasMse =
      typeof MediaSource !== "undefined" ||
      "ManagedMediaSource" in globalThis

    if (hasMse) {
      const hlsSupported =
        MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E"') ||
        MediaSource.isTypeSupported("video/mp2t")
      if (hlsSupported) return null
    }

    const video = document.createElement("video")
    const canPlay =
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL")
    if (canPlay) return null

    return "HLS is not supported in this browser"
  }

  return null
}

async function probeDrmSupport(feature: string): Promise<boolean> {
  const cached = drmSupportCache.get(feature)
  if (cached !== undefined) return cached

  const keySystemIds = DRM_KEY_SYSTEMS[feature]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!keySystemIds || !navigator.requestMediaKeySystemAccess) {
    drmSupportCache.set(feature, false)
    return false
  }

  const config: MediaKeySystemConfiguration[] = [
    {
      audioCapabilities: [
        { contentType: 'audio/mp4; codecs="mp4a.40.2"' },
      ],
      initDataTypes: ["cenc"],
      videoCapabilities: [
        { contentType: 'video/mp4; codecs="avc1.42E01E"' },
      ],
    },
  ]

  for (const keySystem of keySystemIds) {
    try {
      await navigator.requestMediaKeySystemAccess(keySystem, config)
      drmSupportCache.set(feature, true)
      return true
    } catch {
      // this key system not available
    }
  }

  drmSupportCache.set(feature, false)
  return false
}

const CODEC_CHECKS: Partial<
  Record<StreamFeature, { label: string; mime: string; }>
> = {
  "Dolby Atmos": {
    label: "Dolby Atmos (E-AC-3)",
    mime: 'audio/mp4; codecs="ec-3"',
  },
  "Dolby Vision": {
    label: "Dolby Vision",
    mime: 'video/mp4; codecs="dvh1.08.01"',
  },
  VR: {
    label: "MV-HEVC (VR)",
    mime: 'video/mp4; codecs="hvc1.2.20000000.L153.B0"',
  },
}

function checkCodecSupport(features: StreamFeature[]): null | string {
  if (typeof MediaSource === "undefined") return null

  for (const feature of features) {
    const check = CODEC_CHECKS[feature]
    if (!check) continue

    if (!MediaSource.isTypeSupported(check.mime)) {
      return `${check.label} is not supported in this browser`
    }
  }

  return null
}

const DRM_FEATURES: StreamFeature[] = [
  "Widevine",
  "ClearKey",
  "PlayReady",
  "FairPlay",
]

let supportResultsCache: Map<string, StreamSupportResult> | null = null
let probePromise: null | Promise<void> = null

export function getStreamSupport(preset: StreamPreset): StreamSupportResult {
  if (typeof window === "undefined") return { supported: true }

  const cached = supportResultsCache?.get(preset.id)
  if (cached) return cached

  return computeSupport(preset)
}

export async function initStreamSupport(
  presets: StreamPreset[]
): Promise<void> {
  if (supportResultsCache) return
  if (probePromise) return probePromise

  probePromise = probeAllDrm(presets).then(() => {
    supportResultsCache = new Map()
    for (const preset of presets) {
      supportResultsCache.set(preset.id, computeSupport(preset))
    }
  })
  return probePromise
}

function computeSupport(preset: StreamPreset): StreamSupportResult {
  const manifestIssue = checkManifestSupport(preset.format)
  if (manifestIssue) return { reason: manifestIssue, supported: false }

  const codecIssue = checkCodecSupport(preset.features)
  if (codecIssue) return { reason: codecIssue, supported: false }

  for (const feature of preset.features) {
    if (DRM_FEATURES.includes(feature)) {
      const supported = drmSupportCache.get(feature)
      if (supported === false) {
        return {
          reason: `${feature} DRM is not supported in this browser`,
          supported: false,
        }
      }
    }
  }

  return { supported: true }
}

async function probeAllDrm(presets: StreamPreset[]): Promise<void> {
  const needed = new Set<string>()
  for (const preset of presets) {
    for (const f of preset.features) {
      if (DRM_FEATURES.includes(f)) needed.add(f)
    }
  }
  await Promise.all([...needed].map((f) => probeDrmSupport(f)))
}
