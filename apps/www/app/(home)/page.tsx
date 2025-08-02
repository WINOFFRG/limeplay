import { MotionContainer } from "@/components/motion-container"
import { VideoBackground } from "@/components/video-background"
import { MediaPlayer as LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

export default function Home() {
  return (
    <section className="lg:mt-16">
      <VideoBackground />
      <MotionContainer>
        <LinearMediaPlayer />
      </MotionContainer>
    </section>
  )
}
