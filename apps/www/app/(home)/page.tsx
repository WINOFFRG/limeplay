import { Suspense } from "react"

import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { ImmersiveScrollPlayer } from "@/components/immersive-scroll-player"
import { PlayerContainer } from "@/components/player-container"
import { ScrollIndicator } from "@/components/scroll-indicator"

export default function Home() {
  return (
    <>
      <section>
        <Hero />
        <ImmersiveScrollPlayer>
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="aspect-video w-full animate-pulse"
              />
            }
          >
            <PlayerContainer />
          </Suspense>
        </ImmersiveScrollPlayer>
        <ScrollIndicator />
        <Features />
      </section>
      <Footer />
    </>
  )
}
