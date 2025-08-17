import { BlockDisplay } from "@/components/block-display"

export default function Blocks() {
  return (
    <section className="relative min-h-screen">
      <div
        className={`
          relative z-10 mx-auto max-w-5/6 px-4 pt-28 pb-16 mb-12
          sm:px-6 sm:pt-20 sm:pb-16
          md:px-8 md:pt-36 md:pb-16
          lg:px-8 lg:pt-32
          xl:pt-40
        `}
      >
        <BlockDisplay name="linear-player" />
      </div>
    </section>
  )
}
