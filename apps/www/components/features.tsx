import type { Icon } from "@phosphor-icons/react"

import {
  BoundingBoxIcon,
  CodeIcon,
  CommandIcon,
  LightningIcon,
  PersonSimpleCircleIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react/dist/ssr"

const features: {
  description: string
  icon: Icon
  title: string
}[] = [
  {
    description:
      "Design your player your way, complete separation of logic and UI gives you infinite styling possibilities.",
    icon: BoundingBoxIcon,
    title: "Headless & Unopinionated",
  },
  {
    description:
      "Powered by Google's Shaka Player supports HLS/DASH, DRM, Live Streaming out of the box.",
    icon: LightningIcon,
    title: "Powerful Player Engine",
  },
  {
    description: "Fully WAI-ARIA compliant and screen-reader friendly.",
    icon: PersonSimpleCircleIcon,
    title: "Accessible",
  },
  {
    description: "Focus indicators, keyboard shortcuts and navigation.",
    icon: CommandIcon,
    title: "Keyboard Support",
  },
  {
    description:
      "Simple & intutive APIs, easy state management for a smooth developer experience.",
    icon: CodeIcon,
    title: "DX",
  },
  {
    description:
      "Uses @shadcn CLI for distribution, full code ownership and customizability.",
    icon: TerminalWindowIcon,
    title: "Full Code Ownership",
  },
]

export function FeatureGrid() {
  return (
    <div className="z-10 mx-auto w-full px-page ring-1 ring-tertiary">
      <div className="relative z-1 mx-auto w-full max-w-5xl border-x border-tertiary">
        <div className="w-full">
          <div
            className={`
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
            `}
          >
            {features.map((feature, index) => (
              <div
                className={`
                  relative flex animate-blur-fade-slide-in flex-col gap-2 p-6 opacity-0 ring-[0.5px] ring-tertiary will-change-transform
                  md:p-8
                `}
                key={feature.title}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="flex items-start gap-3"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-row items-center gap-2">
                      <feature.icon
                        className="size-5 text-foreground/50"
                        weight="bold"
                      />
                      <h3 className="text-base font-medium text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-[13px] leading-relaxed font-medium text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
