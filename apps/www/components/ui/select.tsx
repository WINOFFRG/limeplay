"use client"

import { Select as SelectPrimitive } from "@base-ui-components/react/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <>
      <SelectScrollUpButton />
      <SelectPrimitive.Popup
        className={cn(
          `
            relative z-50 max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md
            border bg-popover p-1 text-popover-foreground shadow-md
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
        {children}
      </SelectPrimitive.Popup>
      <SelectScrollDownButton />
    </>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        `
          relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
          focus:bg-accent focus:text-accent-foreground
          data-disabled:pointer-events-none data-disabled:opacity-50
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground
          *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2
        `,
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      data-slot="select-label"
      {...props}
    />
  )
}

function SelectPositioner(
  props: React.ComponentProps<typeof SelectPrimitive.Positioner>
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        alignItemWithTrigger={false}
        data-slot="select-positioner"
        sideOffset={5}
        {...props}
      />
    </SelectPrimitive.Portal>
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
          z-51 flex h-6 w-full cursor-default items-center justify-center border bg-popover text-center text-base
          data-[direction=down]:rounded-b-md data-[direction=down]:border-t-0
          data-[direction=up]:rounded-t-md data-[direction=up]:border-b-0
        `,
        `
          before:absolute before:left-0 before:h-full before:w-full before:content-['']
          data-[direction=down]:bottom-0 data-[direction=down]:before:-bottom-full
          data-[direction=up]:before:top-full
        `,
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon className="size-4" />
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
          z-51 flex h-6 w-full cursor-default items-center justify-center border bg-popover text-center text-base
          data-[direction=down]:rounded-b-md data-[direction=down]:border-t-0
          data-[direction=up]:rounded-t-md data-[direction=up]:border-b-0
        `,
        `
          before:absolute before:left-0 before:h-full before:w-full before:content-['']
          data-[direction=down]:bottom-0 data-[direction=down]:before:-bottom-full
          data-[direction=up]:before:top-full
        `,
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
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
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "default" | "sm"
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        `
          flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs
          transition-[color,box-shadow] outline-none
          focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
          disabled:cursor-not-allowed disabled:opacity-50
          aria-invalid:border-destructive aria-invalid:ring-destructive/20
          data-placeholder:text-muted-foreground
          data-[size=default]:h-9
          data-[size=sm]:h-8
          *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center
          *:data-[slot=select-value]:gap-2
          dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground
        `,
        className
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="size-4 opacity-50" />}
      />
    </SelectPrimitive.Trigger>
  )
}
function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
  placeholder?: string
}) {
  if (!placeholder) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
  }

  return (
    <SelectPrimitive.Value
      render={(_, { value }) => {
        if (value) {
          return <SelectPrimitive.Value data-slot="select-value" {...props} />
        }

        // Placeholder
        return (
          <span className="text-muted-foreground" data-slot="select-value">
            {placeholder}
          </span>
        )
      }}
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
  SelectPositioner,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
