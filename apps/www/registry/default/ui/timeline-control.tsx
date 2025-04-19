"use client";

import { cn } from "@/lib/utils";
import { useMediaStore } from "@/registry/default/ui/media-provider";
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export const Root = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>((props, forwardedRef) => {
  const { className, onValueChange: propOnValueChange, ...etc } = props;
  const currentProgress = useMediaStore((state) => state.progress);
  const seekTo = useMediaStore((state) => state.seekTo);

  const onValueChange = (value: number[]) => {
    propOnValueChange?.(value);
    seekTo({
      progress: value[0],
    });
  };

  return (
    <SliderPrimitive.Root
      ref={forwardedRef}
      min={0}
      max={1}
      // DEV: Create a function for precision control which reads 0 and duration to get decimal places
      step={0.0001}
      value={[currentProgress]}
      // defaultValue={[]}
      className={cn(
        "relative flex touch-none select-none items-center justify-center",
        className
      )}
      onValueChange={onValueChange}
      {...etc}
    />
  );
});

Root.displayName = "Root";

export const Track = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>((props, forwardRef) => {
  const { className } = props;

  return (
    <SliderPrimitive.Track
      {...props}
      ref={forwardRef}
      className={cn(
        "bg-primary/20 relative size-full overflow-hidden rounded-md",
        className
      )}
    />
  );
});

Track.displayName = "Track";

export const Range = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>((props, forwardedRef) => {
  const { ...etc } = props;

  return (
    <SliderPrimitive.Range
      ref={forwardedRef}
      {...etc}
      className="bg-primary absolute rounded-s-md data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
    />
  );
});

Range.displayName = "Range";

export const Thumb = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>((props, forwardRef) => {
  const { className, ...etc } = props;
  const volume = useMediaStore((state) => state.volume);
  const displayValue = Number((volume * 100).toFixed(2));

  return (
    <SliderPrimitive.Thumb
      className={cn(
        "block size-2 rounded-full bg-white outline-offset-1 outline-white focus-visible:outline-1 focus-visible:ring-0",
        className
      )}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayValue}
      aria-valuetext={`${displayValue}% volume`}
      aria-label="Volume"
      {...etc}
      ref={forwardRef}
    />
  );
});

Thumb.displayName = "Thumb";
