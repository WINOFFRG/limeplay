"use client"

import type { ReactNode } from "react"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
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
      <FloatingSidebarToggle />
      <motion.aside
        animate={{
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? "0%" : "-100%",
        }}
        className={cn("fixed left-2 z-20 h-dvh w-[320px] p-4 pr-2 pl-2")}
        initial={false}
        transition={{
          duration: SIDEBAR_DURATION,
          ease: SIDEBAR_EASE,
        }}
      >
        <div
          className={`
            flex h-full w-full flex-col rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground
            shadow-[0_18px_50px_rgba(15,23,42,0.08)]
          `}
        >
          <SidebarHeader className="gap-1 px-3 pt-14 pb-2">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-base font-medium text-sidebar-foreground">
                Blocks
              </h2>
              <span className="text-xs text-sidebar-foreground/50">
                {items.length}
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent className="pb-4" data-lenis-prevent="true">
            <SidebarGroup className="px-2">
              <SidebarGroupLabel>Browse</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarItem
                      active={pathname === item.href}
                      href={item.href}
                      icon={item.icon}
                      key={item.href}
                      label={item.title}
                      status={item.status}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </div>
      </motion.aside>
    </>
  )
}

function FloatingSidebarToggle() {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar()
  const isExpanded = isMobile ? openMobile : open

  return (
    <motion.span
      animate={{
        height: isExpanded && !isMobile ? "42px" : "32px",
        width: isExpanded && !isMobile ? "42px" : "32px",
        x: isExpanded && !isMobile ? "-10px" : "0px",
        y: isExpanded && !isMobile ? "-10px" : "0px",
      }}
      className="fixed top-0 left-10 z-[21] mt-[35.5px] flex items-center justify-center rounded-xl bg-background"
      initial={false}
      onClick={toggleSidebar}
      transition={{
        duration: SIDEBAR_DURATION,
        ease: SIDEBAR_EASE,
      }}
    >
      <button
        className={`
          flex size-full items-center justify-center rounded-xl border border-border/70 bg-background/96 text-foreground/60
          shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-[color,box-shadow] duration-300
          hover:text-foreground/80 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
          active:scale-[0.98]
        `}
        type="button"
      >
        <div className="relative grid items-center justify-center">
          <svg
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M0.32698 2.63803C0 3.27976 0 4.11984 0 5.8V10.2C0 11.8802 0 12.7202 0.32698 13.362C0.614601 13.9265 1.07354 14.3854 1.63803 14.673C2.27976 15 3.11984 15 4.8 15H11.2C12.8802 15 13.7202 15 14.362 14.673C14.9265 14.3854 15.3854 13.9265 15.673 13.362C16 12.7202 16 11.8802 16 10.2V5.8C16 4.11984 16 3.27976 15.673 2.63803C15.3854 2.07354 14.9265 1.6146 14.362 1.32698C13.7202 1 12.8802 1 11.2 1H4.8C3.11984 1 2.27976 1 1.63803 1.32698C1.07354 1.6146 0.614601 2.07354 0.32698 2.63803Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          <motion.div
            animate={{
              x: isExpanded ? 0 : 6.5,
            }}
            className="absolute left-[3px] h-[10px] w-[1.5px] rounded-[1px] bg-background"
            transition={{
              duration: SIDEBAR_DURATION,
              ease: SIDEBAR_EASE,
            }}
          />
        </div>
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    </motion.span>
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
        fixed inset-0 z-[15] hidden bg-transparent
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
  icon,
  label,
  status,
}: {
  active: boolean
  href: string
  icon?: ReactNode
  label: string
  status?: string
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link href={href}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
      {status ? (
        <SidebarMenuBadge
          className={cn(
            "right-2 rounded-sm border px-1.5 text-[10px] tracking-[0.12em] uppercase",
            status === "pro" &&
              "border-amber-500/20 bg-amber-500/10 text-amber-700",
            status === "free" &&
              "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
          )}
        >
          {status}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  )
}
