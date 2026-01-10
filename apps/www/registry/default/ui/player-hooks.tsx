"use client"

import React from "react"

import { usePlayerStates } from "@/registry/default/hooks/use-player"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
