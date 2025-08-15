import { Fragment } from "react"
import Link from "next/link"

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
  NavOptions,
} from "@/components/layouts/shared"

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

export function Header({ nav = {}, links }: HomeLayoutProps) {
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

      <ul
        className={`
          flex flex-1 flex-row items-center gap-2 px-6
          max-sm:hidden
        `}
      >
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => {
            return <NavbarLinkItem key={i} item={item} />
          })}
      </ul>
      <ul className="ml-2 flex flex-row items-center gap-2">
        {navItems.filter(isSecondary).map((item, i) => (
          <NavbarLinkItem key={i} item={item} className="-me-1.5" />
        ))}
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
          <div
            className={`
              w-fit rounded-md border bg-fd-muted p-1
              [&_svg]:size-5
            `}
          >
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
                <p className="text-[13px] text-fd-muted-foreground">
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
