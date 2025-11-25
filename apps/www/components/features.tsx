import Link from "next/link"
import {
  CodesandboxLogoIcon,
  CommandIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// import { TextEffect } from "@/components/ui/text-effect"

const features = [
  {
    title: "Customizable",
    description:
      "Separate UI and Logic - completely headless for infinite possibilities. Bake anything like you want",
    icon: CodesandboxLogoIcon,
  },
  {
    title: "Accessible",
    description:
      "WAI-ARIA compliant, Screen reader friendly, Keyboard navigation support and shortcuts",
    icon: CommandIcon,
  },
  {
    title: "Feature Rich",
    description:
      "Shaka Player as playback engine comes with the support of ABR Streaming, DASH/HLS Support, DRM Protection",
    icon: SparkleIcon,
  },
]

export function Features() {
  return (
    <div
      className={`
        bg-linear-to-b from-white to-zinc-50 py-16
        md:py-32
        dark:from-black dark:to-surface
      `}
    >
      <div className="@container mx-auto max-w-5xl px-6">
        <div
          className={cn(
            `
              group mb-12 w-fit justify-self-center rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in
              hover:cursor-pointer hover:bg-neutral-200
              dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800
            `
          )}
        >
          <AnimatedShinyText
            className={`
              inline-flex items-center justify-center px-4 py-1 transition ease-out
              hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400
            `}
          >
            <Link href="/blocks">✨ Checkout Blocks</Link>
            <ArrowRightIcon
              className={`
                ml-1 size-3 transition-transform duration-300 ease-in-out
                group-hover:translate-x-0.5
              `}
            />
          </AnimatedShinyText>
        </div>
        <div className="text-center">
          {/* <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h2"
            className={`
              text-4xl font-semibold text-balance text-foreground
              lg:text-5xl
            `}
          > */}
          <h2
            className={`
              text-4xl font-semibold text-balance text-foreground
              lg:text-5xl
            `}
          >
            Industry standard Media Players
          </h2>
          {/* </TextEffect> */}
          {/* <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            as="p"
            className="mx-auto mt-8 max-w-2xl text-lg text-balance text-muted-foreground"
          > */}
          <p className="mx-auto mt-8 max-w-2xl text-lg text-balance text-muted-foreground">
            Compose like an Artist without worrying about logic and
            functionality
          </p>
          {/* </TextEffect> */}
        </div>
        <div
          className={`
            mx-auto mt-8 grid max-w-sm gap-6
            md:mt-16
            @min-4xl:max-w-full @min-4xl:grid-cols-3
          `}
        >
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`
                group relative overflow-hidden border border-border/40 bg-card transition-all duration-300
                hover:border-primary/40 hover:shadow-lg
                dark:border-border/30 dark:bg-card/60 dark:hover:border-primary/50 dark:hover:bg-card/80
              `}
            >
              <div
                className={`
                  absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                  dark:from-primary/12
                `}
              />
              <div
                className={`
                  absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary/0 via-primary/60 to-primary/0 transition-all duration-500
                  group-hover:w-full
                `}
              />
              <CardHeader className="relative gap-0 pb-4">
                <div
                  className={`
                    inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 transition-all duration-300
                    group-hover:scale-110 group-hover:bg-primary/12
                    dark:bg-primary/10 dark:group-hover:bg-primary/15
                  `}
                >
                  <feature.icon
                    className={`
                      size-6 text-primary transition-transform duration-300
                      group-hover:scale-110
                    `}
                  />
                </div>
                <h3
                  className={`
                    mt-4 text-lg font-semibold text-foreground transition-colors duration-300
                    group-hover:text-primary
                  `}
                >
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent className="relative">
                <p
                  className={`
                    text-sm leading-relaxed text-muted-foreground transition-colors duration-300
                    group-hover:text-foreground/80
                  `}
                >
                  {feature.description}
                </p>
              </CardContent>
              <div
                className={`
                  pointer-events-none absolute right-0 bottom-0 h-20 w-20 bg-linear-to-tl from-primary/5 to-transparent opacity-0 transition-opacity
                  duration-500
                  group-hover:opacity-100
                  dark:from-primary/8
                `}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
