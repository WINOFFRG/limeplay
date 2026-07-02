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
        "@container/root relative z-20 aspect-(--aspect-ratio) w-full overflow-hidden text-primary",
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
        "pointer-events-none absolute inset-0 isolate z-20 flex flex-col contain-strict",
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

export interface ControlsOverlayContainerProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
}

export const ControlsOverlayContainer = React.forwardRef<
  HTMLDivElement,
  ControlsOverlayContainerProps
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-20", className)}
      data-layout-type="controls-overlay-container"
      ref={ref}
      {...props}
    />
  )
})

ControlsOverlayContainer.displayName = "ControlsOverlayContainer"

export const ControlsBottomContainer = React.forwardRef<
  HTMLDivElement,
  ControlsBottomContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={cn("pointer-events-auto w-full", className)}
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
      className={cn("pointer-events-auto w-full", className)}
      data-layout-type="controls-top-container"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

ControlsTopContainer.displayName = "ControlsTopContainer"
