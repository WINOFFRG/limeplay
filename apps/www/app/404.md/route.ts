import { buildNotFoundMarkdown } from "@/lib/agent-content"

export const dynamic = "force-static"

export function GET() {
  return new Response(buildNotFoundMarkdown(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
