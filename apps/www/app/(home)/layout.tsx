import { HomeLayout } from "@/components/layouts/home/layout";
import { Inter } from "next/font/google";
// import "./globals.css"

import { baseOptions } from "../layout.config";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* {process.env.NODE_ENV === "development" && (
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      )} */}
      <body
        className={`${inter.className} dark flex flex-1 flex-col pt-16 antialiased dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]`}
      >
        <HomeLayout {...baseOptions}>{children}</HomeLayout>
      </body>
    </html>
  );
}
