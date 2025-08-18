"use client"

import React, { useEffect } from "react"

import { CustomDemoControls } from "@/registry/default/internal/custom-demo-controls"
import { PlayerHooks } from "@/registry/default/internal/player-hooks-demo"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media } from "@/registry/default/ui/media"
import {
  MediaProvider,
  useMediaStore,
} from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

function MediaElement() {
  const player = useMediaStore((state) => state.player)

  useEffect(() => {
    const streamUrl =
      "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"

    if (player) {
      try {
        const url = new URL(streamUrl)

        if (url.protocol === "http:" || url.protocol === "https:") {
          void player.load(streamUrl)
        } else {
          console.warn("Invalid stream URL protocol. Must be http or https.")
        }
      } catch (error) {
        console.error("Invalid stream URL format:", streamUrl, error)
      }
    }
  }, [player])

  return (
    <Media
      as="video"
      controls={true}
      className="m-0! size-full rounded-lg bg-black object-cover"
      poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
      muted
      autoPlay={false}
    />
  )
}

interface PlayerDemoLayoutProps extends React.PropsWithChildren {
  type: "overlay" | "block" | "poster"
}

export function PlayerLayoutDemo({ children, type }: PlayerDemoLayoutProps) {
  return (
    <MediaProvider>
      <RootContainer height={720} width={1280} className="container p-0">
        <Layout.PlayerContainer>
          {type === "poster" ? (
            children
          ) : (
            <FallbackPoster className="bg-stone-900">
              <LimeplayLogo />
            </FallbackPoster>
          )}
          <MediaElement />
          <PlayerHooks />
          <Layout.ControlsContainer>
            {type === "overlay" && children}
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </RootContainer>
      {type === "block" && <CustomDemoControls>{children}</CustomDemoControls>}
    </MediaProvider>
  )
}
