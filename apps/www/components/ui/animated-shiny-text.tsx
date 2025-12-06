import type { CSSProperties, FC, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface AnimatedShinyTextProps {
  children: ReactNode
  className?: string
  shimmerWidth?: number
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      className={cn(
        `
          mx-auto max-w-md text-neutral-600/70
          dark:text-neutral-400/70
        `,

        // Shine effect
        `
          animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat
          [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]
        `,

        // Shine gradient
        `
          bg-linear-to-r from-transparent via-black/80 via-50% to-transparent
          dark:via-white/80
        `,

        className
      )}
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
    >
      {children}
    </p>
  )
}

export { AnimatedShinyText }
