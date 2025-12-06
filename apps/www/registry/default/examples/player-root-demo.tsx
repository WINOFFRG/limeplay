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

interface PlayerDemoLayoutProps extends React.PropsWithChildren {
  blockChildren?: React.ReactNode
  overlayChildren?: React.ReactNode
  type: "block" | "hybrid" | "overlay" | "poster"
}

export function PlayerLayoutDemo({
  blockChildren,
  children,
  overlayChildren,
  type,
}: PlayerDemoLayoutProps) {
  return (
    <MediaProvider>
      <RootContainer
        className="container rounded-lg border p-0"
        height={720}
        width={1280}
      >
        <Layout.PlayerContainer>
          {type === "poster" ? (
            children
          ) : (
            <FallbackPoster className="rounded-lg bg-background">
              <LimeplayLogo />
            </FallbackPoster>
          )}
          <MediaElement />
          <PlayerHooks />
          <Layout.ControlsContainer>
            {type === "overlay" && children}
            {type === "hybrid" && overlayChildren}
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </RootContainer>
      {type === "block" && <CustomDemoControls>{children}</CustomDemoControls>}
      {type === "hybrid" && (
        <CustomDemoControls>{blockChildren}</CustomDemoControls>
      )}
    </MediaProvider>
  )
}

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
      autoPlay={false}
      className="m-0! size-full rounded-lg bg-black object-cover"
      controls={true}
      muted
      poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
    />
  )
}
