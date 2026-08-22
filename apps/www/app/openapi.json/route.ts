import { OPENAPI_DOCUMENT } from "@/lib/api-spec"

export const dynamic = "force-static"

export function GET() {
  return Response.json(OPENAPI_DOCUMENT, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
