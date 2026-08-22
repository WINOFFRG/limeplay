"use client"

import dynamic from "next/dynamic"

const AudioPlayerHover = dynamic(
  () =>
    import("@/components/players/audio-player/hover-player").then(
      (module) => module.AudioPlayerHover
    ),
  {
    loading: () => <div aria-hidden="true" className="h-64" />,
    ssr: false,
  }
)

export function DeferredHomeAudioDemo() {
  return <AudioPlayerHover />
}
