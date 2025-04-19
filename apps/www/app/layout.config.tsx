import Image from "next/image";
import Logo from "@/public/product-icon.svg";
import { DISCORD_URL, GITHUB_URL, PRODUCT_NAME, X_URL } from "@/lib/constants";
import { BaseLayoutProps } from "@/components/layouts/shared";
import {
  Blueprint,
  Book,
  DiscordLogo,
  Question,
  Sparkle,
  XLogo
} from "@phosphor-icons/react/dist/ssr";
import { Icons } from "@/components/icons";
import { LinkItemType } from "fumadocs-ui/layouts/links";
import { NavbarLink } from "@/components/layouts/home/navbar";

const COMMON_LINKS: LinkItemType[] = [
  {
    type: "icon",
    url: GITHUB_URL,
    text: "Github",
    icon: <Icons.gitHub />,
    external: true
  },
  {
    type: "icon",
    url: DISCORD_URL,
    text: "Discord",
    icon: <DiscordLogo weight="bold" />,
    external: true
  },
  {
    type: "icon",
    url: X_URL,
    text: "X",
    icon: <XLogo weight="bold" />,
    external: true
  }
];

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image
          alt={PRODUCT_NAME}
          src={Logo}
          className="size-4"
          aria-label={PRODUCT_NAME}
        />
        <span className="text-base font-medium">Limeplay</span>
      </>
    ),
    transparentMode: "always"
  },
  links: [
    {
      type: "main",
      text: "Getting Started",
      url: "/docs/getting-started",
      icon: <Sparkle />
    },
    {
      type: "main",
      text: "What is Limeplay?",
      url: "/docs/what-is-limeplay",
      icon: <Question />
    },
    {
      type: "main",
      text: "Architecture",
      url: "/docs/architecture",
      icon: <Blueprint />
    },
    {
      type: "main",
      text: "Concepts & Design",
      url: "/docs/concepts-and-design",
      icon: <Book />
    },
    ...COMMON_LINKS
  ]
};

export const HEADER_LINKS: LinkItemType[] = [
  {
    type: "main",
    text: "Documentation",
    url: "/docs/getting-started",
    icon: <Book />
  },
  {
    type: "custom",
    children: (() => {
      return (
        <NavbarLink
          item={{
            url: "#",
            active: "none"
          }}
          className="cursor-not-allowed text-sm font-light"
        >
          Themes
        </NavbarLink>
      );
    })()
  },
  ...COMMON_LINKS
];
