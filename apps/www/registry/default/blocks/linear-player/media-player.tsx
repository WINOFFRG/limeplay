import { Suspense } from "react"
import Image from "next/image"
import Logo from "@/public/product-icon.svg"

import { PRODUCT_NAME } from "@/lib/constants"
import { BottomControls } from "@/registry/default/blocks/linear-player/components/bottom-controls"
import { CustomPlayerWrapper } from "@/registry/default/blocks/linear-player/components/custom-player-wrapper"
import { MediaElement } from "@/registry/default/blocks/linear-player/components/media-element"
import { PlayerHooks } from "@/registry/default/blocks/linear-player/components/player-hooks"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"

export function MediaPlayer() {
  return (
    <CustomPlayerWrapper>
      <MediaProvider>
        <Layout.RootContainer height={720} width={1280}>
          <Layout.PlayerContainer>
            <FallbackPoster className="bg-stone-900">
              <Image
                alt={PRODUCT_NAME}
                src={Logo}
                className="size-52"
                aria-label={PRODUCT_NAME}
              />
            </FallbackPoster>
            <Suspense>
              <MediaElement />
            </Suspense>
            <PlayerHooks />
            <Layout.ControlsContainer>
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </Layout.RootContainer>
      </MediaProvider>
    </CustomPlayerWrapper>
  )
}
