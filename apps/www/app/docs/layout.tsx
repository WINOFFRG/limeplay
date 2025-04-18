"use client";

import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { RootProvider } from "fumadocs-ui/provider";
import { Banner } from "fumadocs-ui/components/banner";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Layout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <RootProvider
      search={{
        options: {
          type: "static"
        }
      }}
      theme={theme}
    >
      <Banner variant="rainbow" className="font-medium">
        Limeplay V2 in under development 🥳 Looking for V1? checkout&nbsp;
        <Link
          href="https://limeplay.vercel.app/"
          target="_blank"
          className="underline"
        >
          here
        </Link>
      </Banner>
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
