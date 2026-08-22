import { API_ERROR_DOCUMENT } from "@/lib/api-spec"

export const dynamic = "force-static"

export function GET() {
  return Response.json(API_ERROR_DOCUMENT, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "application/problem+json; charset=utf-8",
    },
  })
}
