import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

export function FallbackPosterDemo() {
  return (
    <FallbackPoster className="bg-stone-900">
      <LimeplayLogo />
    </FallbackPoster>
  )
}
