"use client"

import { ChevronLeft } from "lucide-react"
import { motion } from "motion/react"
import * as React from "react"

import { Button } from "../ui/button"

interface OverlayShellProps {
  children: React.ReactNode
  onBack: () => void
  show: boolean
  title: string
}

export function OverlayShell({
  children,
  onBack,
  show,
  title,
}: OverlayShellProps) {
  return (
    <motion.div
      animate={{ x: show ? "0%" : "100%" }}
      className="absolute inset-0 z-10 flex flex-col bg-popover/98 backdrop-blur-[2px]"
      inert={!show ? true : undefined}
      initial={{ x: "100%" }}
      transition={{ bounce: 0, duration: show ? 0.3 : 0.15, type: "spring" }}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
        <Button
          className={`
            flex size-7 items-center justify-center rounded-lg text-muted-foreground outline-hidden transition-[colors,transform]
            hover:bg-accent hover:text-accent-foreground
            focus-visible:bg-accent focus-visible:text-accent-foreground
            active:scale-[0.97]
          `}
          onClick={onBack}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="text-sm font-semibold tracking-[0.01em]">
          {title}
        </span>
      </div>

      {children}
    </motion.div>
  )
}
