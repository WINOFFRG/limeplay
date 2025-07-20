import { useTimelineStates } from "@/registry/default/hooks/use-timeline"

export function TimelineSliderControl() {
  useTimelineStates()

  return <div className="group/timeline my-auto flex w-full items-center"></div>
}
