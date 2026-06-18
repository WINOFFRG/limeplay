"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import type { StreamFeature, StreamPreset } from "@/lib/stream-presets"

import { getStreamSupport, initStreamSupport } from "@/lib/stream-support"
import { cn } from "@/lib/utils"

import { OverlayShell, type OverlayShellPlacement } from "./overlay-shell"

const FEATURE_LABELS: Record<StreamFeature, string> = {
  "4K": "4K",
  "5.1": "5.1",
  "AES-128": "AES-128",
  "Audio Only": "Audio",
  Captions: "CC",
  ClearKey: "ClearKey",
  "Dolby Atmos": "Atmos",
  "Dolby Vision": "DV",
  FairPlay: "FairPlay",
  HD: "HD",
  HDR: "HDR",
  LIVE: "Live",
  "Low Latency": "LL",
  "Multi-Language": "Multi-Lang",
  PlayReady: "PlayReady",
  Subtitles: "Subs",
  Thumbnails: "Thumbs",
  "Trick Play": "Trick",
  VR: "VR",
  Widevine: "Widevine",
}

const FEATURE_PRIORITY: StreamFeature[] = [
  "LIVE",
  "Low Latency",
  "4K",
  "HDR",
  "Dolby Vision",
  "Dolby Atmos",
  "5.1",
  "Audio Only",
  "Widevine",
  "ClearKey",
  "PlayReady",
  "FairPlay",
  "AES-128",
  "HD",
  "VR",
  "Subtitles",
  "Multi-Language",
  "Captions",
  "Thumbnails",
  "Trick Play",
]

interface PresetsOverlayProps {
  groupedPresets: Record<string, StreamPreset[]>
  onBack: () => void
  onSelect: (presetId: string) => void
  placement?: OverlayShellPlacement
  selectedPresetId?: string
  show: boolean
  title?: string
}

export function PresetsOverlay({
  groupedPresets,
  onBack,
  onSelect,
  placement,
  selectedPresetId,
  show,
  title = "Presets",
}: PresetsOverlayProps) {
  const [, setProbed] = useState(false)

  const allPresets = useMemo(
    () => Object.values(groupedPresets).flat(),
    [groupedPresets]
  )
  useEffect(() => {
    void initStreamSupport(allPresets).then(() => setProbed(true))
  }, [allPresets])

  const menuOpen = placement ? placement !== "idle" : show

  return (
    <MenuPrimitive.Root open={menuOpen}>
      <OverlayShell
        onBack={onBack}
        placement={placement}
        show={show}
        title={title}
      >
        <div className="no-scrollbar flex-1 overflow-y-auto p-2 pt-1">
          <MenuPrimitive.RadioGroup
            onValueChange={onSelect}
            value={selectedPresetId ?? ""}
          >
            {Object.entries(groupedPresets).map(([group, items]) => (
              <MenuPrimitive.Group className="space-y-1" key={group}>
                <MenuPrimitive.GroupLabel className="flex items-center gap-2 px-2 pt-1 pb-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase">
                    {group}
                  </span>
                  <MenuPrimitive.Separator className="h-px flex-1 bg-border/45" />
                </MenuPrimitive.GroupLabel>

                {items.map((preset) => {
                  const support = getStreamSupport(preset)
                  const displayFeatures = getDisplayFeatures(
                    preset.features,
                    preset.group === "Live"
                  )

                  return (
                    <span
                      key={preset.id}
                      title={!support.supported ? support.reason : undefined}
                    >
                      <MenuPrimitive.RadioItem
                        className={cn(
                          `
                            relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm outline-hidden
                            transition-[background-color,color,transform] select-none
                            hover:bg-foreground/4
                            focus:bg-foreground/4
                            active:scale-[0.985]
                          `,
                          preset.id === selectedPresetId && "font-medium",
                          !support.supported && "pointer-events-none opacity-40"
                        )}
                        value={preset.id}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 pr-5">
                            <span className="truncate">{preset.title}</span>
                          </div>
                          {preset.description ? (
                            <span className="mt-1 block truncate text-[11px] text-muted-foreground">
                              {preset.description}
                            </span>
                          ) : null}
                          {!support.supported ? (
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                              Unsupported
                            </span>
                          ) : displayFeatures.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {displayFeatures.map((feature) => (
                                <span
                                  className="rounded-xs bg-foreground/5 px-1.5 py-0.5 text-[10px]/3 font-medium text-muted-foreground"
                                  key={feature}
                                >
                                  {FEATURE_LABELS[feature]}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <MenuPrimitive.RadioItemIndicator
                          render={
                            <span className="pointer-events-none absolute top-3 right-2 flex size-3.5 items-center justify-center text-foreground">
                              <CheckIcon className="size-4" />
                            </span>
                          }
                        />
                      </MenuPrimitive.RadioItem>
                    </span>
                  )
                })}
              </MenuPrimitive.Group>
            ))}
          </MenuPrimitive.RadioGroup>
        </div>
      </OverlayShell>
    </MenuPrimitive.Root>
  )
}

function getDisplayFeatures(
  features: StreamFeature[],
  omitLive = false,
  max = 3
): StreamFeature[] {
  return features
    .filter((feature) => !omitLive || feature !== "LIVE")
    .toSorted(
      (a, b) => FEATURE_PRIORITY.indexOf(a) - FEATURE_PRIORITY.indexOf(b)
    )
    .slice(0, max)
}
