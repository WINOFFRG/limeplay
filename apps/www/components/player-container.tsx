"use client"

import { useSearchParams } from "next/navigation"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

export function PlayerContainer() {
  const searchParams = useSearchParams()
  const playbackUrl =
    searchParams.get("playbackUrl") ??
    "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  const debug = searchParams.get("debug") === "true"

  return <LinearMediaPlayer src={playbackUrl} debug={debug} />
}
