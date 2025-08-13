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
          relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-16 text-center
          sm:px-6
          md:pt-32
          lg:px-8 lg:pt-44
        `}
      >
        <h1
          className={`
            mx-auto max-w-4xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-black
            sm:text-5xl
            lg:text-6xl
            xl:text-7xl
          `}
        >
          Building video players was never meant to be hard.
        </h1>

        <div className="mx-auto mt-8 max-w-2xl space-y-2">
          <p
            className={`
              text-2xl font-medium text-neutral-900
              sm:text-xl
            `}
          >
            Modern UI Library for building video players
          </p>
          <p
            className={`
              text-base font-medium text-neutral-700
              sm:text-lg
            `}
          >
            Powered by
            <Link
              href={"https://shaka-player.netlify.app/"}
              className="underline underline-offset-2"
            >
              @shaka-player
            </Link>
            &nbsp;and&nbsp;
            <Link
              href={"https://ui.shadcn.com/"}
              className="underline underline-offset-2"
            >
              @shadcn/ui
            </Link>
          </p>
        </div>
        <div
          className={`
            mt-12 flex flex-col items-center justify-center gap-4
            sm:flex-row sm:gap-6
          `}
        >
          <Button
            asChild
            size="lg"
            className={`
              w-full border border-neutral-400 px-8 py-4 text-base font-medium transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-sm
              sm:w-auto
            `}
          >
            <a href="/docs/components">Browse components</a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className={`
              w-full bg-neutral-700 px-0 py-4 text-base font-medium transition-all duration-200
              hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-sm
              sm:w-auto
            `}
          >
            <a
              href="https://github.com/winoffrg/limeplay"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <Icons.gitHub className="h-5 w-5" />
              <span>GitHub</span>
              <Separator className="h-6 w-px bg-neutral-400" />
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
