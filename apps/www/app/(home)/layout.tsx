import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VideoBackground } from "@/components/video-background"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main
      className={`
          light w-dvw scrollbar-gutter-auto overscroll-contain bg-linear-to-br from-white to-neutral-200
          md:scrollbar-gutter-stable
        `}
    >
      <VideoBackground />
      <Header />
      {children}
      <Footer />
    </main>
  )
}
