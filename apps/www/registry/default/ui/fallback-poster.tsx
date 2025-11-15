import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export function FallbackPoster({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-1 flex flex-col items-center justify-center bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
