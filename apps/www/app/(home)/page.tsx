import { Suspense } from "react"

import { MotionContainer } from "@/components/motion-container"
import { PlayerContainer } from "@/components/player-container"
import { VideoBackground } from "@/components/video-background"

export default function Home() {
  return (
    <section className="lg:mt-16">
      <VideoBackground />
      <MotionContainer>
        <Suspense>
          <PlayerContainer />
        </Suspense>
      </MotionContainer>
    </section>
  )
}
