import { MediaPlayer as LinearMediaPlayer } from "@/components/media-player"
import { VideoBackground } from "@/components/video-background"

export default function Home() {
  return (
    <section>
      <VideoBackground />
      <LinearMediaPlayer />
    </section>
  )
}
