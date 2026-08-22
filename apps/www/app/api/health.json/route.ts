import { API_DEPLOYMENT_MARKER_DOCUMENT } from "@/lib/api-spec"

export const dynamic = "force-static"

export function GET() {
  return Response.json(API_DEPLOYMENT_MARKER_DOCUMENT, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
