"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { BaseLinkItem, type LinkItemType } from "@/components/layouts/links";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const menuItemVariants = cva("", {
  variants: {
    variant: {
      main: `
        inline-flex items-center gap-2 py-1.5 transition-colors
        hover:text-popover-foreground/50
        data-[active=true]:font-medium data-[active=true]:text-primary
        [&_svg]:size-4
      `,
      icon: buttonVariants({
        size: "icon",
        variant: "ghost",
      }),
      button: buttonVariants({
        variant: "secondary",
        className: "gap-1.5 [&_svg]:size-4",
      }),
    },
  },
  defaultVariants: {
    variant: "main",
  },
});

export function MenuLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === "custom") {
    return <div className={cn("grid", props.className)}>{item.children}</div>;
  }

  if (item.type === "menu") {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    );

    return (
      <div className={cn("mb-4 flex flex-col", props.className)}>
        <p className="mb-1 text-muted-foreground text-sm">
          {item.url ? (
            <NavigationMenuLink asChild>
              <Link href={item.url}>{header}</Link>
            </NavigationMenuLink>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MenuLinkItem item={child} key={i} />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <BaseLinkItem
        aria-label={item.type === "icon" ? item.label : undefined}
        className={cn(
          menuItemVariants({ variant: item.type }),
          props.className
        )}
        item={item}
      >
        {item.icon}
        {item.type === "icon" ? undefined : item.text}
      </BaseLinkItem>
    </NavigationMenuLink>
  );
}

export const Menu = NavigationMenuItem;

export function MenuTrigger({
  enableHover = false,
  ...props
}: ComponentPropsWithoutRef<typeof NavigationMenuTrigger> & {
  /**
   * Enable hover to trigger
   */
  enableHover?: boolean;
}) {
  return (
    <NavigationMenuTrigger
      {...props}
      className={cn(
        buttonVariants({
          size: "icon",
          variant: "ghost",
        }),
        props.className
      )}
      onPointerMove={
        enableHover
          ? undefined
          : (e) => {
              e.preventDefault();
            }
      }
    >
      {props.children}
    </NavigationMenuTrigger>
  );
}

export function MenuContent(
  props: ComponentPropsWithoutRef<typeof NavigationMenuContent>
) {
  return (
    <NavigationMenuContent
      {...props}
      className={cn("flex flex-col p-4", props.className)}
    >
      {props.children}
    </NavigationMenuContent>
  );
}
