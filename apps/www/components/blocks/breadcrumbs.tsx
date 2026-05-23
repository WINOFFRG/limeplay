"use client"

import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { SidebarToggleIcon } from "@/components/sidebar-toggle-icon"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function BlockTopBar({ title }: { title: string }) {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar()
  const isOpen = isMobile ? openMobile : open

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-12 items-center select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backdropFilter: "blur(4px)",
          background:
            "linear-gradient(to bottom, color-mix(in oklch, var(--background) 80%, transparent) 0%, transparent 100%)",
          height: "106px",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitBackdropFilter: "blur(4px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          width: "100%",
          willChange: "backdrop-filter",
        }}
      />

      <div
        className={cn(
          "pointer-events-auto relative z-150 flex items-center gap-3 px-6 pt-6",
          `
            opacity-100 transition-opacity duration-300 ease-out
            in-data-[block-preview-expanded=true]:pointer-events-none in-data-[block-preview-expanded=true]:opacity-0
          `
        )}
      >
        <div>
          <button
            aria-label="Toggle sidebar"
            className={`
              inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all
              hover:bg-accent hover:text-accent-foreground
              dark:hover:bg-accent/50
            `}
            onClick={toggleSidebar}
            type="button"
          >
            <SidebarToggleIcon
              className="size-5"
              isOpen={isOpen}
              strokeWidth={2.5}
            />
          </button>
        </div>
        <nav aria-label="breadcrumb">
          <ol
            className={`
              flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground
              sm:gap-2.5
            `}
          >
            <li className="inline-flex items-center gap-1.5">
              <Link
                className={`
                  text-sm text-foreground/50 transition-colors
                  hover:text-foreground
                `}
                href="/"
              >
                Blocks
              </Link>
            </li>
            <li
              aria-hidden="true"
              className="[&>svg]:size-3.5"
              role="presentation"
            >
              <ChevronRightIcon />
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span
                aria-current="page"
                className="text-sm font-medium text-foreground"
              >
                {title}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  )
}
