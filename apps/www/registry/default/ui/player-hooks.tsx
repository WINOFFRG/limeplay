import React from "react"

import { useShakaPlayer } from "@/registry/default/hooks/use-shaka-player"

export const PlayerHooks = React.memo(() => {
  useShakaPlayer()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
