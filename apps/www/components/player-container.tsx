"use client"

import { useSearchParams } from "next/navigation"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

export function PlayerContainer() {
  const searchParams = useSearchParams()
  const playbackUrl =
    searchParams.get("playbackUrl") ??
    "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8"
  const debug = searchParams.get("debug") === "true"

  return <LinearMediaPlayer src={playbackUrl} debug={debug} />
}
