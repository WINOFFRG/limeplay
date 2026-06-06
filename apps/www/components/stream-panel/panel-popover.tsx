"use client"

import type { CentralIconBaseProps } from "@central-icons-react/round-filled-radius-0-stroke-1/CentralIconBase"

import { IconBookmarkPlus } from "@central-icons-react/round-filled-radius-0-stroke-1/IconBookmarkPlus"
import { IconProjects } from "@central-icons-react/round-filled-radius-0-stroke-1/IconProjects"
import { ChevronRight } from "lucide-react"
import React, { useMemo, useState } from "react"

import type { StreamPanelContentKind } from "@/components/stream-panel/use-stream-panel"

import { getPlaylistPresetsForType } from "@/components/stream-panel/content-catalog"
import { useStreamPanelStore } from "@/components/stream-panel/use-stream-panel"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getPresetsForType, type StreamPreset } from "@/lib/stream-presets"
import { cn } from "@/lib/utils"

import type { OverlayShellPlacement } from "./overlay-shell"

import { ContentOverviewOverlay } from "./content-overview-overlay"
import { CustomOverlay } from "./custom-overlay"
import {
  type PanelPosition,
  STREAM_PANEL_CONTENT_OVERLAYS,
  STREAM_PANEL_EMPTY_CONTENT_LABEL,
  STREAM_PANEL_ORIGIN_CLASSES,
  STREAM_PANEL_OVERLAY,
  STREAM_PANEL_POSITION_CLASSES,
  type StreamPanelOverlay,
  type StreamPanelProps,
} from "./panel-popover.config"
import { PlaylistsOverlay } from "./playlists-overlay"
import { PresetsOverlay } from "./presets-overlay"
import { useStreamPanel } from "./provider"
import { SavedOverlay } from "./saved-overlay"

export type { PanelPosition, StreamPanelProps }

export function StreamPanel({
  align = "center",
  onLoadStream,
  onPlaylistChange,
  onPresetChange,
  playerType = "video",
  position = "bottom-right",
  side = "bottom",
  variant = "floating",
}: StreamPanelProps) {
  const { handle, onOpenChange, open, setOpen } = useStreamPanel()
  const [overlayStack, setOverlayStack] = useState<StreamPanelOverlay[]>([])

  React.useEffect(() => {
    if (!open) setOverlayStack([])
  }, [open])

  const store = useStreamPanelStore()
  const presets = getPresetsForType(playerType)
  const streamPresets = useMemo(
    () => presets.filter((preset) => preset.group !== "Live"),
    [presets]
  )
  const livePresets = useMemo(
    () => presets.filter((preset) => preset.group === "Live"),
    [presets]
  )
  const playlistPresets = useMemo(
    () => getPlaylistPresetsForType(playerType),
    [playerType]
  )
  const contentSelection = store.contentSelections[playerType]
  const groupedStreamPresets = useMemo(
    () => groupPresets(streamPresets),
    [streamPresets]
  )
  const groupedLivePresets = useMemo(
    () => groupPresets(livePresets),
    [livePresets]
  )

  const selectedContentName = useMemo(() => {
    if (!contentSelection) return STREAM_PANEL_EMPTY_CONTENT_LABEL

    if (contentSelection.kind === "playlist") {
      return (
        playlistPresets.find((playlist) => playlist.id === contentSelection.id)
          ?.name ?? STREAM_PANEL_EMPTY_CONTENT_LABEL
      )
    }

    return (
      presets.find((preset) => preset.id === contentSelection.id)?.name ??
      STREAM_PANEL_EMPTY_CONTENT_LABEL
    )
  }, [contentSelection, playlistPresets, presets])

  const handlePresetChange = (
    presetId: string,
    kind: Extract<StreamPanelContentKind, "live" | "stream">
  ) => {
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return

    store.setContentSelection(playerType, { id: presetId, index: 0, kind })
    onPresetChange?.(preset, kind)
  }

  const handleLoadCustom = (src: string, config?: string) => {
    onLoadStream?.(src, config)
    closeOverlays()
  }

  const handleLoadSaved = (stream: { config?: string; src: string }) => {
    onLoadStream?.(stream.src, stream.config)
    closeOverlays()
  }

  const activeOverlay =
    overlayStack.length > 0
      ? overlayStack[overlayStack.length - 1]
      : STREAM_PANEL_OVERLAY.NONE

  const openOverlay = (overlay: StreamPanelOverlay) => {
    if (overlay === STREAM_PANEL_OVERLAY.NONE) {
      setOverlayStack([])
      return
    }

    setOverlayStack((currentStack) => {
      const existingIndex = currentStack.indexOf(overlay)
      if (existingIndex !== -1) return currentStack.slice(0, existingIndex + 1)
      return [...currentStack, overlay]
    })
  }

  const closeOverlays = () => {
    setOverlayStack([])
  }

  const getOverlayPlacement = (
    overlay: StreamPanelOverlay
  ): OverlayShellPlacement => {
    const overlayIndex = overlayStack.indexOf(overlay)
    if (overlayIndex === -1) return "idle"
    return overlayIndex === overlayStack.length - 1 ? "active" : "covered"
  }

  const presetOverlays = [
    {
      groupedPresets: groupedStreamPresets,
      kind: "stream",
      overlay: STREAM_PANEL_OVERLAY.STREAMS,
      title: "Streams",
    },
    {
      groupedPresets: groupedLivePresets,
      kind: "live",
      overlay: STREAM_PANEL_OVERLAY.LIVE,
      title: "Live",
    },
  ] satisfies {
    groupedPresets: Record<string, StreamPreset[]>
    kind: Extract<StreamPanelContentKind, "live" | "stream">
    overlay: StreamPanelOverlay
    title: string
  }[]

  const content = (
    <div
      className="relative mt-2 grid max-h-(--stream-panel-max-height,100dvh) min-h-0 w-full overflow-hidden rounded-lg"
      data-stream-panel-root=""
    >
      <div
        className={cn(
          "col-start-1 row-start-1 flex min-h-0 w-full flex-col gap-2",
          activeOverlay !== STREAM_PANEL_OVERLAY.NONE &&
            "pointer-events-none absolute inset-x-0 top-0 opacity-0"
        )}
        inert={activeOverlay !== STREAM_PANEL_OVERLAY.NONE ? true : undefined}
      >
        <Field className="gap-0">
          <FieldLabel className="mx-2 text-[10px] text-muted-foreground/70 uppercase">
            Media Settings
          </FieldLabel>

          <PanelToggleRow onValueChange={store.setMuted} value={store.muted}>
            Muted
          </PanelToggleRow>
          <PanelToggleRow
            onValueChange={store.setAutoplay}
            value={store.autoplay}
          >
            Autoplay
          </PanelToggleRow>
        </Field>

        <Separator className="h-px bg-border/45" />

        <PanelActionRow
          detail={selectedContentName}
          Icon={IconProjects}
          label="Presets"
          onClick={() => openOverlay(STREAM_PANEL_OVERLAY.CONTENT)}
        />

        <PanelActionRow
          detail={
            store.savedStreams.length > 0
              ? `${store.savedStreams.length} saved stream${
                  store.savedStreams.length > 1 ? "s" : ""
                }`
              : "Add a custom stream"
          }
          Icon={IconBookmarkPlus}
          label="Saved Streams"
          onClick={() => openOverlay(STREAM_PANEL_OVERLAY.SAVED)}
        />
      </div>

      <div
        className="
          relative col-start-1 row-start-1 max-h-[inherit] min-h-0 overflow-hidden rounded-lg
          data-[empty=true]:pointer-events-none data-[empty=true]:absolute data-[empty=true]:inset-0
        "
        data-empty={activeOverlay === STREAM_PANEL_OVERLAY.NONE}
      >
        <div
          className="relative max-h-[inherit] min-h-0 rounded-lg"
          inert={activeOverlay === STREAM_PANEL_OVERLAY.NONE ? true : undefined}
        >
          {presetOverlays.map((presetOverlay) => (
            <PresetsOverlay
              groupedPresets={presetOverlay.groupedPresets}
              key={presetOverlay.overlay}
              onBack={() => openOverlay(STREAM_PANEL_OVERLAY.CONTENT)}
              onSelect={(presetId) => {
                handlePresetChange(presetId, presetOverlay.kind)
                closeOverlays()
                setOpen(false)
              }}
              placement={getOverlayPlacement(presetOverlay.overlay)}
              selectedPresetId={
                contentSelection?.kind === presetOverlay.kind
                  ? contentSelection.id
                  : undefined
              }
              show={activeOverlay === presetOverlay.overlay}
              title={presetOverlay.title}
            />
          ))}

          <PlaylistsOverlay
            onBack={() => openOverlay(STREAM_PANEL_OVERLAY.CONTENT)}
            onSelect={(playlist) => {
              store.setContentSelection(playerType, {
                id: playlist.id,
                index: 0,
                kind: "playlist",
              })
              onPlaylistChange?.(playlist)
              closeOverlays()
              setOpen(false)
            }}
            placement={getOverlayPlacement(STREAM_PANEL_OVERLAY.PLAYLISTS)}
            playlists={playlistPresets}
            selection={contentSelection}
            show={activeOverlay === STREAM_PANEL_OVERLAY.PLAYLISTS}
          />

          <ContentOverviewOverlay
            liveCount={livePresets.length}
            onBack={closeOverlays}
            onSelect={(kind) => {
              openOverlay(STREAM_PANEL_CONTENT_OVERLAYS[kind])
            }}
            placement={getOverlayPlacement(STREAM_PANEL_OVERLAY.CONTENT)}
            playerType={playerType}
            playlistCount={playlistPresets.length}
            show={activeOverlay === STREAM_PANEL_OVERLAY.CONTENT}
            streamCount={streamPresets.length}
          />

          <SavedOverlay
            onAddCustom={() => openOverlay(STREAM_PANEL_OVERLAY.CUSTOM)}
            onBack={closeOverlays}
            onSelect={handleLoadSaved}
            placement={getOverlayPlacement(STREAM_PANEL_OVERLAY.SAVED)}
            show={activeOverlay === STREAM_PANEL_OVERLAY.SAVED}
          />

          <CustomOverlay
            onBack={() => openOverlay(STREAM_PANEL_OVERLAY.SAVED)}
            onLoad={handleLoadCustom}
            placement={getOverlayPlacement(STREAM_PANEL_OVERLAY.CUSTOM)}
            show={activeOverlay === STREAM_PANEL_OVERLAY.CUSTOM}
          />
        </div>
      </div>
    </div>
  )

  if (variant === "children") return content

  return (
    <Popover handle={handle} onOpenChange={onOpenChange} open={open}>
      <PopoverContent
        align={align}
        className={cn(
          `
            dark relative max-h-(--stream-panel-max-height) w-72 gap-2 overflow-hidden rounded-lg bg-background/95 p-2 text-foreground shadow-2xl
            shadow-background/40 backdrop-blur-xl
          `,
          variant === "floating" && STREAM_PANEL_ORIGIN_CLASSES[position],
          variant === "floating" && STREAM_PANEL_POSITION_CLASSES[position]
        )}
        positionMethod={variant === "floating" ? "fixed" : undefined}
        side={side}
        sideOffset={50}
        style={
          {
            "--stream-panel-max-height":
              "min(420px, calc(var(--available-height, 100dvh) - 0.5rem))",
          } as React.CSSProperties
        }
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}

function groupPresets(presets: StreamPreset[]): Record<string, StreamPreset[]> {
  const groups: Partial<Record<string, StreamPreset[]>> = {}
  for (const preset of presets) {
    const group = preset.group
    if (!groups[group]) groups[group] = []
    groups[group].push(preset)
  }
  return groups as Record<string, StreamPreset[]>
}

function PanelActionRow({
  detail,
  Icon,
  label,
  onClick,
}: {
  detail?: string
  Icon?: React.FC<CentralIconBaseProps>
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={`
        group flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm text-foreground outline-hidden
        transition-[background-color,color,transform]
        hover:bg-foreground/4
        focus-visible:bg-foreground/4
        active:scale-[0.985]
      `}
      onClick={onClick}
      type="button"
    >
      {Icon ? (
        <span
          className="
            flex size-7 shrink-0 items-center justify-center text-muted-foreground transition-colors
            group-hover:text-foreground
          "
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium tracking-tight">
          {label}
        </span>
        {detail ? (
          <span className="block truncate text-xs text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </span>
      <ChevronRight
        className="
          size-3.5 shrink-0 text-muted-foreground transition-transform
          group-hover:translate-x-0.5
        "
      />
    </button>
  )
}

function PanelToggleRow({
  children,
  onValueChange,
  value,
}: {
  children: React.ReactNode
  onValueChange: (value: boolean) => void
  value: boolean
}) {
  return (
    <div className="flex h-10 items-center justify-between rounded-lg px-2.5 text-sm">
      <span className="font-medium text-foreground/85">{children}</span>
      <ToggleGroup
        onValueChange={(v) => {
          if (v) onValueChange(v === "on")
        }}
        type="single"
        value={value ? "on" : "off"}
      >
        <ToggleGroupItem className="h-7 rounded-lg px-3 text-xs" value="off">
          Off
        </ToggleGroupItem>
        <ToggleGroupItem className="h-7 rounded-lg px-3 text-xs" value="on">
          On
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
