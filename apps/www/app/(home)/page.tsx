import { Suspense } from "react"

import { FeatureTrailSection } from "@/components/feature-trail-section"
import { FeatureGrid } from "@/components/features"
import { Hero } from "@/components/hero"
import { ImmersiveScrollPlayer } from "@/components/immersive-scroll-player"
import { PlayerContainer } from "@/components/player-container"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { YouTubeMusicHoverPlayer } from "@/components/youtube-music-hover-player"

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
      <FeatureTrailSection>
        <div
          className={`
            mx-auto my-20 mt-16 max-w-5xl px-page
            md:mt-36
          `}
        >
          <div className="mx-auto w-fit justify-center rounded-xl bg-secondary px-3 py-1 text-[11px]">
            <p className="opacity-60">INSPIRATION</p>
          </div>
          <div
            className={`
              mx-auto my-4 flex max-w-lg items-center justify-center px-5 text-[28px] leading-[28px] font-semibold tracking-tighter
              md:text-[38px] md:leading-11
            `}
          >
            <div
              className={`mr-2 flex size-[0.8em] items-center justify-center overflow-hidden rounded-full bg-[#FF6100]`}
            ></div>
            <span className={`mr-1 inline-block`}>
              Built to make viewers stay
            </span>
          </div>
          <p
            className={`
              text-center text-sm tracking-[-0.16px] text-muted-foreground
              md:text-[16px] md:leading-[24px]
            `}
          >
            <span className={`block`}>A video player isn’t just controls —</span>
            <span className={`block`}>
              {" "}
              it’s retention engineered into every interaction.{" "}
            </span>
            <span className={`block`}>
              {" "}
              Craft seamless, production-grade experiences with the power
            </span>
            <span className={`block`}>
              and flexibility of the shadcn ecosystem.
            </span>
          </p>
        </div>
      </FeatureTrailSection>
      <YouTubeMusicHoverPlayer />
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
    </>
  )
}
