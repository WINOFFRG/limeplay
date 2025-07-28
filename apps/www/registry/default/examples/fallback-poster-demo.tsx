import Image from "next/image"
import Logo from "@/public/product-icon.svg"

import { PRODUCT_NAME } from "@/lib/constants"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"

export function FallbackPosterDemo() {
  return (
    <FallbackPoster className="bg-stone-900">
      <Image
        alt={PRODUCT_NAME}
        src={Logo}
        className="size-52"
        aria-label={PRODUCT_NAME}
      />
    </FallbackPoster>
  )
}
