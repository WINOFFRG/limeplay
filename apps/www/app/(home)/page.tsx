import { VideoBackground } from "@/components/video-background"
import { MediaPlayer as LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

export default function Home() {
  return (
    <section className="mt-16">
      <VideoBackground />
      <LinearMediaPlayer />
    </section>
  )
}
