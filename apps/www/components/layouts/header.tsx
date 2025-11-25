import Link from "next/link";
import { Fragment } from "react";

import {
  Navbar,
  NavbarLink,
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "@/components/layouts/home/navbar";
import type {
  BaseLayoutProps,
  LinkItemType,
  NavOptions,
} from "@/components/layouts/shared";

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean;
    }
  >;
}

export function Header({ nav = {}, links }: HomeLayoutProps) {
  const navItems = links.filter((item) =>
    ["nav", "all"].includes(item.on ?? "all")
  );

  return (
    <Navbar>
      <Link
        aria-label="Navigate to Home"
        className="inline-flex items-center gap-2.5 font-semibold"
        href={nav.url ?? "/"}
      >
        {nav.title}
      </Link>
      {nav.children}

      <ul
        className={"flex flex-1 flex-row items-center gap-2 px-6 max-sm:hidden"}
      >
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavbarLinkItem item={item} key={i} />
          ))}
      </ul>
      <ul className="ml-2 flex flex-row items-center gap-2">
        {navItems.filter(isSecondary).map((item, i) => (
          <NavbarLinkItem className="-me-1.5" item={item} key={i} />
        ))}
      </ul>
    </Navbar>
  );
}

function NavbarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === "custom") {
    return <>{item.children}</>;
  }

  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom") {
        return <Fragment key={j}>{child.children}</Fragment>;
      }

      const {
        banner = child.icon ? (
          <div
            className={"w-fit rounded-md border bg-muted p-1 [&_svg]:size-5"}
          >
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {};

      return (
        <NavbarMenuLink href={child.url} key={j} {...rest}>
          {rest.children ?? (
            <>
              {banner}
              <p className="-mb-1 font-medium text-base">{child.text}</p>
              {child.description ? (
                <p className="text-[13px] text-muted-foreground">
                  {child.description}
                </p>
              ) : null}
            </>
          )}
        </NavbarMenuLink>
      );
    });

    return (
      <NavbarMenu>
        <NavbarMenuTrigger {...props} className="text-base">
          {item.url ? <Link href={item.url}>{item.text}</Link> : item.text}
        </NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavbarMenu>
    );
  }

  return (
    <NavbarLink
      className="font-medium text-sm"
      {...props}
      aria-label={item.type === "icon" ? item.label : undefined}
      item={item}
      variant={item.type}
    >
      {item.type === "icon" ? item.icon : item.text}
    </NavbarLink>
  );
}

function isSecondary(item: LinkItemType): boolean {
  return (
    ("secondary" in item && item.secondary === true) || item.type === "icon"
  );
}
