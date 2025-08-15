import { Suspense } from "react"
import Link from "next/link"
import { Separator } from "@radix-ui/react-select"

import { Button } from "@/components/ui/button"
import { GitHubStars } from "@/components/github-stars"
import { Icons } from "@/components/icons"
import { ImmersiveScrollPlayer } from "@/components/immersive-scroll-player"
import { PlayerContainer } from "@/components/player-container"
import { ScrollIndicator } from "@/components/scroll-indicator"

export default function Home() {
  return (
    <section className="relative min-h-screen">
      <div
        className={`
          relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 text-center
          sm:px-6 sm:pt-20 sm:pb-16
          md:px-8 md:pt-36 md:pb-16
          lg:px-8 lg:pt-32
          xl:pt-40
        `}
      >
        <h1
          className={`
            mx-auto max-w-4xl text-2xl leading-[1.2] font-semibold tracking-tight text-balance text-black
            sm:text-3xl sm:leading-[1.15]
            md:text-4xl md:leading-[1.1]
            lg:text-5xl
            xl:text-6xl
            2xl:text-7xl
          `}
        >
          Building video players was never meant to be hard.
        </h1>

        <div
          className={`
            mx-auto mt-6 max-w-2xl space-y-3
            sm:mt-8 sm:space-y-4
          `}
        >
          <h2
            className={`
              text-lg font-medium text-neutral-900
              sm:text-xl
              md:text-2xl
            `}
          >
            Modern UI Library for building video players
          </h2>
          <p
            className={`
              text-sm leading-relaxed font-medium text-neutral-700
              sm:text-base
              md:text-lg
            `}
          >
            Powered by
            <Link
              href={"https://github.com/shaka-project/shaka-player/"}
              className={`
                underline underline-offset-2 transition-colors
                hover:text-neutral-900
              `}
              target="_blank"
              rel="noopener noreferrer"
            >
              @shaka-player
            </Link>
            &nbsp;and&nbsp;
            <Link
              href={"https://ui.shadcn.com/"}
              className={`
                underline underline-offset-2 transition-colors
                hover:text-neutral-900
              `}
              target="_blank"
              rel="noopener noreferrer"
            >
              @shadcn/ui
            </Link>
          </p>
        </div>
        <div
          className={`
            mt-8 flex flex-col items-center justify-center gap-3
            sm:mt-10 sm:flex-row sm:gap-4
            md:mt-12 md:gap-6
          `}
        >
          <Button
            asChild
            size="lg"
            className={`
              w-full border border-neutral-400 px-6 py-3 text-sm font-medium transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-sm
              sm:w-auto sm:px-8 sm:py-4 sm:text-base
            `}
          >
            <Link href="/docs/components">Browse components</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className={`
              w-full bg-neutral-700 px-6 py-3 text-sm font-medium transition-all duration-200
              hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-sm
              sm:w-auto sm:px-8 sm:py-4 sm:text-base
            `}
          >
            <a
              href="https://github.com/winoffrg/limeplay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Icons.gitHub
                className={`
                  h-4 w-4
                  sm:h-5 sm:w-5
                `}
              />
              <span>GitHub</span>
              <Separator
                className={`
                  h-4 w-px bg-neutral-400
                  sm:h-6
                `}
              />
              <GitHubStars />
            </a>
          </Button>
        </div>
      </div>

      <ImmersiveScrollPlayer>
        <Suspense
          fallback={
            <div
              className="aspect-video w-full animate-pulse"
              aria-hidden="true"
            />
          }
        >
          <PlayerContainer />
        </Suspense>
      </ImmersiveScrollPlayer>
      <ScrollIndicator />
    </section>
  )
}
