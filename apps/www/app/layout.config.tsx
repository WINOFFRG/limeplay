import {
  BlueprintIcon,
  BookIcon,
  QuestionIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { LinkItemType } from "fumadocs-ui/layouts/links";
import Image from "next/image";
import { Icons } from "@/components/icons";
import type { BaseLayoutProps } from "@/components/layouts/shared";

import { DISCORD_URL, GITHUB_URL, PRODUCT_NAME } from "@/lib/constants";
import Logo from "@/public/product-icon.svg";
import LogoDark from "@/public/product-icon-dark.svg";

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
    icon: <Icons.discord />,
    external: true,
  },
];

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image
          alt={PRODUCT_NAME}
          aria-label={PRODUCT_NAME}
          className={"hidden size-4 dark:block"}
          src={Logo}
        />
        <Image
          alt={PRODUCT_NAME}
          aria-label={PRODUCT_NAME}
          className={"block size-4 dark:hidden"}
          src={LogoDark}
        />
        <span className="font-medium text-base">Limeplay</span>
      </>
    ),
  },
  links: [
    {
      type: "main",
      text: "Quick Start",
      url: "/docs/quick-start",
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

    ...COMMON_LINKS,
  ],
};

export const HEADER_LINKS: LinkItemType[] = [
  {
    type: "main",
    text: "Documentation",
    url: "/docs/quick-start",
    icon: <BookIcon />,
  },
  {
    type: "main",
    text: "Blocks",
    url: "/blocks",
  },
  ...COMMON_LINKS,
];
