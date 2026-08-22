export const dynamic = "force-static"

export function GET() {
  return Response.json(
    {
      service: "Limeplay Agent API",
      status: "ok",
      version: "1.0.0",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  )
}
