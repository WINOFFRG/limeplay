"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"

import { Tabs, TabsList } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ComponentPreviewControlProps {
  children: React.ReactNode
  className?: string
  hideCode?: boolean
  trailingSlot?: React.ReactNode
}

export function ComponentPreviewControl({
  children,
  className,
  hideCode = false,
  trailingSlot,
}: ComponentPreviewControlProps) {
  const [activeTab, setActiveTab] = React.useState("preview")
  const childArray = React.Children.toArray(children)

  return (
    <Tabs
      className={cn("relative mr-auto w-full rounded-none", className)}
      defaultValue="preview"
      onValueChange={setActiveTab}
      value={activeTab}
    >
      <div className="flex items-center justify-between pb-3">
        {!hideCode && (
          <TabsList
            className={cn(
              "relative flex w-fit items-center gap-1 rounded-full border border-border/60",
              "bg-transparent p-px text-sm shadow-none"
            )}
          >
            {["preview", "code"].map((tab) => (
              <TabsPrimitive.Trigger
                className={cn(
                  `
                    relative inline-flex h-8 min-w-24 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium
                    transition-colors
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
                    disabled:pointer-events-none disabled:opacity-50
                  `,
                  activeTab === tab
                    ? "text-foreground"
                    : `
                      text-muted-foreground
                      hover:text-foreground
                    `
                )}
                key={tab}
                value={tab}
              >
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-muted"
                    layoutId="active-tab-indicator"
                    transition={{
                      bounce: 0.2,
                      duration: 0.6,
                      type: "spring",
                    }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsList>
        )}
        {trailingSlot ? (
          <div className="flex items-center gap-1.5">{trailingSlot}</div>
        ) : null}
      </div>
      <div className="overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "preview" ? 50 : -50 }}
            initial={{ opacity: 0, x: activeTab === "preview" ? -50 : 50 }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {childArray}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  )
}
