"use client"

import { Button } from "@/components/ui/button"
import { SelectGroup } from "@/components/ui/select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/blocks/linear-player/ui/select"
import { usePlaybackRate } from "@/registry/default/hooks/use-playback-rate"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function PlaybackRate() {
  const playbackRates = useMediaStore((state) => state.playbackRates)
  const playbackRate = useMediaStore((state) => state.playbackRate)
  const { setPlaybackRate } = usePlaybackRate()

  return (
    <Select
      value={playbackRate.toString()}
      onValueChange={(value) => setPlaybackRate(Number(value))}
    >
      <Button variant="ghost" size="icon" asChild>
        <SelectTrigger
          size="sm"
          className={`
            border-none bg-transparent px-8
            data-[highlighted]:!bg-accent
            data-[popup-open]:!bg-accent
            dark:bg-transparent
          `}
        >
          <SelectValue
            placeholder={playbackRate.toString()}
            render={(_, { value }) => {
              return <span className="select-none">{value}x</span>
            }}
          />
        </SelectTrigger>
      </Button>
      <SelectPositioner className="z-[100]" align="start">
        <SelectContent
          className={`
            min-w-24 backdrop-blur-sm
            dark:bg-accent/95
          `}
        >
          <SelectGroup>
            {playbackRates.map((rate) => (
              <SelectItem
                key={rate}
                value={rate.toString()}
                className={`
                  tracking-wider
                  dark:text-accent-foreground dark:hover:bg-primary/10
                `}
              >
                {rate}
                <span className="text-xs">x</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectPositioner>
    </Select>
  )
}
