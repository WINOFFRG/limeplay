"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon } from "lucide-react"

import type { StreamPanelPlaylistPreset } from "@/components/stream-panel/content-catalog"
import type { StreamPanelSelection } from "@/lib/docs-dial-store"

import { cn } from "@/lib/utils"

import { OverlayShell, type OverlayShellPlacement } from "./overlay-shell"

interface PlaylistsOverlayProps {
  onBack: () => void
  onSelect: (playlist: StreamPanelPlaylistPreset) => void
  placement?: OverlayShellPlacement
  playlists: StreamPanelPlaylistPreset[]
  selection?: StreamPanelSelection
  show: boolean
}

export function PlaylistsOverlay({
  onBack,
  onSelect,
  placement,
  playlists,
  selection,
  show,
}: PlaylistsOverlayProps) {
  const menuOpen = placement ? placement !== "idle" : show

  return (
    <MenuPrimitive.Root open={menuOpen}>
      <OverlayShell
        onBack={onBack}
        placement={placement}
        show={show}
        title="Playlists"
      >
        <div className="no-scrollbar flex-1 overflow-y-auto p-2 pt-1">
          {playlists.length === 0 ? (
            <div className="flex h-full min-h-52 flex-col items-center justify-center px-5 text-center">
              <p className="text-sm font-medium text-foreground">
                No compatible playlists
              </p>
              <p className="mt-1 max-w-52 text-xs text-muted-foreground">
                This player can still load compatible streams.
              </p>
            </div>
          ) : (
            <MenuPrimitive.RadioGroup
              onValueChange={(playlistId) => {
                const playlist = playlists.find((item) => item.id === playlistId)
                if (playlist) onSelect(playlist)
              }}
              value={selection?.kind === "playlist" ? selection.id : ""}
            >
              <MenuPrimitive.Group>
                {playlists.map((playlist) => {
                  const selected =
                    selection?.kind === "playlist" &&
                    selection.id === playlist.id

                  return (
                    <MenuPrimitive.RadioItem
                      className={cn(
                        `
                          relative flex w-full items-center gap-3 rounded-[18px] p-2.5 text-sm outline-hidden
                          transition-[background-color,color,transform] select-none
                          hover:bg-foreground/4
                          focus:bg-foreground/4
                          active:scale-[0.985]
                        `,
                        selected && "font-medium"
                      )}
                      key={playlist.id}
                      value={playlist.id}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 pr-5">
                          <span className="truncate">{playlist.name}</span>
                          {playlist.count ? (
                            <span className="text-[10px] leading-none font-medium text-muted-foreground">
                              {playlist.count}
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {playlist.description}
                        </span>
                      </div>
                      <MenuPrimitive.RadioItemIndicator
                        render={
                          <span className="pointer-events-none absolute top-3 right-2 flex size-3.5 items-center justify-center text-foreground">
                            <CheckIcon className="size-4" />
                          </span>
                        }
                      />
                    </MenuPrimitive.RadioItem>
                  )
                })}
              </MenuPrimitive.Group>
            </MenuPrimitive.RadioGroup>
          )}
        </div>
      </OverlayShell>
    </MenuPrimitive.Root>
  )
}
