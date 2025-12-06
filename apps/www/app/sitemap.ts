import type { MetadataRoute } from "next"

import { PROD_BASE_HOST } from "@/lib/constants"
import { source } from "@/lib/source"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = PROD_BASE_HOST

  const staticPages = [
    {
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 1,
      url: baseUrl,
    },
    {
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 1,
      url: `${baseUrl}/docs`,
    },
  ]

  const docsPages = source.getPages().map((page) => ({
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
    priority: 0.9,
    url: `${baseUrl}${page.url}`,
  }))

  return [...staticPages, ...docsPages]
}
