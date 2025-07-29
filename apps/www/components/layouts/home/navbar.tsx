"use client"

import React, {
  useState,
  type ComponentProps,
  type HTMLAttributes,
} from "react"
import type { LinkProps } from "next/link"
import Link from "next/link"
import type {
  NavigationMenuContentProps,
  NavigationMenuTriggerProps,
} from "@radix-ui/react-navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { useNav } from "@/components/contexts/layout"
import { BaseLinkItem } from "@/components/layouts/links"

const navItemVariants = cva(
  `
    inline-flex items-center gap-1 p-2 transition-colors
    hover:text-fd-accent-foreground
    data-[active=true]:text-fd-primary
    [&_svg]:size-4
  `
)

export function Navbar(props: HTMLAttributes<HTMLElement>) {
  const [value, setValue] = useState("")
  const { isTransparent } = useNav()

  return (
    <NavigationMenu value={value} onValueChange={setValue} asChild>
      <header
        id="nd-nav"
        {...props}
        className={cn(
          `
            relative top-(--fd-banner-height) left-1/2 z-40 box-content w-full max-w-[calc(100%-1rem)] -translate-x-1/2 border-b
            border-fd-foreground/10 transition-colors
            lg:w-[calc(100%-20rem)] lg:rounded-2xl lg:border
          `,
          value.length > 0 ? "shadow-lg" : "shadow-sm",
          (isTransparent || value.length > 0) &&
            "bg-fd-background/80 backdrop-blur-lg",
          props.className
        )}
      >
        <NavigationMenuList
          className={`
            flex h-14 w-full flex-row items-center px-6
            lg:h-12
          `}
          asChild
        >
          <nav>{props.children}</nav>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </header>
    </NavigationMenu>
  )
}

export const NavbarMenu = NavigationMenuItem

export function NavbarMenuContent(props: NavigationMenuContentProps) {
  return (
    <NavigationMenuContent
      {...props}
      className={cn(
        `
          grid grid-cols-1 gap-3 px-4 pb-4
          md:grid-cols-2
          lg:grid-cols-3
        `,
        props.className
      )}
    >
      {props.children}
    </NavigationMenuContent>
  )
}

export function NavbarMenuTrigger(props: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuTrigger
      {...props}
      className={cn(navItemVariants(), "rounded-md", props.className)}
    >
      {props.children}
    </NavigationMenuTrigger>
  )
}

interface NavbarMenuLinkProps extends React.PropsWithChildren<LinkProps> {
  className?: string
}

export function NavbarMenuLink(props: NavbarMenuLinkProps) {
  return (
    <NavigationMenuLink asChild>
      <Link
        {...props}
        className={cn(
          `
            flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors
            hover:bg-fd-accent/80 hover:text-fd-accent-foreground
          `,
          props.className
        )}
      >
        {props.children}
      </Link>
    </NavigationMenuLink>
  )
}

const linkVariants = cva("", {
  variants: {
    variant: {
      main: navItemVariants(),
      button: buttonVariants({
        variant: "secondary",
        className: "gap-1.5 [&_svg]:size-4",
      }),
      icon: buttonVariants({
        variant: "ghost",
        size: "icon",
      }),
    },
  },
  defaultVariants: {
    variant: "main",
  },
})

export function NavbarLink({
  item,
  variant,
  ...props
}: ComponentProps<typeof BaseLinkItem> & VariantProps<typeof linkVariants>) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <BaseLinkItem
          {...props}
          item={item}
          className={cn(linkVariants({ variant }), props.className)}
        >
          {props.children}
        </BaseLinkItem>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
