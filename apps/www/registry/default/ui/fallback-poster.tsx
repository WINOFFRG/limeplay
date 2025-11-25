import type { ComponentPropsWithoutRef } from "react";
import * as React from "react";

import { cn } from "@/lib/utils";

export const FallbackPoster = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ children, className, ...props }, ref) => (
  <div
    className={cn(
      "-z-1 absolute inset-0 flex flex-col items-center justify-center bg-background",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));

FallbackPoster.displayName = "FallbackPoster";
