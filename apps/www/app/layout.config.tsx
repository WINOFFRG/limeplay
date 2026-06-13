import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared"

import { IconBlocks } from "@central-icons-react/round-filled-radius-0-stroke-1/IconBlocks"
import { IconBook } from "@central-icons-react/round-filled-radius-0-stroke-1/IconBook"
import { IconBuildingBlocks } from "@central-icons-react/round-filled-radius-0-stroke-1/IconBuildingBlocks"
import { IconNewspaper2 } from "@central-icons-react/round-filled-radius-0-stroke-1/IconNewspaper2"
import { IconRocket } from "@central-icons-react/round-filled-radius-0-stroke-1/IconRocket"
import Image from "next/image"

import { Icons } from "@/components/icons"
import { DISCORD_URL, GITHUB_URL, PRODUCT_NAME } from "@/lib/constants"
import LogoDark from "@/public/product-icon-dark.svg"
import Logo from "@/public/product-icon.svg"

const COMMON_LINKS: LinkItemType[] = [
  {
    external: true,
    icon: <Icons.gitHub />,
    text: "Github",
    type: "icon",
    url: GITHUB_URL,
  },
  {
    external: true,
    icon: <Icons.discord />,
    text: "Discord",
    type: "icon",
    url: DISCORD_URL,
  },
]

export const baseOptions: BaseLayoutProps = {
  links: [
    {
      icon: <IconRocket />,
      text: "Quick Start",
      type: "main",
      url: "/docs/quick-start",
    },
    {
      icon: <IconBook />,
      text: "Introduction",
      type: "main",
      url: "/docs/introduction",
    },
    {
      icon: <IconNewspaper2 />,
      text: "Usage",
      type: "main",
      url: "/docs/usage",
    },
    {
      icon: <IconBlocks />,
      text: "Blocks",
      type: "main",
      url: "/blocks/video-player",
    },
    {
      icon: <IconBuildingBlocks />,
      text: "Concepts",
      type: "main",
      url: "/docs/concepts",
    },
    ...COMMON_LINKS,
  ],
  nav: {
    title: (
      <>
        <Image
          alt={PRODUCT_NAME}
          aria-label={PRODUCT_NAME}
          className={`
            hidden size-4
            dark:block
          `}
          src={Logo}
        />
        <Image
          alt={PRODUCT_NAME}
          aria-label={PRODUCT_NAME}
          className={`
            block size-4
            dark:hidden
          `}
          src={LogoDark}
        />
        <span className="text-base font-medium">Limeplay</span>
      </>
    ),
  },
}
