import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `/sitemap.xml`,
  }
}
