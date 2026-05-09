"use client"

import { ChevronRight, PlusIcon, XIcon } from "lucide-react"
import React, { useMemo, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useDocsDialStore } from "@/lib/docs-dial-store"
import { getPresetsForType, type StreamPreset } from "@/lib/stream-presets"
import { cn } from "@/lib/utils"

import { CustomOverlay } from "./custom-overlay"
import { PanelHeaderIcon } from "./panel-header"
import { PanelSlider } from "./panel-slider"
import { PresetsOverlay } from "./presets-overlay"
import { useStreamPanel } from "./provider"
import { SavedOverlay } from "./saved-overlay"

export type PanelPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"

type ActiveOverlay = "custom" | "none" | "presets" | "saved"

interface StreamPanelProps {
  align?: "center" | "end" | "start"
  onLoadStream?: (src: string, config?: string) => void
  onPresetChange?: (preset: StreamPreset) => void
  playerType?: "audio" | "video"
  position?: PanelPosition
  side?: "bottom" | "left" | "right" | "top"
  variant?: "anchored" | "floating"
}

const positionClasses: Record<PanelPosition, string> = {
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "-bottom-10 right-4",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
}

const originMap: Record<PanelPosition, string> = {
  "bottom-left": "origin-bottom-left",
  "bottom-right": "origin-bottom-right",
  "top-left": "origin-top-left",
  "top-right": "origin-top-right",
}

export function StreamPanel({
  align = "center",
  onLoadStream,
  onPresetChange,
  playerType = "video",
  position = "bottom-right",
  side = "bottom",
  variant = "floating",
}: StreamPanelProps) {
  const { handle, onOpenChange, open } = useStreamPanel()
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>("none")

  React.useEffect(() => {
    if (!open) setActiveOverlay("none")
  }, [open])

  const store = useDocsDialStore()
  const presets = getPresetsForType(playerType)

  const groupedPresets = useMemo(() => {
    const groups: Record<string, StreamPreset[]> = {}
    for (const preset of presets) {
      const tag = preset.tags?.[0]?.toUpperCase() ?? preset.format.toUpperCase()
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(preset)
    }
    return groups
  }, [presets])

  const selectedPresetName = useMemo(
    () => presets.find((preset) => preset.id === store.presetId)?.name ?? "Select a stream",
    [presets, store.presetId]
  )

  const handlePresetChange = (presetId: string) => {
    store.setPresetId(presetId)
    const preset = presets.find((p) => p.id === presetId)
    if (preset) onPresetChange?.(preset)
  }

  const handleLoadCustom = (src: string, config?: string) => {
    onLoadStream?.(src, config)
    setActiveOverlay("none")
  }

  const handleLoadSaved = (stream: { config?: string; src: string }) => {
    onLoadStream?.(stream.src, stream.config)
    setActiveOverlay("none")
  }

  return (
    <Popover handle={handle} onOpenChange={onOpenChange} open={open}>
      <PopoverContent
        align={align}
        className={cn(
          `
            relative min-h-90 gap-4 overflow-hidden rounded-[20px] border border-border/60 bg-popover/90 tracking-wide text-popover-foreground
            backdrop-blur-lg
          `,
          variant === "floating" && originMap[position],
          variant === "floating" && positionClasses[position]
        )}
        positionMethod={variant === "floating" ? "fixed" : undefined}
        side={side}
      >
        <div className="flex items-center justify-between">
          <PopoverTitle className="m-0! text-[13px] font-semibold tracking-[0.01em]">
            Configuration
          </PopoverTitle>
          <PopoverClose
            className={`
              flex size-6 items-center justify-center rounded-md text-muted-foreground transition-[colors,transform]
              hover:bg-muted hover:text-foreground
              active:scale-[0.97]
            `}
          >
            <XIcon className="size-4" />
          </PopoverClose>
        </div>

        <Field className="gap-2.5">
          <FieldLabel
            className={`
              flex items-center gap-2 px-1 text-[10px] leading-none font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase
              after:h-px after:flex-1 after:bg-border/60 after:content-['']
            `}
          >
            Media
          </FieldLabel>
          <div className="flex flex-col gap-1">
            {/* <PanelSlider
              label="Volume"
              max={100}
              min={0}
              onChange={store.setVolume}
              value={store.volume}
            /> */}

            <div className="flex h-11 items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 text-sm">
              <span className="text-muted-foreground">Muted</span>
              <ToggleGroup
                className="gap-0"
                onValueChange={(v) => {
                  if (v) store.setMuted(v === "on")
                }}
                size="sm"
                type="single"
                value={store.muted ? "on" : "off"}
              >
                <ToggleGroupItem size="sm" value="off">
                  Off
                </ToggleGroupItem>
                <ToggleGroupItem size="sm" value="on">
                  On
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex h-11 items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 text-sm">
              <span className="text-muted-foreground">Autoplay</span>
              <ToggleGroup
                onValueChange={(v) => {
                  if (v) store.setAutoplay(v === "on")
                }}
                size="sm"
                type="single"
                value={store.autoplay ? "on" : "off"}
              >
                <ToggleGroupItem size="sm" value="off">
                  Off
                </ToggleGroupItem>
                <ToggleGroupItem size="sm" value="on">
                  On
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </Field>

        <Field className="gap-2.5 pt-1">
          <FieldLabel
            className={`
              flex items-center gap-2 px-1 text-[10px] leading-none font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase
              after:h-px after:flex-1 after:bg-border/60 after:content-['']
            `}
          >
            Presets
          </FieldLabel>
          <button
            className={`
              flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 text-left text-sm text-foreground
              outline-hidden transition-[colors,transform,border-color]
              hover:border-border/70 hover:bg-accent/60 hover:text-accent-foreground
              focus-visible:border-border/70 focus-visible:bg-accent/60 focus-visible:text-accent-foreground
              active:scale-[0.985]
            `}
            onClick={() => setActiveOverlay("presets")}
            type="button"
          >
            <span className="text-sm text-muted-foreground">{selectedPresetName}</span>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </Field>

        <Field className="gap-2.5 pt-1">
          <FieldLabel
            className={`
              flex items-center gap-2 px-1 text-[10px] leading-none font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase
              after:h-px after:flex-1 after:bg-border/60 after:content-['']
            `}
          >
            Custom Stream
          </FieldLabel>
          <div className="flex flex-col gap-1">
            {store.savedStreams.length > 0 && (
              <button
                className={`
                  flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 text-left text-sm
                  text-foreground outline-hidden transition-[colors,transform,border-color]
                  hover:border-border/70 hover:bg-accent/60 hover:text-accent-foreground
                  focus-visible:border-border/70 focus-visible:bg-accent/60 focus-visible:text-accent-foreground
                  active:scale-[0.985]
                `}
                onClick={() => setActiveOverlay("saved")}
                type="button"
              >
                <span className="text-sm text-muted-foreground">
                  {`${store.savedStreams.length} saved stream${
                    store.savedStreams.length > 1 ? "s" : ""
                  }`}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            )}
            <button
              className={`
                flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 text-left text-sm text-foreground
                outline-hidden transition-[colors,transform,border-color]
                hover:border-border/70 hover:bg-accent/60 hover:text-accent-foreground
                focus-visible:border-border/70 focus-visible:bg-accent/60 focus-visible:text-accent-foreground
                active:scale-[0.985]
              `}
              onClick={() => setActiveOverlay("custom")}
              type="button"
            >
              <span className="text-sm text-muted-foreground">Add Custom</span>
              <PlusIcon className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          </div>
        </Field>

        <PresetsOverlay
          groupedPresets={groupedPresets}
          onBack={() => setActiveOverlay("none")}
          onSelect={(presetId) => {
            handlePresetChange(presetId)
            setActiveOverlay("none")
          }}
          show={activeOverlay === "presets"}
        />

        <SavedOverlay
          onBack={() => setActiveOverlay("none")}
          onSelect={handleLoadSaved}
          show={activeOverlay === "saved"}
        />

        <CustomOverlay
          onBack={() => setActiveOverlay("none")}
          onLoad={handleLoadCustom}
          show={activeOverlay === "custom"}
        />
      </PopoverContent>
    </Popover>
  )
}
