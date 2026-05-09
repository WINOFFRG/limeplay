"use client"

import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDocsDialStore } from "@/lib/docs-dial-store"
import { cn } from "@/lib/utils"

import { OverlayShell } from "./overlay-shell"

interface CustomOverlayProps {
  onBack: () => void
  onLoad: (src: string, config?: string) => void
  show: boolean
}

export function CustomOverlay({ onBack, onLoad, show }: CustomOverlayProps) {
  const store = useDocsDialStore()
  const [urlError, setUrlError] = useState(false)
  const [configError, setConfigError] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [saveName, setSaveName] = useState("")

  const isValidUrl = React.useMemo(() => {
    const src = store.customSrc.trim()
    if (!src) return false
    try {
      const url = new URL(src)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }, [store.customSrc])

  const isValidConfig = React.useMemo(() => {
    const config = store.customConfig.trim()
    if (!config) return true
    try {
      JSON.parse(config)
      return true
    } catch {
      return false
    }
  }, [store.customConfig])

  const canLoad = isValidUrl && isValidConfig
  const canSave = canLoad && saveName.trim().length > 0

  const handleUrlChange = (value: string) => {
    store.setCustomSrc(value)
    if (value.trim()) {
      try {
        const url = new URL(value.trim())
        setUrlError(url.protocol !== "http:" && url.protocol !== "https:")
      } catch {
        setUrlError(true)
      }
    } else {
      setUrlError(false)
    }
  }

  const handleConfigChange = (value: string) => {
    store.setCustomConfig(value)
    if (value.trim()) {
      try {
        JSON.parse(value.trim())
        setConfigError(false)
      } catch {
        setConfigError(true)
      }
    } else {
      setConfigError(false)
    }
  }

  const handleConfigPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text")
    try {
      const parsed = JSON.parse(pasted)
      e.preventDefault()
      store.setCustomConfig(JSON.stringify(parsed, null, 2))
      setConfigError(false)
    } catch {
      // not valid JSON, let default paste happen
    }
  }

  const handleLoad = () => {
    if (!canLoad) return
    onLoad(store.customSrc.trim(), store.customConfig.trim() || undefined)
  }

  const handleSave = () => {
    if (!canSave) return
    store.saveStream({
      config: store.customConfig.trim() || undefined,
      name: saveName.trim(),
      src: store.customSrc.trim(),
    })
    setSaveName("")
    setShowSave(false)
  }

  return (
    <OverlayShell onBack={onBack} show={show} title="Custom Stream">
      <div
        className={cn(
          "no-scrollbar flex-1 overflow-y-auto",
          "flex flex-col gap-3 p-3"
        )}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Playback URL
          </label>
          <Input
            aria-invalid={urlError}
            className="h-8 text-sm"
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/stream.m3u8"
            value={store.customSrc}
          />
          {urlError && (
            <p className="text-sm text-destructive">
              Enter a valid HTTP/HTTPS URL
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Shaka Config (optional)
            </label>
            <a
              className={`
                text-sm text-muted-foreground underline-offset-2
                hover:underline
              `}
              href="https://shaka-player-demo.appspot.com/docs/api/shaka.extern.html#.PlayerConfiguration"
              rel="noopener noreferrer"
              target="_blank"
            >
              Reference
            </a>
          </div>
          <Textarea
            aria-invalid={configError}
            className="min-h-24 resize-none font-mono text-sm"
            onChange={(e) => handleConfigChange(e.target.value)}
            onPaste={handleConfigPaste}
            placeholder={'{\n  "drm": {\n    "servers": {}\n  }\n}'}
            value={store.customConfig}
          />
          {configError && (
            <p className="text-sm text-destructive">Invalid JSON format</p>
          )}
        </div>

        <AnimatePresence>
          {showSave && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="flex flex-col gap-1.5 overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ bounce: 0, duration: 0.2, type: "spring" }}
            >
              <label className="text-sm font-medium text-muted-foreground">
                Stream Name
              </label>
              <Input
                className="h-8 text-sm"
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="My custom stream"
                value={saveName}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex gap-2">
          {showSave ? (
            <>
              <Button
                className="h-8 flex-1 text-sm"
                disabled={!canSave}
                onClick={handleSave}
                size="sm"
              >
                Save
              </Button>
              <Button
                className="h-8 text-sm"
                onClick={() => {
                  setShowSave(false)
                  setSaveName("")
                }}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                className="h-8 flex-1 text-sm"
                disabled={!canLoad}
                onClick={handleLoad}
                size="sm"
              >
                Load Stream
              </Button>
              <Button
                className="h-8 text-sm"
                disabled={!canLoad}
                onClick={() => setShowSave(true)}
                size="sm"
                variant="outline"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </OverlayShell>
  )
}
