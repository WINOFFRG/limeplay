"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon } from "lucide-react"
import { useEffect, useState } from "react"

import type { StreamFeature, StreamPreset } from "@/lib/stream-presets"

import { Badge } from "@/components/ui/badge"
import { useDocsDialStore } from "@/lib/docs-dial-store"
import { getStreamSupport, initStreamSupport } from "@/lib/stream-support"
import { cn } from "@/lib/utils"

import { OverlayShell } from "./overlay-shell"

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
  show: boolean
}

export function PresetsOverlay({
  groupedPresets,
  onBack,
  onSelect,
  show,
}: PresetsOverlayProps) {
  const presetId = useDocsDialStore((s) => s.presetId)
  const [, setProbed] = useState(false)

  const allPresets = Object.values(groupedPresets).flat()
  useEffect(() => {
    void initStreamSupport(allPresets).then(() => setProbed(true))
  }, [])

  return (
    <MenuPrimitive.Root open={show}>
      <OverlayShell onBack={onBack} show={show} title="Presets">
        <div className="no-scrollbar flex-1 overflow-y-auto p-2">
          <MenuPrimitive.RadioGroup onValueChange={onSelect} value={presetId}>
            {Object.entries(groupedPresets).map(([group, items], index) => (
              <MenuPrimitive.Group key={group}>
                {index > 0 && (
                  <MenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
                )}

                <MenuPrimitive.GroupLabel className="px-2 py-1.5 text-[11px] font-medium tracking-[0.14em] text-muted-foreground/80 uppercase">
                  {group}
                </MenuPrimitive.GroupLabel>

                {items.map((preset) => {
                  const support = getStreamSupport(preset)
                  const displayFeatures = getDisplayFeatures(preset.features)

                  return (
                    <MenuPrimitive.RadioItem
                      className={cn(
                        `
                          relative flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-hidden transition-[colors,transform]
                          select-none
                          hover:bg-accent/70 hover:text-accent-foreground
                          focus:bg-accent/70 focus:text-accent-foreground
                          active:scale-[0.985]
                        `,
                        preset.id === presetId &&
                          "bg-accent/85 font-medium text-accent-foreground",
                        !support.supported &&
                          "pointer-events-none opacity-40"
                      )}
                      disabled={!support.supported}
                      key={preset.id}
                      title={support.reason}
                      value={preset.id}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate pr-5">{preset.name}</span>
                        {(displayFeatures.length > 0 ||
                          !support.supported) && (
                          <div className="flex flex-wrap gap-1">
                            {displayFeatures.map((f) => (
                              <Badge
                                className="rounded-md px-1.5 py-0 text-[10px] leading-4"
                                key={f}
                                variant="secondary"
                              >
                                {FEATURE_LABELS[f]}
                              </Badge>
                            ))}
                            {!support.supported && (
                              <Badge
                                className="gap-0.5 rounded-md px-1.5 py-0 text-[10px] leading-4"
                                variant="destructive"
                              >
                                Unsupported
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <MenuPrimitive.RadioItemIndicator
                        render={
                          <span className="pointer-events-none absolute top-2.5 right-2 flex size-3.5 items-center justify-center">
                            <CheckIcon className="size-4" />
                          </span>
                        }
                      />
                    </MenuPrimitive.RadioItem>
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
  max = 3
): StreamFeature[] {
  return [...features]
    .sort(
      (a, b) => FEATURE_PRIORITY.indexOf(a) - FEATURE_PRIORITY.indexOf(b)
    )
    .slice(0, max)
}
