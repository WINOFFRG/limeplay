"use client"

import React from "react"

import type { RootContainerProps } from "@/registry/default/ui/root-container"

import { cn } from "@/lib/utils"
import { useControlsVisibility } from "@/registry/default/hooks/use-controls-visibility"
import { RootContainer } from "@/registry/default/ui/root-container"

export type PlayerRootContainerLayout = "aspect" | "fill"

export interface PlayerRootContainerProps extends RootContainerProps {
  /**
   * Controls how the player frame gets its size.
   *
   * `aspect` keeps the default aspect-ratio driven player box.
   * `fill` lets a height-constrained parent own the player box.
   */
  layout?: PlayerRootContainerLayout
}

export const PlayerRootContainer = React.forwardRef<
  HTMLDivElement,
  PlayerRootContainerProps
>(function PlayerRootContainer(props, ref) {
  const { aspectRatio, className, layout = "aspect", ...rootProps } = props
  const controlsVisibility = useControlsVisibility()

  return (
    <RootContainer
      aria-label="Video Player"
      {...rootProps}
      {...controlsVisibility.rootProps}
      aspectRatio={layout === "fill" ? false : aspectRatio}
      className={cn(
        "m-auto max-h-full min-h-0",
        layout === "fill" ? "size-full" : "w-full",
        controlsVisibility.className,
        className
      )}
      ref={ref}
    />
  )
})

PlayerRootContainer.displayName = "PlayerRootContainer"
