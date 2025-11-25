"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Tabs, TabsList } from "@/components/ui/tabs"

interface ComponentPreviewControlProps {
  children: React.ReactNode
  className?: string
  hideCode?: boolean
}

export function ComponentPreviewControl({
  children,
  className,
  hideCode = false,
}: ComponentPreviewControlProps) {
  const [activeTab, setActiveTab] = React.useState("preview")

  return (
    <Tabs
      defaultValue="preview"
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("relative mr-auto w-full rounded-none", className)}
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
                key={tab}
                value={tab}
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
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-full bg-muted"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsList>
        )}
      </div>
      {children}
    </Tabs>
  )
}
