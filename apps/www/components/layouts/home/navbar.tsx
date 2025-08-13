"use client"

import React, { useState, type ComponentProps } from "react"
import type { LinkProps } from "next/link"
import Link from "next/link"
import type {
  NavigationMenuContentProps,
  NavigationMenuTriggerProps,
} from "@radix-ui/react-navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValueEvent, useScroll } from "motion/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { BaseLinkItem } from "@/components/layouts/links"

const navItemVariants = cva(
  `
    inline-flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold tracking-wide text-neutral-700 transition-colors duration-300
    hover:text-black
    data-[active=true]:text-fd-primary
    dark:text-neutral-300 dark:hover:text-white
    [&_svg]:size-4
  `
)

type MotionHeaderProps = React.ComponentPropsWithoutRef<typeof motion.header>
type NavbarProps = Omit<MotionHeaderProps, "children"> & {
  children?: React.ReactNode
}

export function Navbar(props: NavbarProps) {
  const [value, setValue] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const { scrollY } = useScroll()

  // Replace the complex useEffect with Framer Motion's useMotionValueEvent
  useMotionValueEvent(scrollY, "change", (currentY) => {
    const previous = scrollY.getPrevious() ?? 0
    const scrollingDown = currentY > previous
    const nextIsScrolled = currentY > 50

    setScrollDirection(scrollingDown ? "down" : "up")
    setIsScrolled(nextIsScrolled)

    if (scrollingDown && currentY > 150 && value.length === 0) {
      setIsHidden(true)
    } else if (!scrollingDown || currentY <= 100) {
      setIsHidden(false)
    }
  })

  // Keep the existing useEffect for menu open state
  React.useEffect(() => {
    if (value.length > 0) {
      setIsHidden(false)
    }
  }, [value])

  return (
    <NavigationMenu value={value} onValueChange={setValue}>
      <motion.header
        id="nd-nav"
        initial={false}
        {...props}
        className={cn(
          `fixed left-1/2 z-50 -translate-x-1/2 transition-[top,width] duration-300 ease-in-out will-change-transform`,
          // Keep your exact dynamic positioning and sizing logic
          !isScrolled && !isHidden
            ? `
              top-[50px] w-[min(1240px,calc(100%-2rem))]
              lg:w-[min(1240px,calc(100%-2rem))]
            `
            : `
              top-[30px] w-[min(960px,calc(100%-2rem))]
              lg:w-[min(960px,calc(100%-2rem))]
            `,
          props.className
        )}
        // Replace manual hide/show with Framer Motion animation
        animate={{
          y: isHidden ? -120 : 0,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          duration: isHidden && scrollDirection === "up" ? 0.4 : 0.3,
          ease:
            isHidden && scrollDirection === "up"
              ? [0.47, 1.64, 0.41, 0.8]
              : "easeInOut",
        }}
      >
        <nav
          className={cn(
            `
              relative w-full rounded-2xl border border-neutral-200/50 px-5 py-2 backdrop-blur-[20px] backdrop-saturate-[180%] transition-all
              duration-500 ease-linear
              dark:border-neutral-700/50
            `,
            // Keep your exact background and shadow logic
            !isScrolled
              ? `
                bg-white/30 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1),0px_15px_25px_0px_rgba(0,0,0,0.15)] backdrop-blur-md
                dark:bg-neutral-900/80 dark:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.3),0px_15px_25px_0px_rgba(0,0,0,0.4)] dark:backdrop-blur-md
              `
              : `
                border-transparent bg-white/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] backdrop-blur-md
                dark:bg-neutral-900/80 dark:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.4)] dark:backdrop-blur-md
              `,
            // Keep menu open override
            value.length > 0 &&
              `
                border-neutral-200/50 bg-white/30 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1),0px_15px_25px_0px_rgba(0,0,0,0.15)] backdrop-blur-md
                dark:border-neutral-700/50 dark:bg-neutral-900/30 dark:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.3),0px_15px_25px_0px_rgba(0,0,0,0.4)]
                dark:backdrop-blur-md
              `
          )}
        >
          <NavigationMenuList
            className={cn(
              `flex w-full flex-row items-center justify-between px-3`,
              !isScrolled || value.length > 0 ? "h-[44px]" : "h-[40px]"
            )}
            asChild
          >
            <div>{props.children}</div>
          </NavigationMenuList>
        </nav>
      </motion.header>
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
