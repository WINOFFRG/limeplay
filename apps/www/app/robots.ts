import type { MetadataRoute } from "next"

import { PROD_BASE_HOST } from "@/lib/constants"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/static/chunks/"],
    },
    sitemap: `${PROD_BASE_HOST}/sitemap.xml`,
  }
}
