"use client"

import React, { useEffect } from "react"
import { useControls } from "leva"

import { LevaControls } from "@/components/leva-controls"
import { CustomDemoControls } from "@/registry/default/internal/custom-demo-controls"
import { PlayerHooks } from "@/registry/default/internal/player-hooks-demo"
import { Media } from "@/registry/default/ui/media"
import {
  MediaProvider,
  useMediaStore,
} from "@/registry/default/ui/media-provider"
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
      autoPlay={false}
    />
  )
}

interface PlayerDemoLayoutProps extends React.PropsWithChildren {
  type: "overlay" | "block"
}

export function PlayerLayoutDemo({ children, type }: PlayerDemoLayoutProps) {
  return (
    <MediaProvider>
      <LevaControls />
      <Layout.RootContainer height={720} width={1280} className="container p-0">
        <Layout.PlayerContainer className="my-4">
          <MediaElement />
          <PlayerHooks />
          <Layout.ControlsContainer>
            {type === "overlay" && children}
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </Layout.RootContainer>
      {type === "block" && <CustomDemoControls>{children}</CustomDemoControls>}
    </MediaProvider>
  )
}
