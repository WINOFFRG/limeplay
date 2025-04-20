import React, { ComponentPropsWithoutRef } from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function PlayerContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-layout-type="player-container"
      className={cn(
        "aspect-(--aspect-ratio) relative max-h-[min(var(--height,_720px),_calc(100vh_-_16px_*_2))] w-auto overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ControlsContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-layout-type="controls-container"
      className={cn("pointer-events-auto absolute inset-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface RootContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  height?: number
  width?: number
  className?: string
}

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const { children, height, width, className } = props
  const idle = useMediaStore((state) => state.idle)
  const status = useMediaStore((state) => state.status)
  const setPlayerContainerRef = useMediaStore(
    (state) => state.setPlayerContainerRef
  )
  const aspectRatio = React.useMemo(
    () => calculateAspectRatio(width, height),
    [height, width]
  )
    ?.split(":")
    ?.join("/")

  return (
    <div
      tabIndex={0}
      aria-label="Media player"
      role="region"
      data-idle={idle}
      ref={composeRefs(forwardedRef, setPlayerContainerRef)}
      data-status={status}
      data-theme={"light"}
      style={{
        ["--width" as string]: `${width}px`,
        ["--height" as string]: `${height}px`,
        ["--aspect-ratio" as string]: aspectRatio,
        aspectRatio: aspectRatio,
      }}
      className={cn("m-auto min-w-80 max-w-[var(--width,1280px)]", className)}
      // Show controls like tabbing over
      // onKeyDown={}
      // onPointerMove show controls again
      // onPointerUp IDK yet, but probably
      // onPointerLeave hide controls now, maybe with timeout?
      // onFocus show controls and set focus true so that keyboard shortcuts are triggered
      // onBlur hide controls and set focus to false
      {...props}
    >
      {children}
    </div>
  )
})

RootContainer.displayName = "RootContainer"

function calculateAspectRatio(width?: number, height?: number) {
  if (width && height) {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b)
    }
    const divisor = gcd(width, height)
    const aspectWidth = width / divisor
    const aspectHeight = height / divisor
    return `${aspectWidth}:${aspectHeight}`
  }
}
