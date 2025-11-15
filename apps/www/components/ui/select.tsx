"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui-components/react/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
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
          <span data-slot="select-value" className="text-muted-foreground">
            {placeholder}
          </span>
        )
      }}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        `
          flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs
          transition-[color,box-shadow] outline-none
          focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
          disabled:cursor-not-allowed disabled:opacity-50
          aria-invalid:border-destructive aria-invalid:ring-destructive/20
          data-[placeholder]:text-muted-foreground
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
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="size-4 opacity-50" />}
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectPositioner(
  props: React.ComponentProps<typeof SelectPrimitive.Positioner>
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        alignItemWithTrigger={false}
        sideOffset={5}
        {...props}
      />
    </SelectPrimitive.Portal>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <>
      <SelectScrollUpButton />
      <SelectPrimitive.Popup
        data-slot="select-content"
        className={cn(
          `
            relative z-50 max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md
            border bg-popover p-1 text-popover-foreground shadow-md
            data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95
            data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95
            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
          `,
          className
        )}
        {...props}
      >
        {children}
      </SelectPrimitive.Popup>
      <SelectScrollDownButton />
    </>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        `
          relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
          focus:bg-accent focus:text-accent-foreground
          data-[disabled]:pointer-events-none data-[disabled]:opacity-50
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground
          *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2
        `,
        className
      )}
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

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
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
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
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
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectPositioner,
}
