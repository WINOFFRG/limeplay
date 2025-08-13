import Image from "next/image"
import { CardsThreeIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Playlist() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="glass" aria-label="Open episodes">
          <CardsThreeIcon weight="fill" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        className="w-[360px] p-2"
        sideOffset={24}
        alignOffset={-12}
      >
        <DropdownMenuLabel>Episodes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <DropdownMenuItem key={index} className="p-0">
              <div className="flex w-full items-center gap-3 p-2">
                <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded">
                  <Image
                    src="/poster.webp"
                    alt={`Episode ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    Episode {index + 1}
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    Mock description for episode {index + 1}. This is
                    placeholder text.
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
