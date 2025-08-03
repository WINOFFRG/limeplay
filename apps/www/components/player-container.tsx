"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

export function PlayerContainer() {
  const searchParams = useSearchParams()
  const playbackUrl =
    searchParams.get("playbackUrl") ??
    "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  const debug = searchParams.get("debug") === "true"

  return (
    <Suspense>
      <LinearMediaPlayer src={playbackUrl} debug={debug} />
    </Suspense>
  )
}
