import { HomeLayout } from "@/components/layouts/home/layout"

import { baseOptions } from "../layout.config"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>
}
