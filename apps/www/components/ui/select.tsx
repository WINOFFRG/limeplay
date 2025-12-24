"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectContent({
  align = "center",
  alignItemWithTrigger = true,
  alignOffset = 0,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: Pick<
  SelectPrimitive.Positioner.Props,
  "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
> &
  SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className={cn(
            `
              relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden
              overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100
              data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
              data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
              data-[side=bottom]:slide-in-from-top-2
              data-[side=left]:slide-in-from-right-2
              data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2
            `,
            className
          )}
          data-slot="select-content"
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      className={cn("scroll-my-1 p-1", className)}
      data-slot="select-group"
      {...props}
    />
  )
}

function SelectItem({
  children,
  className,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        `
          relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
          focus:bg-accent focus:text-accent-foreground
          not-data-[variant=destructive]:focus:**:text-accent-foreground
          data-[disabled]:pointer-events-none data-[disabled]:opacity-50
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
          *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2
        `,
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      data-slot="select-label"
      {...props}
    />
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        `
          bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1
          [&_svg:not([class*='size-'])]:size-4
        `,
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        `
          top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1
          [&_svg:not([class*='size-'])]:size-4
        `,
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  )
}

function SelectTrigger({
  children,
  className,
  size = "default",
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "default" | "sm"
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        `
          flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap
          shadow-xs transition-[color,box-shadow] outline-none
          focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
          disabled:cursor-not-allowed disabled:opacity-50
          aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20
          data-[placeholder]:text-muted-foreground
          data-[size=default]:h-9
          data-[size=sm]:h-8
          *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center
          *:data-[slot=select-value]:gap-1.5
          dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
        `,
        className
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      className={cn("flex flex-1 text-left", className)}
      data-slot="select-value"
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
