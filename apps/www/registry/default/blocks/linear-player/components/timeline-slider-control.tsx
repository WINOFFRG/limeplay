"use client";

import { useState } from "react";

import { Button } from "@/registry/default/blocks/linear-player/ui/button";
import { useMediaStore } from "@/registry/default/ui/media-provider";
import * as TimelineSlider from "@/registry/default/ui/timeline-control";
import {
  Duration,
  Elapsed,
  HoverTime,
  LiveLatency,
  Remaining,
} from "@/registry/default/ui/timeline-labels";

export function TimelineSliderControl() {
  const [showRemaining, setShowRemaining] = useState(false);
  const liveLatency = useMediaStore((state) => state.liveLatency);
  const isLive = useMediaStore((state) => state.isLive);
  const player = useMediaStore((state) => state.player);

  return (
    <div className="my-auto flex grow select-none items-center gap-3">
      {!isLive && <Elapsed className="font-medium text-xs" />}
      <div className="group/timeline relative w-full grow">
        <TimelineSlider.Root className="group focus-area -focus-area-x-2 -focus-area-y-14 cursor-crosshair">
          <TimelineSlider.Track className="overflow-hidden">
            <TimelineSlider.Progress />
            <TimelineSlider.Buffered variant="combined" />
          </TimelineSlider.Track>
          <TimelineSlider.Thumb
            className={
              "absolute h-8 w-px rounded-full bg-primary/60 opacity-0 transition-opacity duration-(--lp-transition-speed-regular) group-hover/timeline:opacity-100 group-active/timeline:bg-white"
            }
            showWithHover
          />
          <TimelineSlider.Thumb
            className={
              "top-auto! bottom-[calc(100%+16px)] flex h-auto w-fit bg-transparent font-medium text-xs opacity-0 transition-opacity duration-(--lp-transition-speed-regular) group-hover/timeline:opacity-100"
            }
            showWithHover
          >
            <HoverTime />
            {!isLive && (
              <>
                &nbsp;/&nbsp;
                <Duration className="text-primary/60" />
              </>
            )}
          </TimelineSlider.Thumb>
        </TimelineSlider.Root>
      </div>
      {!isLive && (
        <Button
          aria-label={
            showRemaining ? "Show total duration" : "Show remaining time"
          }
          aria-pressed={showRemaining}
          className={
            "h-6 w-14 cursor-pointer hover:bg-transparent focus-visible:bg-transparent"
          }
          onClick={() => {
            setShowRemaining(!showRemaining);
          }}
          size="sm"
          variant="glass"
        >
          {showRemaining ? (
            <Remaining className="font-medium text-xs" />
          ) : (
            <Duration className="font-medium text-xs" />
          )}
        </Button>
      )}
      {liveLatency && player && liveLatency > 1 && (
        <>
          <LiveLatency className="font-medium text-xs" />
          <Button
            aria-label="Go to live"
            className="h-6 w-fit cursor-pointer"
            onClick={() => void player.goToLive()}
            size="icon"
            variant="glass"
          >
            <span className="font-medium text-primary text-xs">Go to live</span>
          </Button>
        </>
      )}
      {liveLatency && liveLatency <= 1 && (
        <div className="flex items-center rounded-full bg-red-600 px-2 py-0.5 font-semibold text-xs tracking-wide">
          <div className="mr-1 h-2 w-2 animate-caret-blink rounded-full bg-foreground" />
          <span className="tracking-widest">LIVE</span>
        </div>
      )}
    </div>
  );
}
