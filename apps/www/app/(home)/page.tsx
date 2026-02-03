import { Suspense } from "react"

import { FeatureTrailSection } from "@/components/feature-trail-section"
import { FeatureGrid } from "@/components/features"
import { Hero } from "@/components/hero"
import { ImmersiveScrollPlayer } from "@/components/immersive-scroll-player"
import { PlayerContainer } from "@/components/player-container"
import { ProYouTubeMusicPlayer } from "@/components/pro-youtube-music-player"
import { ScrollIndicator } from "@/components/scroll-indicator"

export default function Home() {
  return (
    <>
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
      {/* <div
        className={`
          mx-auto w-full
          sm:px-page
        `}
      >
        <div
          className={`
            z-1 mx-auto h-6 w-full max-w-5xl border-x border-b border-border bg-linear-to-r
            bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] ring-border
            sm:h-10
            md:h-16
          `}
        />
      </div> */}
      <FeatureTrailSection />
      <FeatureGrid />
      <div
        className={`
          mx-auto w-full
          sm:px-page
        `}
      >
        <div
          className={`
            z-1 mx-auto h-6 w-full max-w-5xl border-x border-t border-border
            bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] ring-border
            sm:h-10
            md:h-16
          `}
        />
      </div>
      <ProYouTubeMusicPlayer />
    </>
  )
}
