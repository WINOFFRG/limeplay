"use client"

import type { ReactNode } from "react"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const SIDEBAR_EASE = [0.23, 0.88, 0.26, 0.92] as const
const SIDEBAR_DURATION = 0.35

type BlocksSidebarItem = {
  description?: string
  href: string
  icon?: ReactNode
  status?: string
  title: string
}

export function BlocksSidebar({ items }: { items: BlocksSidebarItem[] }) {
  const pathname = usePathname()
  const { isMobile, open, openMobile } = useSidebar()
  const isExpanded = isMobile ? openMobile : open

  return (
    <>
      <SidebarDismissLayer />
      <motion.aside
        animate={{
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? "0%" : "-100%",
        }}
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72",
          !isExpanded && "pointer-events-none"
        )}
        initial={false}
        transition={{
          duration: SIDEBAR_DURATION,
          ease: SIDEBAR_EASE,
          opacity: { duration: isExpanded ? 0.1 : SIDEBAR_DURATION },
        }}
      >
        <GradualBlur />

        <nav
          className={`
            relative z-10 flex h-full flex-col gap-6 overflow-y-auto px-3 py-32 [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          `}
          data-lenis-prevent="true"
        >
          <div>
            <span className="mb-2 block px-3 text-[11px] font-medium tracking-wide text-muted-foreground/60 uppercase">
              Browse
            </span>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <SidebarItem
                  active={pathname === item.href}
                  href={item.href}
                  key={item.href}
                  label={item.title}
                />
              ))}
            </div>
          </div>
        </nav>
      </motion.aside>
    </>
  )
}

function GradualBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 isolate z-0"
    >
      <div className="relative size-full">
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(0.241rem)",
            maskImage:
              "linear-gradient(to left, transparent 0%, black 25%, black 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(0.625rem)",
            maskImage:
              "linear-gradient(to left, transparent 25%, black 50%, black 75%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(1.621rem)",
            maskImage:
              "linear-gradient(to left, transparent 50%, black 75%, black 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(2.5rem)",
            maskImage: "linear-gradient(to left, transparent 75%, black 100%)",
          }}
        />
      </div>
    </div>
  )
}

function SidebarDismissLayer() {
  const { isMobile, open, setOpen } = useSidebar()

  if (isMobile || !open) {
    return null
  }

  return (
    <button
      aria-label="Close Sidebar"
      className={`
        fixed inset-0 z-15 hidden bg-transparent
        md:block
      `}
      onClick={() => setOpen(false)}
      type="button"
    />
  )
}

function SidebarItem({
  active,
  href,
  label,
}: {
  active: boolean
  href: string
  label: string
}) {
  return (
    <Link
      className={cn(
        "block origin-left px-3 py-1.5 text-[13px] transition-all duration-200 ease-out",
        active
          ? "font-medium text-foreground"
          : `
            text-muted-foreground
            hover:scale-[1.03] hover:text-foreground
          `
      )}
      href={href}
    >
      {label}
    </Link>
  )
}
