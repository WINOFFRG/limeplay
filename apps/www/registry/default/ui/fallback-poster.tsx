import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

/**
 * Inspired from Prime Video player PiP Mode
 */
export function FallbackPoster({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "bg-background items-ce absolute inset-0 flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
