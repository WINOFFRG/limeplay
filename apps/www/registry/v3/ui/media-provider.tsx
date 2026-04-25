"use client"

import { createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

import type {
  CreateMediaStoreProps,
  TypeMediaStore,
} from "@/registry/v3/lib/create-media-store"

import { createMediaStore } from "@/registry/v3/lib/create-media-store"

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

export function useGetStore() {
  const store = useContext(MediaProviderContext)

  if (!store) {
    throw new Error("Missing MediaProvider in root")
  }

  return store
}

export function useMediaStore<T>(selector: (state: TypeMediaStore) => T): T {
  return useStore(useGetStore(), selector)
}
