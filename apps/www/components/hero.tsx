import Link from "next/link"

import AnimatedButtons from "@/components/hero-buttons"
import { Icons } from "@/components/icons"
import { AnimatedGroup } from "@/components/ui/animated-group"

export function Hero() {
  return (
    <div className="flex flex-col">
      <AnimatedGroup preset="blur-slide">
        <div
          className={`
            z-10 mx-auto flex max-w-7xl flex-col px-page pt-24 pb-8 text-center
            sm:px-6
            md:px-8 md:pt-32 md:pb-12
            lg:px-8 lg:pt-40 lg:pb-16
          `}
        >
          <h1
            className={`
              mx-auto max-w-4xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground
              md:text-4xl
              lg:text-5xl
              xl:text-6xl
              2xl:text-7xl
            `}
          >
            Building video players was never meant to be hard.
          </h1>
          <div className={`mx-auto mt-8 max-w-2xl`}>
            <h2
              className={`
                text-lg font-medium text-foreground/90
                sm:text-xl
                md:text-2xl
              `}
            >
              Modern UI Library for building video players
            </h2>
            <p
              className={`
                text-sm leading-relaxed font-medium text-muted-foreground
                sm:text-base
                md:text-lg
              `}
            >
              Powered by&nbsp;
              <Icons.shaka />
              &nbsp;
              <Link
                className={`
                  rounded-sm underline underline-offset-2 focus-ring transition-colors
                  hover:text-foreground
                `}
                href={"https://github.com/shaka-project/shaka-player/"}
                rel="noopener noreferrer"
                target="_blank"
              >
                shaka-player
              </Link>
              &nbsp;and&nbsp;
              <Icons.shadcn />
              <Link
                className={`
                  rounded-sm underline underline-offset-2 focus-ring transition-colors
                  hover:text-foreground
                `}
                href={"https://ui.shadcn.com/"}
                rel="noopener noreferrer"
                target="_blank"
              >
                shadcn/ui
              </Link>
            </p>
          </div>
        </div>
      </AnimatedGroup>
      <AnimatedGroup preset="fade">
        <AnimatedButtons />
      </AnimatedGroup>
    </div>
  )
}
