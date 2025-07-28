"use client"

import React from "react"

import { useMediaStates } from "@/registry/default/hooks/use-media-state"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"
import { useTimelineStates } from "@/registry/default/hooks/use-timeline"
import { useVolumeStates } from "@/registry/default/hooks/use-volume"

export const PlayerHooks = React.memo(() => {
  useMediaStates()
  useShakaPlayer()
  useVolumeStates()
  useTimelineStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
