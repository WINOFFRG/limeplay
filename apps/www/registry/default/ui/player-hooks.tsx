"use client"

import React from "react"

import { usePlaybackStates } from "@/registry/default/hooks/use-playback"
import { usePlayerStates } from "@/registry/default/hooks/use-player"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  usePlaybackStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
