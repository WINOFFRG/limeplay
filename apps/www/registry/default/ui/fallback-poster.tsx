import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export function FallbackPoster({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "bg-background absolute inset-0 -z-1 flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
