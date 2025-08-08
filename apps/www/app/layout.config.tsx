import Image from "next/image"
import LogoDark from "@/public/product-icon-dark.svg"
import Logo from "@/public/product-icon.svg"
import {
  BlueprintIcon,
  BookIcon,
  DiscordLogoIcon,
  QuestionIcon,
  SparkleIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { LinkItemType } from "fumadocs-ui/layouts/links"

import { DISCORD_URL, GITHUB_URL, PRODUCT_NAME, X_URL } from "@/lib/constants"
import { Icons } from "@/components/icons"
import { NavbarLink } from "@/components/layouts/home/navbar"
import type { BaseLayoutProps } from "@/components/layouts/shared"

const COMMON_LINKS: LinkItemType[] = [
  {
    type: "icon",
    url: GITHUB_URL,
    text: "Github",
    icon: <Icons.gitHub />,
    external: true,
  },
  {
    type: "icon",
    url: DISCORD_URL,
    text: "Discord",
    icon: <DiscordLogoIcon weight="bold" />,
    external: true,
  },
  {
    type: "icon",
    url: X_URL,
    text: "X",
    icon: <XLogoIcon weight="bold" />,
    external: true,
  },
]

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image
          alt={PRODUCT_NAME}
          src={Logo}
          className="size-4 dark:block hidden"
          aria-label={PRODUCT_NAME}
        />
        <Image
          alt={PRODUCT_NAME}
          src={LogoDark}
          className="size-4 block dark:hidden"
          aria-label={PRODUCT_NAME}
        />
        <span className="text-base font-medium">Limeplay</span>
      </>
    ),
    transparentMode: "always",
  },
  links: [
    {
      type: "main",
      text: "Getting Started",
      url: "/docs/getting-started",
      icon: <SparkleIcon />,
    },
    {
      type: "main",
      text: "What is Limeplay?",
      url: "/docs/what-is-limeplay",
      icon: <QuestionIcon />,
    },
    {
      type: "main",
      text: "Architecture",
      url: "/docs/architecture",
      icon: <BlueprintIcon />,
    },
    {
      type: "main",
      text: "Concepts & Design",
      url: "/docs/concepts-and-design",
      icon: <BookIcon />,
    },
    ...COMMON_LINKS,
  ],
}

export const HEADER_LINKS: LinkItemType[] = [
  {
    type: "main",
    text: "Documentation",
    url: "/docs/getting-started",
    icon: <BookIcon />,
  },
  {
    type: "custom",
    children: (() => {
      return (
        <NavbarLink
          item={{
            url: "#",
            active: "none",
          }}
          className="cursor-not-allowed text-sm font-light"
        >
          Themes
        </NavbarLink>
      )
    })(),
  },
  ...COMMON_LINKS,
]
