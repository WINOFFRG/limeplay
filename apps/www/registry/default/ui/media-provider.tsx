"use client"

import { createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

import type {
  CreateMediaStoreProps,
  TypeMediaStore,
} from "@/registry/default/internal/create-media-store"
import { createMediaStore } from "@/registry/default/internal/create-media-store"

type MediaProviderContext = ReturnType<typeof createMediaStore>

const MediaProviderContext = createContext<MediaProviderContext | null>(null)

export function MediaProvider({
  children,
  ...props
}: React.PropsWithChildren<CreateMediaStoreProps>) {
  const store = useRef(createMediaStore(props)).current

  return (
    <MediaProviderContext.Provider value={store}>
      {children}
    </MediaProviderContext.Provider>
  )
}

function useMediaStoreWithContext<T>(
  selector: (state: TypeMediaStore) => T
): T {
  const storeFromCtx = useContext(MediaProviderContext)

  if (!storeFromCtx) {
    throw new Error("Missing MediaProvider in root")
  }

  return useStore(storeFromCtx, selector)
}

let globalStore: ReturnType<typeof createMediaStore> | null = null

// DEV: Migrate to conditional calling without context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useMediaStoreWithoutContext<T>(
  selector: (state: TypeMediaStore) => T,
  options?: CreateMediaStoreProps
): T {
  globalStore ??= createMediaStore(options ?? {})

  return useStore(globalStore, selector)
}

export function useGetStore() {
  const storeFromCtx = useContext(MediaProviderContext)

  if (!storeFromCtx) {
    throw new Error("Missing MediaProvider in root")
  }

  return storeFromCtx
}

export const useMediaStore = useMediaStoreWithContext
