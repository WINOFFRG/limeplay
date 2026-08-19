export const dynamic = "force-static"
export const revalidate = false

export function GET() {
  const key = process.env.INDEXNOW_KEY

  if (!key) {
    return new Response("IndexNow is not configured.\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, nosnippet",
      },
      status: 404,
    })
  }

  return new Response(`${key}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, nosnippet",
    },
  })
}
