"use client"

import React from "react"

import { useMediaStates } from "@/registry/default/hooks/use-media-state"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"
import { useTimelineStates } from "@/registry/default/hooks/use-timeline"

export const PlayerHooks = React.memo(() => {
  useShakaPlayer()
  useMediaStates()
  useTimelineStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
