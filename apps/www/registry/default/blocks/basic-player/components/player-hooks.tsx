"use client"

import React from "react"

import { useMediaStates } from "@/registry/default/hooks/use-media-state"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"

export const PlayerHooks = React.memo(() => {
  useShakaPlayer()
  useMediaStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
