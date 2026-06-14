"use client"

import { DotsThreeVerticalIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/registry/default/blocks/audio-player/components/button"
import {
  DislikeIcon,
  DislikeSelectedIcon,
  LikeIcon,
  LikeSelectedIcon,
} from "@/registry/default/blocks/audio-player/components/icons"

export function ActionControls() {
  const [value, setValue] = React.useState<string>("")
  const toggleGroupProps = {
    onValueChange: (next: string | string[]) => {
      setValue(Array.isArray(next) ? (next[0] ?? "") : next)
    },
    spacing: 2,
    type: "single" as const,
    value,
  }

  return (
    <div className="flex items-center gap-1">
      <ToggleGroup
        {...(toggleGroupProps as unknown as React.ComponentProps<
          typeof ToggleGroup
        >)}
      >
        <ToggleGroupItem
          aria-label="Dislike"
          className={`
            cursor-pointer rounded-full p-1.5
            hover:bg-muted-foreground
            data-[state=on]:bg-transparent
          `}
          value="dislike"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              key={value === "dislike" ? "dislike-on" : "dislike-off"}
              transition={{ bounce: 0, duration: 0.3, type: "spring" }}
            >
              <Button asChild size="sm">
                {value === "dislike" ? (
                  <DislikeSelectedIcon aria-hidden="true" />
                ) : (
                  <DislikeIcon aria-hidden="true" />
                )}
              </Button>
            </motion.span>
          </AnimatePresence>
        </ToggleGroupItem>

        <ToggleGroupItem
          aria-label="Like"
          className={`
            cursor-pointer rounded-full p-1.5
            hover:bg-muted-foreground
            data-[state=on]:bg-transparent
          `}
          value="like"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              key={value === "like" ? "like-on" : "like-off"}
              transition={{ bounce: 0, duration: 0.3, type: "spring" }}
            >
              <Button asChild size="sm">
                {value === "like" ? (
                  <LikeSelectedIcon aria-hidden="true" />
                ) : (
                  <LikeIcon aria-hidden="true" />
                )}
              </Button>
            </motion.span>
          </AnimatePresence>
        </ToggleGroupItem>
      </ToggleGroup>

      <Button aria-label="More actions">
        <DotsThreeVerticalIcon aria-hidden="true" weight="bold" />
      </Button>
    </div>
  )
}
