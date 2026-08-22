import type { MetadataRoute } from "next"

import { blocksSource } from "@/lib/blocks-source"
import { SITE_URL } from "@/lib/constants"
import { source } from "@/lib/source"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const canonicalPaths = new Set<string>([
    "/",
    "/developers",
    ...source
      .getPages()
      .filter((page) => page.slugs[0] !== "blocks")
      .map((page) => page.url),
    ...blocksSource.getPages().map((page) => page.url),
  ])

  return [...canonicalPaths]
    .sort((firstPath, secondPath) => firstPath.localeCompare(secondPath))
    .map((path) => ({
      url: path === "/" ? SITE_URL : new URL(path, SITE_URL).toString(),
    }))
}
