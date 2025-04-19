"use client";

import React, { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
  createMediaStore,
  CreateMediaStoreProps,
  TypeMediaStore,
} from "@/registry/default/internal/create-media-store";

type MediaProviderContext = ReturnType<typeof createMediaStore>;

const MediaProviderContext = createContext<MediaProviderContext | null>(null);

type MediaProviderProps = CreateMediaStoreProps;

export function MediaProvider({
  children,
  ...props
}: React.PropsWithChildren<MediaProviderProps>) {
  const store = useRef(createMediaStore(props)).current;

  return (
    <MediaProviderContext.Provider value={store}>
      {children}
    </MediaProviderContext.Provider>
  );
}

function useMediaStoreWithContext<T>(
  selector: (state: TypeMediaStore) => T
): T {
  const storeFromCtx = useContext(MediaProviderContext);

  if (!storeFromCtx) {
    throw new Error("Missing MediaProvider in root");
  }

  return useStore(storeFromCtx, selector);
}

let globalStore: ReturnType<typeof createMediaStore> | null = null;

// DEV: Migrate to conditional calling without context
function useMediaStoreWithoutContext<T>(
  selector: (state: TypeMediaStore) => T,
  options?: CreateMediaStoreProps
): T {
  if (!globalStore) {
    globalStore = createMediaStore(options || {});
  }

  return useStore(globalStore, selector);
}

export const useMediaStore = useMediaStoreWithContext;
