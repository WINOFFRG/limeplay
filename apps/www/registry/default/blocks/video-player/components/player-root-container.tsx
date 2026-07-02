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
      aspectRatio={layout === "fill" ? false : aspectRatio}
      className={cn(
        "m-auto max-h-full min-h-0",
        layout === "fill" ? "size-full" : "w-full",
        controlsVisibility.className,
        className
      )}
      onBlur={composeEventHandlers(
        rootProps.onBlur,
        controlsVisibility.rootProps.onBlur
      )}
      onFocus={composeEventHandlers(
        rootProps.onFocus,
        controlsVisibility.rootProps.onFocus
      )}
      onPointerEnter={composeEventHandlers(
        rootProps.onPointerEnter,
        controlsVisibility.rootProps.onPointerEnter
      )}
      onPointerLeave={composeEventHandlers(
        rootProps.onPointerLeave,
        controlsVisibility.rootProps.onPointerLeave
      )}
      onPointerMove={composeEventHandlers(
        rootProps.onPointerMove,
        controlsVisibility.rootProps.onPointerMove
      )}
      onPointerOver={composeEventHandlers(
        rootProps.onPointerOver,
        controlsVisibility.rootProps.onPointerOver
      )}
      onPointerUp={composeEventHandlers(
        rootProps.onPointerUp,
        controlsVisibility.rootProps.onPointerUp
      )}
      ref={ref}
    />
  )
})

PlayerRootContainer.displayName = "PlayerRootContainer"

function composeEventHandlers<TEvent extends React.SyntheticEvent>(
  userHandler: ((event: TEvent) => void) | undefined,
  internalHandler: ((event: TEvent) => void) | undefined
) {
  if (!userHandler) return internalHandler
  if (!internalHandler) return userHandler

  return (event: TEvent) => {
    userHandler(event)
    if (!event.defaultPrevented) internalHandler(event)
  }
}
