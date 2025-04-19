"use client"

import React, { useEffect } from "react"
import { useControls } from "leva"

import { LevaControls } from "@/components/leva-controls"
import { CustomDemoControls } from "@/registry/default/internal/custom-demo-controls"
import { Media } from "@/registry/default/ui/media"
import {
  MediaProvider,
  useMediaStore,
} from "@/registry/default/ui/media-provider"
import { PlayerHooks } from "@/registry/default/ui/player-hooks"
import * as Layout from "@/registry/default/ui/player-layout"

function MediaElement() {
  const player = useMediaStore((state) => state.player)

  const { streamUrl } = useControls({
    streamUrl: {
      value:
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
      label: "Stream URL",
    },
  })

  useEffect(() => {
    if (player) {
      try {
        const url = new URL(streamUrl)

        if (url.protocol === "http:" || url.protocol === "https:") {
          player.load(streamUrl)
        } else {
          console.warn("Invalid stream URL protocol. Must be http or https.")
        }
      } catch (error) {
        console.error("Invalid stream URL format:", streamUrl)
      }
    }
  }, [player, streamUrl])

  return (
    <Media
      as="video"
      className="m-0! size-full rounded-lg bg-black object-cover"
      poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
      muted
      autoPlay
    />
  )
}

export function PlayerDemoLayout({ children }: React.PropsWithChildren) {
  return (
    <MediaProvider>
      <PlayerHooks />
      <LevaControls />
      <Layout.RootContainer height={720} width={1280} className="container">
        <Layout.PlayerContainer className="my-16">
          <MediaElement />
          <Layout.ControlsContainer>
            {/* We don't need any overlay controls here as we have custom controls for docs */}
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
        <CustomDemoControls>{children}</CustomDemoControls>
      </Layout.RootContainer>
    </MediaProvider>
  )
}
