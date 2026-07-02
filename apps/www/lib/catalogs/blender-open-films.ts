import type shaka from "shaka-player"

import { z } from "zod"

import type { CatalogBaseAsset } from "@/lib/catalogs/types"

import { createTimeoutSignal } from "@/lib/catalogs/utils"

export const BLENDER_OPEN_FILMS_PLAYLIST_ID = "blender-open-films"

const BLENDER_API_BASE_URL = "https://limeplay.winoffrg.workers.dev/api/blender"
const BLENDER_STREAM_TIMEOUT_MS = 10_000

export interface BlenderOpenFilmAsset extends CatalogBaseAsset {
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
  thumbnail?: string
}

export interface BlenderStreamResponse extends BlenderPlaylistItem {
  captions?: BlenderStreamCaption[]
  links?: Record<string, string | undefined>
  playback: {
    hls: string
    mimeType?: string
  }
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

interface BlenderStreamCaption {
  kind?: TextTrackKind
  label: string
  language: string
  mimeType?: string
  url: string
}

const BlenderOpenFilmImagesSchema = z.object({
  backdrop: z.string().optional(),
  logo: z.string().optional(),
  poster: z.string().optional(),
  thumbnail: z.string().optional(),
})

const BlenderPlaylistItemSchema = z.object({
  description: z.string().optional(),
  duration: z.number().optional(),
  id: z.string(),
  images: BlenderOpenFilmImagesSchema.optional(),
  subtitle: z.string().optional(),
  title: z.string(),
  year: z.number().optional(),
})

const BlenderPlaylistResponseSchema = z.object({
  count: z.number(),
  items: z.array(BlenderPlaylistItemSchema),
  title: z.string(),
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

export async function fetchBlenderOpenFilmAssets(
  signal?: AbortSignal
): Promise<BlenderOpenFilmAsset[]> {
  const combinedSignal = createTimeoutSignal(signal, BLENDER_STREAM_TIMEOUT_MS)
  const response = await fetch(`${BLENDER_API_BASE_URL}/playlist`, {
    signal: combinedSignal,
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch Blender playlist: ${response.statusText}`)
  }

  const playlist = BlenderPlaylistResponseSchema.parse(await response.json())

  return playlist.items.map(toBlenderOpenFilmAsset)
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

export function isBlenderOpenFilmAsset(
  asset: unknown
): asset is BlenderOpenFilmAsset {
  if (!asset || typeof asset !== "object") return false

  return (asset as { source?: unknown }).source === "blender-open-film"
}

function toBlenderOpenFilmAsset(
  item: BlenderPlaylistItem
): BlenderOpenFilmAsset {
  return {
    description: item.description,
    duration: item.duration,
    id: item.id,
    images: item.images,
    poster: item.images?.thumbnail ?? item.images?.poster,
    source: "blender-open-film",
    subtitle: item.subtitle,
    title: item.title,
    year: item.year,
  }
}
