import Image from "next/image";
import Logo from "@/public/product-icon.svg";
import { GITHUB_URL, PRODUCT_NAME, X_URL } from "@/lib/constants";
import { BaseLayoutProps } from "@/components/layouts/shared";
import { Book, Question, XLogo } from "@phosphor-icons/react/dist/ssr";
import { Icons } from "@/components/icons";
import { LinkItemType } from "fumadocs-ui/layouts/links";
import { NavbarLink } from "@/components/layouts/home/navbar";

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
      icon: <Book />
    },
    {
      type: "main",
      text: "What is Limeplay?",
      url: "/docs/what-is-limeplay",
      icon: <Question />
    },
    {
      type: "icon",
      url: GITHUB_URL,
      text: "Github",
      icon: <Icons.gitHub />,
      external: true
    },
    {
      type: "icon",
      url: X_URL,
      text: "X",
      icon: <XLogo />,
      external: true
    }
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
  {
    type: "icon",
    url: GITHUB_URL,
    text: "Github",
    icon: <Icons.gitHub />,
    external: true
  },
  {
    type: "icon",
    url: X_URL,
    text: "X",
    icon: <XLogo />,
    external: true
  }
];
