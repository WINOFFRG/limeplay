"use client"

import { ExclusivePlaybackProvider } from "@/registry/default/ui/exclusive-playback-provider"

const AUDIO_SOURCE =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
const VIDEO_SOURCE =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function ExclusivePlaybackProviderDemo() {
  return (
    <ExclusivePlaybackProvider
      className={`
        grid w-full gap-4 p-4
        md:grid-cols-2
      `}
    >
      <section className="grid content-start gap-2">
        <h3 className="text-sm font-medium">Video</h3>
        <video
          aria-label="Big Buck Bunny sample video"
          className="aspect-video w-full rounded-lg bg-muted"
          controls
          preload="none"
          src={VIDEO_SOURCE}
        />
      </section>
      <section className="grid content-start gap-2">
        <h3 className="text-sm font-medium">Audio</h3>
        <audio
          aria-label="SoundHelix sample audio"
          className="w-full"
          controls
          preload="none"
          src={AUDIO_SOURCE}
        />
      </section>
    </ExclusivePlaybackProvider>
  )
}
