import { z } from "zod"

import type { CatalogBaseAsset } from "@/lib/catalogs/types"

import { createTimeoutSignal, throwIfAborted } from "@/lib/catalogs/utils"

export const APPLE_MUSIC_CHARTS_PLAYLIST_ID = "apple-music-charts"

const APPLE_MUSIC_API_BASE_URL =
  "https://limeplay.winoffrg.workers.dev/api/catalog/am"
const APPLE_MUSIC_CHARTS_TIMEOUT_MS = 10_000
const DEFAULT_APPLE_MUSIC_LOCALE = "en-US"
const DEFAULT_APPLE_MUSIC_STOREFRONT = "us"

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

export interface AppleMusicChartAsset extends CatalogBaseAsset {
  albumName?: string
  artistName?: string
  duration?: number
  genre?: string
  source: "apple-music-chart"
  url?: string
}

export interface AppleMusicChartPage {
  assets: AppleMusicChartAsset[]
  nextPage?: number
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

export async function fetchAppleMusicChartAssetsPage(
  page: number,
  signal?: AbortSignal
): Promise<AppleMusicChartPage> {
  const { locale, storefront } = getAppleMusicLocaleHeaders()
  const combinedSignal = createTimeoutSignal(
    signal,
    APPLE_MUSIC_CHARTS_TIMEOUT_MS
  )

  const chart = await fetchAppleMusicChartPage({
    locale,
    page,
    signal: combinedSignal,
    storefront,
  })

  return {
    assets: chart.items
      .filter((item) => Boolean(item.previewUrl))
      .map(toAppleMusicChartAsset),
    nextPage: chart.nextPage,
  }
}

async function fetchAppleMusicChartPage({
  locale,
  page,
  signal,
  storefront,
}: {
  locale: string
  page: number
  signal?: AbortSignal
  storefront: string
}) {
  const response = await fetch(
    `${APPLE_MUSIC_API_BASE_URL}/charts?page=${page}`,
    {
      headers: {
        "x-locale": locale,
        "x-storefront": storefront,
      },
      signal,
    }
  )
  throwIfAborted(signal)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Apple Music charts page ${page}: ${response.statusText}`
    )
  }

  const responseJson: unknown = await response.json()
  throwIfAborted(signal)

  const chart = AppleMusicChartsResponseSchema.safeParse(responseJson)
  if (!chart.success) {
    throw new Error(
      `Invalid Apple Music charts page ${page} response: ${chart.error}`
    )
  }

  return chart.data
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
