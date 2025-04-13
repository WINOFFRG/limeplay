import "./global.css";

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { PRODUCT_NAME } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`
  }
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="dark flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
