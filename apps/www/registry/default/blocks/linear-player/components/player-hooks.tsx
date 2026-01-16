"use client"

import React from "react"

import { useCaptionsStates } from "@/registry/default/hooks/use-captions"
import { usePictureInPictureStates } from "@/registry/default/hooks/use-picture-in-picture"
import { usePlaybackStates } from "@/registry/default/hooks/use-playback"
import { usePlaybackRateStates } from "@/registry/default/hooks/use-playback-rate"
import { usePlayerStates } from "@/registry/default/hooks/use-player"
import { usePlaylistStates } from "@/registry/default/hooks/use-playlist"
import { useTimelineStates } from "@/registry/default/hooks/use-timeline"
import { useVolumeStates } from "@/registry/default/hooks/use-volume"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  usePlaybackStates()
  useTimelineStates()
  useVolumeStates()
  useCaptionsStates()
  usePlaybackRateStates()
  usePlaylistStates()
  usePictureInPictureStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
