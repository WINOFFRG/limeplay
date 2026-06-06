import type shaka from "shaka-player"

import { z } from "zod"

import type { StreamPanelPlayerType } from "@/components/stream-panel/use-stream-panel"
import type { Asset } from "@/registry/default/hooks/use-asset"

export interface AppleMusicArtwork {
  bgColor?: string
  height?: number
  templateUrl?: string
  textColor1?: string
  textColor2?: string
  textColor3?: string
  textColor4?: string
  url?: string
  width?: number
}

export interface AppleMusicChartAsset extends Asset {
  albumName?: string
  artistName?: string
  duration?: number
  genre?: string
  source: "apple-music-chart"
  url?: string
}

export interface BlenderOpenFilmAsset extends Asset {
  duration?: number
  images?: BlenderOpenFilmImages
  source: "blender-open-film"
  subtitle?: string
  year?: number
}
export interface BlenderOpenFilmImages {
  backdrop?: string
  logo?: string
  poster?: string
}

export interface BlenderStreamResponse extends BlenderPlaylistItem {
  captions?: BlenderStreamCaption[]
  links?: Record<string, string | undefined>
  playback: {
    hls: string
    mimeType?: string
  }
}

export interface StreamPanelPlaylistPreset {
  count?: number
  description: string
  id: string
  name: string
  type: StreamPanelPlayerType
}

interface AppleMusicChartItem {
  albumName?: string
  artistName?: string
  artwork?: AppleMusicArtwork
  durationMs?: number
  id: string
  previewUrl?: string
  title: string
  url?: string
}

interface BlenderPlaylistItem {
  description?: string
  duration?: number
  id: string
  images?: BlenderOpenFilmImages
  subtitle?: string
  title: string
  year?: number
}

interface BlenderPlaylistResponse {
  count: number
  items: BlenderPlaylistItem[]
  title: string
}

interface BlenderStreamCaption {
  kind?: TextTrackKind
  label: string
  language: string
  mimeType?: string
  url: string
}

export const APPLE_MUSIC_CHARTS_PLAYLIST_ID = "apple-music-charts"

const BLENDER_OPEN_FILMS_PLAYLIST_ID = "blender-open-films"

const BLENDER_API_BASE_URL = "https://limeplay.winoffrg.workers.dev/api/blender"
const APPLE_MUSIC_API_BASE_URL =
  "https://limeplay.winoffrg.workers.dev/api/catalog/am"
const APPLE_MUSIC_CHARTS_TIMEOUT_MS = 10_000
const BLENDER_STREAM_TIMEOUT_MS = 10_000
const DEFAULT_APPLE_MUSIC_LOCALE = "en-US"
const DEFAULT_APPLE_MUSIC_STOREFRONT = "us"

const AppleMusicArtworkSchema = z.object({
  bgColor: z.string().optional(),
  height: z.number().optional(),
  templateUrl: z.string().optional(),
  textColor1: z.string().optional(),
  textColor2: z.string().optional(),
  textColor3: z.string().optional(),
  textColor4: z.string().optional(),
  url: z.string().optional(),
  width: z.number().optional(),
})

const AppleMusicChartItemSchema = z.object({
  albumName: z.string().optional(),
  artistName: z.string().optional(),
  artwork: AppleMusicArtworkSchema.optional(),
  durationMs: z.number().optional(),
  id: z.string(),
  previewUrl: z.string().optional(),
  title: z.string(),
  url: z.string().optional(),
})

const AppleMusicChartsResponseSchema = z.object({
  items: z.array(AppleMusicChartItemSchema),
  nextPage: z.number().optional(),
  page: z.number(),
})

const BlenderOpenFilmImagesSchema = z.object({
  backdrop: z.string().optional(),
  logo: z.string().optional(),
  poster: z.string().optional(),
})

const BlenderStreamCaptionSchema = z.object({
  kind: z
    .enum(["captions", "chapters", "descriptions", "metadata", "subtitles"])
    .optional(),
  label: z.string(),
  language: z.string(),
  mimeType: z.string().optional(),
  url: z.string(),
})

const BlenderStreamResponseSchema = z.object({
  captions: z.array(BlenderStreamCaptionSchema).optional(),
  description: z.string().optional(),
  duration: z.number().optional(),
  id: z.string(),
  images: BlenderOpenFilmImagesSchema.optional(),
  links: z.record(z.string(), z.string().optional()).optional(),
  playback: z.object({
    hls: z.string(),
    mimeType: z.string().optional(),
  }),
  subtitle: z.string().optional(),
  title: z.string(),
  year: z.number().optional(),
})

const STREAM_PANEL_PLAYLIST_PRESETS: StreamPanelPlaylistPreset[] = [
  {
    count: 17,
    description: "Open movies from Blender Studio",
    id: BLENDER_OPEN_FILMS_PLAYLIST_ID,
    name: "Blender Open Films",
    type: "video",
  },
  {
    description: "Top songs from Apple Music for your region",
    id: APPLE_MUSIC_CHARTS_PLAYLIST_ID,
    name: "Apple Music Charts",
    type: "audio",
  },
]

export async function addBlenderCaptions(
  player: shaka.Player,
  stream: BlenderStreamResponse
): Promise<void> {
  if (!stream.captions || stream.captions.length === 0) return

  const captionResults = await Promise.allSettled(
    stream.captions.map((caption) =>
      player.addTextTrackAsync(
        caption.url,
        caption.language,
        caption.kind ?? "subtitles",
        caption.mimeType ?? "text/vtt",
        undefined,
        caption.label
      )
    )
  )

  captionResults.forEach((result, index) => {
    if (result.status === "fulfilled") return

    const caption = stream.captions?.[index]
    console.warn("Failed to add Blender caption track:", {
      error: result.reason,
      label: caption?.label,
      url: caption?.url,
    })
  })
}

export async function fetchBlenderStream(
  assetId: string,
  signal?: AbortSignal
): Promise<BlenderStreamResponse> {
  const combinedSignal = createTimeoutSignal(signal, BLENDER_STREAM_TIMEOUT_MS)
  const response = await fetch(`${BLENDER_API_BASE_URL}/stream/${assetId}`, {
    signal: combinedSignal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Blender stream: ${response.statusText}`)
  }

  return BlenderStreamResponseSchema.parse(await response.json())
}

export async function fetchPlaylistPresetAssets(
  playlistId: string,
  signal?: AbortSignal
): Promise<Asset[]> {
  if (playlistId === APPLE_MUSIC_CHARTS_PLAYLIST_ID) {
    return fetchAppleMusicChartAssets(signal)
  }

  if (playlistId !== BLENDER_OPEN_FILMS_PLAYLIST_ID) {
    throw new Error(`Unknown playlist preset "${playlistId}".`)
  }
  const response = await fetch(`${BLENDER_API_BASE_URL}/playlist`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch Blender playlist: ${response.statusText}`)
  }

  const playlist = (await response.json()) as BlenderPlaylistResponse

  return playlist.items.map(toBlenderOpenFilmAsset)
}

export function getPlaylistPresetsForType(
  playerType: StreamPanelPlayerType
): StreamPanelPlaylistPreset[] {
  return STREAM_PANEL_PLAYLIST_PRESETS.filter(
    (playlist) => playlist.type === playerType
  )
}

export function isBlenderOpenFilmAsset(
  asset: Asset
): asset is BlenderOpenFilmAsset {
  return "source" in asset && asset.source === "blender-open-film"
}

function createTimeoutSignal(
  signal: AbortSignal | undefined,
  timeoutMs: number
): AbortSignal | undefined {
  if (typeof AbortSignal.timeout !== "function") return signal

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  if (!signal) return timeoutSignal
  return AbortSignal.any([signal, timeoutSignal])
}

async function fetchAppleMusicChartAssets(
  signal?: AbortSignal
): Promise<AppleMusicChartAsset[]> {
  const { locale, storefront } = getAppleMusicLocaleHeaders()
  const combinedSignal = createTimeoutSignal(
    signal,
    APPLE_MUSIC_CHARTS_TIMEOUT_MS
  )
  const response = await fetch(`${APPLE_MUSIC_API_BASE_URL}/charts?page=1`, {
    headers: {
      "x-locale": locale,
      "x-storefront": storefront,
    },
    signal: combinedSignal,
  })
  throwIfAborted(combinedSignal)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Apple Music charts: ${response.statusText}`
    )
  }

  const responseJson: unknown = await response.json()
  throwIfAborted(combinedSignal)

  const chart = AppleMusicChartsResponseSchema.safeParse(responseJson)
  if (!chart.success) {
    throw new Error(`Invalid Apple Music charts response: ${chart.error}`)
  }

  return chart.data.items
    .filter((item) => Boolean(item.previewUrl))
    .map(toAppleMusicChartAsset)
}

function getAppleMusicLocaleHeaders(): { locale: string; storefront: string } {
  const locale = getUserLocale()
  const country = getLocaleCountry(locale)

  return {
    locale,
    storefront: country?.toLowerCase() ?? DEFAULT_APPLE_MUSIC_STOREFRONT,
  }
}

function getLocaleCountry(locale: string): string | undefined {
  try {
    const parsedLocale = new Intl.Locale(locale)
    return parsedLocale.region ?? parsedLocale.maximize().region
  } catch {
    return locale.match(/[-_]([A-Za-z]{2})\b/)?.[1]?.toUpperCase()
  }
}

function getUserLocale(): string {
  const browserLocale =
    typeof navigator === "undefined"
      ? undefined
      : (navigator.languages.find(Boolean) ?? navigator.language)

  const resolvedLocale =
    browserLocale ?? Intl.DateTimeFormat().resolvedOptions().locale

  return normalizeLocale(resolvedLocale)
}

function normalizeLocale(locale: string | undefined): string {
  if (!locale) return DEFAULT_APPLE_MUSIC_LOCALE

  const normalizedLocale = locale.replaceAll("_", "-")
  try {
    return (
      Intl.getCanonicalLocales(normalizedLocale)[0] ??
      DEFAULT_APPLE_MUSIC_LOCALE
    )
  } catch {
    return DEFAULT_APPLE_MUSIC_LOCALE
  }
}

function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return

  throw new DOMException("Aborted", "AbortError")
}

function toAppleMusicChartAsset(
  item: AppleMusicChartItem
): AppleMusicChartAsset {
  return {
    albumName: item.albumName,
    artistName: item.artistName,
    description: item.albumName,
    duration: item.durationMs,
    id: item.id,
    poster: item.artwork?.url,
    source: "apple-music-chart",
    src: item.previewUrl,
    title: item.title,
    url: item.url,
  }
}

function toBlenderOpenFilmAsset(
  item: BlenderPlaylistItem
): BlenderOpenFilmAsset {
  return {
    description: item.description,
    duration: item.duration,
    id: item.id,
    images: item.images,
    poster: item.images?.backdrop ?? item.images?.poster,
    source: "blender-open-film",
    subtitle: item.subtitle,
    title: item.title,
    year: item.year,
  }
}
