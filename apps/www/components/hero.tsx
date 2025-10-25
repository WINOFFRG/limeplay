import Link from "next/link"

import { AnimatedGroup } from "@/components/ui/animated-group"
import AnimatedButtons from "@/components/hero-buttons"
import { Icons } from "@/components/icons"

export function Hero() {
  return (
    <div className="flex flex-col">
      <AnimatedGroup preset="blur-slide">
        <div
          className={`
            z-10 mx-auto mt-28 flex max-w-7xl flex-col px-4 pb-4 text-center
            sm:px-6
            md:mt-36 md:px-8 md:pb-16
            lg:mt-60 lg:px-8
            xl:mt-32 xl:pt-32
          `}
        >
          <h1
            className={`
              mx-auto max-w-4xl text-3xl leading-[1.2] font-semibold tracking-tight text-balance text-black
              sm:leading-[1.15]
              md:text-4xl md:leading-[1.1]
              lg:text-5xl
              xl:text-6xl
              2xl:text-7xl
            `}
          >
            Building video players was never meant to be hard.
          </h1>
          <div className={`mx-auto mt-6 max-w-2xl`}>
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
              Powered by&nbsp;
              <Icons.shaka />
              &nbsp;
              <Link
                href={"https://github.com/shaka-project/shaka-player/"}
                className={`
                  underline underline-offset-2 transition-colors
                  hover:text-neutral-900
                `}
                target="_blank"
                rel="noopener noreferrer"
              >
                shaka-player
              </Link>
              &nbsp;and&nbsp;
              <Icons.shadcn />
              <Link
                href={"https://ui.shadcn.com/"}
                className={`
                  underline underline-offset-2 transition-colors
                  hover:text-neutral-900
                `}
                target="_blank"
                rel="noopener noreferrer"
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
