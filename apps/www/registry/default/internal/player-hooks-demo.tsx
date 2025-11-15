"use client"

import React from "react"

import { useCaptionsStates } from "@/registry/default/hooks/use-captions"
import { usePlaybackRateStates } from "@/registry/default/hooks/use-playback-rate"
import { usePlayerStates } from "@/registry/default/hooks/use-player"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"
import { useTimelineStates } from "@/registry/default/hooks/use-timeline"
import { useVolumeStates } from "@/registry/default/hooks/use-volume"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  useShakaPlayer()
  useVolumeStates()
  useTimelineStates()
  useCaptionsStates()
  usePlaybackRateStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
