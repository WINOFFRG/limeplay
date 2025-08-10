import { Suspense } from "react"

import { ImmersiveScrollPlayer } from "@/components/immersive-scroll-player"
import { PlayerContainer } from "@/components/player-container"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { VideoBackground } from "@/components/video-background"

export default function Home() {
  return (
    <section className="relative min-h-screen">
      <VideoBackground />
      {/* <h2 className="z-10 text-center text-5xl font-semibold tracking-tight text-black">
        Modern Video UI components <br />
        for Shaka Player
      </h2> */}
      <ImmersiveScrollPlayer>
        <Suspense>
          <PlayerContainer />
        </Suspense>
      </ImmersiveScrollPlayer>
      <ScrollIndicator />
    </section>
  )
}
