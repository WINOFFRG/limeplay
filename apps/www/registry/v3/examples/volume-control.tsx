"use client"

import React from "react"

import { usePlayerEvents } from "@/registry/v3/hooks/use-player-events"
import { useVolume, useVolumeStates } from "@/registry/v3/hooks/use-volume"
import { MediaProvider, useMediaStore } from "@/registry/v3/ui/media-provider"

export function VolumeControlExample() {
  return (
    <MediaProvider>
      <PlayerHooks />
      <VolumeEventsLogger />
      <VolumeControl />
      <MediaElement />
    </MediaProvider>
  )
}

function MediaElement() {
  const mediaRef = React.useRef<HTMLVideoElement>(null)
  const setMediaRef = useMediaStore((state) => state.setMediaRef)

  React.useEffect(() => {
    setMediaRef(mediaRef)
  }, [mediaRef, setMediaRef])

  return <video ref={mediaRef} />
}

function PlayerHooks() {
  useVolumeStates()

  return null
}

function VolumeControl() {
  const muted = useMediaStore((state) => state.muted)
  const volume = useMediaStore((state) => state.volume)
  const { setVolume, toggleMute } = useVolume()

  return (
    <div className="flex flex-col gap-3">
      <button onClick={toggleMute} type="button">
        {muted ? "Unmute" : "Mute"}
      </button>
      <input
        max={1}
        min={0}
        onChange={(event) => setVolume(Number(event.target.value))}
        step={0.05}
        type="range"
        value={volume}
      />
    </div>
  )
}

function VolumeEventsLogger() {
  const events = usePlayerEvents()

  React.useEffect(() => {
    return events.on("volumechange", ({ muted, volume }) => {
      console.log("volume event", { muted, volume })
    })
  }, [events])

  return null
}
