import { Fragment } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuLinkItem,
  MenuTrigger,
} from "@/components/layouts/home/menu"
import {
  Navbar,
  NavbarLink,
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "@/components/layouts/home/navbar"
import type {
  BaseLayoutProps,
  LinkItemType,
  NavOptions} from "@/components/layouts/shared";
import {
  slot,
} from "@/components/layouts/shared"
import { ThemeToggle } from "@/components/layouts/theme-toggle"

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean
    }
  >
}

export function Header({ nav = {}, links, themeSwitch }: HomeLayoutProps) {
  const navItems = links.filter((item) =>
    ["nav", "all"].includes(item.on ?? "all")
  )

  return (
    <Navbar>
      <Link
        aria-label="Navigate to Home"
        href={nav.url ?? "/"}
        className="inline-flex items-center gap-2.5 font-semibold"
      >
        {nav.title}
      </Link>
      {nav.children}

      <ul className="flex flex-1 flex-row items-center gap-2 px-6 max-sm:hidden">
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => {
            return <NavbarLinkItem key={i} item={item} />
          })}
      </ul>

      <div className="ml-4 flex flex-row items-center justify-end gap-1.5">
        {slot(
          themeSwitch,
          <ThemeToggle className="max-lg:hidden" mode={themeSwitch?.mode} />
        )}
      </div>

      <ul className="ml-2 flex flex-row items-center gap-2">
        {navItems.filter(isSecondary).map((item, i) => (
          <NavbarLinkItem
            key={i}
            item={item}
            className="-me-1.5 max-lg:hidden"
          />
        ))}
        <Menu className="lg:hidden">
          <MenuTrigger
            aria-label="Toggle Menu"
            className="group -me-2"
            enableHover={nav.enableHoverToOpen}
          >
            <ChevronDown className="size-3 transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </MenuTrigger>
          <MenuContent className="sm:flex-row sm:items-center sm:justify-end">
            {navItems
              .filter((item) => !isSecondary(item))
              .map((item, i) => (
                <MenuLinkItem key={i} item={item} className="sm:hidden" />
              ))}
            <div className="-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2">
              {navItems.filter(isSecondary).map((item, i) => (
                <MenuLinkItem key={i} item={item} className="-me-1.5" />
              ))}
              <div role="separator" className="flex-1" />

              {slot(themeSwitch, <ThemeToggle mode={themeSwitch?.mode} />)}
            </div>
          </MenuContent>
        </Menu>
      </ul>
    </Navbar>
  )
}

function NavbarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType
  className?: string
}) {
  if (item.type === "custom") return <>{item.children}</>

  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom")
        return <Fragment key={j}>{child.children}</Fragment>

      const {
        banner = child.icon ? (
          <div className="bg-fd-muted w-fit rounded-md border p-1 [&_svg]:size-5">
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {}

      return (
        <NavbarMenuLink key={j} href={child.url} {...rest}>
          {rest.children ?? (
            <>
              {banner}
              <p className="-mb-1 text-base font-medium">{child.text}</p>
              {child.description ? (
                <p className="text-fd-muted-foreground text-[13px]">
                  {child.description}
                </p>
              ) : null}
            </>
          )}
        </NavbarMenuLink>
      )
    })

    return (
      <NavbarMenu>
        <NavbarMenuTrigger {...props} className="text-base">
          {item.url ? <Link href={item.url}>{item.text}</Link> : item.text}
        </NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavbarMenu>
    )
  }

  return (
    <NavbarLink
      className="text-sm font-medium"
      {...props}
      item={item}
      variant={item.type}
      aria-label={item.type === "icon" ? item.label : undefined}
    >
      {item.type === "icon" ? item.icon : item.text}
    </NavbarLink>
  )
}

function isSecondary(item: LinkItemType): boolean {
  return (
    ("secondary" in item && item.secondary === true) || item.type === "icon"
  )
}
