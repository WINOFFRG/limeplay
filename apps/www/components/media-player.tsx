"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { BottomControls } from "@/components/player/bottom-controls"
import { CustomPlayerWrapper } from "@/components/player/custom-player-wrapper"
import { Media } from "@/registry/default/ui/media"
import {
  MediaProvider,
  useMediaStore,
} from "@/registry/default/ui/media-provider"
import { PlayerHooks } from "@/registry/default/ui/player-hooks"
import * as Layout from "@/registry/default/ui/player-layout"

function MediaElement() {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const searchParams = useSearchParams()
  const playbackUrl = searchParams.get("playbackUrl")

  useEffect(() => {
    const mediaElement = mediaRef?.current

    if (player && mediaElement) {
      let finalUrl =
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"

      if (playbackUrl) {
        try {
          const parsedUrl = new URL(playbackUrl)
          finalUrl = parsedUrl.toString()
        } catch (error) {
          console.error(error)
        }
      }

      const config = {
        streaming: {
          // DEV: To debug the buffer values in timeline slider
          bufferingGoal: 100,
        },
      } as shaka.extern.PlayerConfiguration

      player.configure(config)

      player.load(finalUrl)

      return () => {
        if (mediaElement) {
          mediaElement.pause()
        }

        if (player) {
          player.destroy()
        }
      }
    }
  }, [player, mediaRef])

  return (
    <Media
      as="video"
      className="size-full bg-black object-cover"
      autoPlay={false}
      // poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
      muted
      controls={false}
      loop
    />
  )
}

export function MediaPlayer() {
  return (
    <CustomPlayerWrapper>
      <MediaProvider>
        <PlayerHooks />
        <Layout.RootContainer height={720} width={1280} className="container">
          <Layout.PlayerContainer className="mx-auto my-16">
            <MediaElement />
            <Layout.ControlsContainer>
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </Layout.RootContainer>
      </MediaProvider>
    </CustomPlayerWrapper>
  )
}
