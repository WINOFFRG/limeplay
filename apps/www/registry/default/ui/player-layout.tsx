import type { ComponentPropsWithoutRef } from "react"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface PlayerContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
}

export const PlayerContainer = React.forwardRef<
  HTMLDivElement,
  PlayerContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative z-20 aspect-(--aspect-ratio) w-full overflow-hidden text-primary",
        className
      )}
      data-layout-type="player-container"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

PlayerContainer.displayName = "PlayerContainer"

export interface ControlsContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
}

export const ControlsContainer = React.forwardRef<
  HTMLDivElement,
  ControlsContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 isolate flex flex-col contain-strict",
        className
      )}
      data-layout-type="controls-container"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

ControlsContainer.displayName = "ControlsContainer"

export interface ControlsBottomContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
}

export function ControlsOverlayContainer() {
  return (
    <div
      className={`
        pointer-events-none absolute inset-0 bg-lp-controls-fade bg-size-[100%_45%] bg-bottom bg-no-repeat transition-opacity duration-300 ease-out
        group-data-[idle=true]/root:opacity-0
        group-data-[status=buffering]/root:opacity-100
        group-data-[status=paused]/root:opacity-100
      `}
      data-layout-type="controls-overlay-container"
    />
  )
}

export const ControlsBottomContainer = React.forwardRef<
  HTMLDivElement,
  ControlsBottomContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        `
          pointer-events-auto inset-x-0 mx-auto my-6 flex w-full items-end gap-2 px-[min(80px,10%)] transition-all duration-300 ease-out-quad
          group-data-[idle=false]/root:translate-y-0 group-data-[idle=false]/root:opacity-100
          group-data-[idle=true]/root:translate-y-4 group-data-[idle=true]/root:opacity-0
          group-data-[status=buffering]/root:translate-y-0 group-data-[status=buffering]/root:opacity-100
          group-data-[status=paused]/root:translate-y-0 group-data-[status=paused]/root:opacity-100
        `,
        className
      )}
      data-layout-type="controls-bottom-container"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

ControlsBottomContainer.displayName = "ControlsBottomContainer"

export interface ControlsTopContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
}

export const ControlsTopContainer = React.forwardRef<
  HTMLDivElement,
  ControlsTopContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        `
          pointer-events-auto absolute inset-x-0 top-8 mx-auto flex items-start gap-2 px-[min(80px,10%)] transition-all duration-300 ease-out-quad
          group-data-[idle=false]/root:translate-y-0 group-data-[idle=false]/root:opacity-100
          group-data-[idle=true]/root:-translate-y-4 group-data-[idle=true]/root:opacity-0
          group-data-[status=buffering]/root:translate-y-0 group-data-[status=buffering]/root:opacity-100
          group-data-[status=paused]/root:translate-y-0 group-data-[status=paused]/root:opacity-100
        `,
        className
      )}
      data-layout-type="controls-top-container"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

ControlsTopContainer.displayName = "ControlsTopContainer"
