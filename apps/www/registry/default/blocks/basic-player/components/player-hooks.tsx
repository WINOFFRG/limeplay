"use client"

import React from "react"

import { usePlayerStates } from "@/registry/default/hooks/use-player"
import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"

export const PlayerHooks = React.memo(() => {
  useShakaPlayer()
  usePlayerStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
