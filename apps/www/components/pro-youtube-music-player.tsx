"use client"

import dynamic from "next/dynamic"

const YouTubeMusicPlayer = dynamic(
  () =>
    import("@/registry/pro/blocks/youtube-music/components/media-player")
      .then((mod) => mod.YouTubeMusicPlayer)
      .catch(() => {
        return () => null
      }),
  {
    loading: () => null,
    ssr: false,
  }
)

export function ProYouTubeMusicPlayer() {
  return (
    <div className="dark">
      <YouTubeMusicPlayer />
    </div>
  )
}
