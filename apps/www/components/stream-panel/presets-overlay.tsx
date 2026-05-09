"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon } from "lucide-react"

import { useDocsDialStore } from "@/lib/docs-dial-store"
import { type StreamPreset } from "@/lib/stream-presets"
import { cn } from "@/lib/utils"

import { OverlayShell } from "./overlay-shell"

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

                {items.map((preset) => (
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
                        "bg-accent/85 font-medium text-accent-foreground"
                    )}
                    key={preset.id}
                    value={preset.id}
                  >
                    <span className="truncate">{preset.name}</span>
                    <MenuPrimitive.RadioItemIndicator
                      render={
                        <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                          <CheckIcon className="size-4" />
                        </span>
                      }
                    />
                  </MenuPrimitive.RadioItem>
                ))}
              </MenuPrimitive.Group>
            ))}
          </MenuPrimitive.RadioGroup>
        </div>
      </OverlayShell>
    </MenuPrimitive.Root>
  )
}
