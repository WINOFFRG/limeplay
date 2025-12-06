"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  type AnchorHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react"

import { isActive } from "@/lib/utils"

export interface BaseLinkType extends BaseItem {
  /**
   * When the item is marked as active
   *
   * @defaultValue 'url'
   */
  active?: "nested-url" | "none" | "url"
  external?: boolean
  url: string
}

export interface IconItemType extends BaseLinkType {
  icon: ReactNode
  /**
   * `aria-label` of icon button
   */
  label?: string
  /**
   * @defaultValue true
   */
  secondary?: boolean
  text: ReactNode
  type: "icon"
}

export type LinkItemType =
  | ButtonItem
  | CustomItem
  | IconItemType
  | MainItemType
  | MenuItemType

export interface MainItemType extends BaseLinkType {
  description?: ReactNode
  icon?: ReactNode
  text: ReactNode
  type?: "main"
}

export interface MenuItemType extends BaseItem {
  icon?: ReactNode
  items: (
    | CustomItem
    | (MainItemType & {
        /**
         * Options when displayed on navigation menu
         */
        menu?: HTMLAttributes<HTMLElement> & {
          banner?: ReactNode
        }
      })
  )[]
  /**
   * @defaultValue false
   */
  secondary?: boolean

  text: ReactNode
  type: "menu"

  url?: string
}

interface BaseItem {
  /**
   * Restrict where the item is displayed
   *
   * @defaultValue 'all'
   */
  on?: "all" | "menu" | "nav"
}

interface ButtonItem extends BaseLinkType {
  icon?: ReactNode
  /**
   * @defaultValue false
   */
  secondary?: boolean
  text: ReactNode
  type: "button"
}

interface CustomItem extends BaseItem {
  children: ReactNode
  /**
   * @defaultValue false
   */
  secondary?: boolean
  type: "custom"
}

export const BaseLinkItem = forwardRef<
  HTMLAnchorElement,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { item: BaseLinkType }
>(({ item, ...props }, ref) => {
  const pathname = usePathname()
  const activeType = item.active ?? "url"
  const active =
    activeType !== "none" &&
    isActive(item.url, pathname, activeType === "nested-url")

  return (
    <Link
      href={item.url}
      ref={ref}
      {...(item.external && {
        target: "_blank",
      })}
      {...props}
      data-active={active}
    >
      {props.children}
    </Link>
  )
})

BaseLinkItem.displayName = "BaseLinkItem"
