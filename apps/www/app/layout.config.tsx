import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared"

import {
  BlueprintIcon,
  QuestionIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"
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
      icon: <SparkleIcon />,
      text: "Quick Start",
      type: "main",
      url: "/docs/quick-start",
    },
    {
      icon: <QuestionIcon />,
      text: "What is Limeplay?",
      type: "main",
      url: "/docs/what-is-limeplay",
    },
    {
      icon: <BlueprintIcon />,
      text: "Architecture",
      type: "main",
      url: "/docs/architecture",
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
