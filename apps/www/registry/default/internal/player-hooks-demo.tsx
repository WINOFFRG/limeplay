"use client"

import React from "react"

import { usePlayerStates } from "@/registry/default/hooks/use-player"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"
import { useTimelineStates } from "@/registry/default/hooks/use-timeline"
import { useVolumeStates } from "@/registry/default/hooks/use-volume"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  useShakaPlayer()
  useVolumeStates()
  useTimelineStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
