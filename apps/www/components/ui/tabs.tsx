"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import * as React from "react"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      data-slot="tabs"
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        `
          inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium
          whitespace-nowrap text-foreground transition-[color,box-shadow]
          focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring
          disabled:pointer-events-none disabled:opacity-50
          aria-disabled:pointer-events-none aria-disabled:opacity-50
          data-active:bg-background data-active:shadow-sm
          dark:text-muted-foreground
          dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
        `,
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
