import "./global.css";

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { PRODUCT_DECSRIPTION, PRODUCT_NAME } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`
  },
  description: PRODUCT_DECSRIPTION
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          storageKey="limeplay-ui-theme"
          defaultTheme="dark"
          attribute="class"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
