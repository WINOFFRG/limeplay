import * as TimelineControlPrimitive from "@/registry/default/ui/timeline-control"
import {
  Duration,
  Elapsed,
  HoverTime,
  Remaining,
} from "@/registry/default/ui/timeline-labels"

export function TimelineLabelsDemo() {
  return (
    <div className="my-4 flex h-fit w-full flex-col gap-4 rounded-md border p-4 pt-6">
      <div className="flex flex-row items-center gap-3">
        <div className="group/timeline relative w-full grow">
          <TimelineControlPrimitive.Root
            className="group focus-area cursor-crosshair -focus-area-x-2 -focus-area-y-14"
            orientation="horizontal"
          >
            <TimelineControlPrimitive.Track className="overflow-hidden">
              <TimelineControlPrimitive.Progress />
              <TimelineControlPrimitive.Buffered variant="combined" />
            </TimelineControlPrimitive.Track>
            <TimelineControlPrimitive.Thumb
              className={`
                absolute h-8 w-px rounded-full bg-primary/60 opacity-0 transition-opacity duration-(--lp-transition-speed-regular)
                group-hover/timeline:opacity-100
                group-active/timeline:bg-primary
              `}
              showWithHover
            />
          </TimelineControlPrimitive.Root>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Elapsed:</span>
          <Elapsed className="text-sm font-medium" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Remaining:</span>
          <Remaining className="text-sm font-medium" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Duration:</span>
          <Duration className="text-sm font-medium" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Hover Time:</span>
          <HoverTime className="text-sm font-medium" />
        </div>
      </div>
    </div>
  )
}
