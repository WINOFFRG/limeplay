import { Suspense } from "react"

import { MotionContainer } from "@/components/motion-container"
import { PlayerContainer } from "@/components/player-container"
import { VideoBackground } from "@/components/video-background"

export default function Home() {
  return (
    <section className={`lg:mt-16`}>
      <VideoBackground />
      {/* <h2 className="text-center text-5xl font-semibold tracking-tight text-black">
        Modern Video UI components <br />
        for Shaka Player
      </h2> */}
      <MotionContainer>
        <Suspense>
          <PlayerContainer />
        </Suspense>
      </MotionContainer>
    </section>
  )
}
