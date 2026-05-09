"use client"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface PanelSliderProps {
  className?: string
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}

const CLICK_THRESHOLD = 3

export function PanelSlider({
  className,
  label,
  max = 100,
  min = 0,
  onChange,
  step = 1,
  value,
}: PanelSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pointerDownPos = useRef<null | { x: number }>(null)
  const isClickRef = useRef(true)
  const animRef = useRef<null | ReturnType<typeof animate>>(null)

  const percentage = ((value - min) / (max - min)) * 100
  const fillPercent = useMotionValue(percentage)
  const fillWidth = useTransform(fillPercent, (pct) => `${pct}%`)

  useEffect(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage)
    }
  }, [percentage, isInteracting, fillPercent])

  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return value
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      )
      const raw = min + percent * (max - min)
      return Math.round(raw / step) * step
    },
    [min, max, step, value]
  )

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    pointerDownPos.current = { x: e.clientX }
    isClickRef.current = true
    setIsInteracting(true)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current) return

      const dx = Math.abs(e.clientX - pointerDownPos.current.x)
      if (isClickRef.current && dx > CLICK_THRESHOLD) {
        isClickRef.current = false
      }

      if (!isClickRef.current) {
        const newValue = positionToValue(e.clientX)
        const newPct = ((newValue - min) / (max - min)) * 100
        if (animRef.current) {
          animRef.current.stop()
          animRef.current = null
        }
        fillPercent.jump(newPct)
        onChange(Math.max(min, Math.min(max, newValue)))
      }
    },
    [isInteracting, positionToValue, onChange, fillPercent, min, max]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting) return

      if (isClickRef.current) {
        const newValue = positionToValue(e.clientX)
        const newPct = ((newValue - min) / (max - min)) * 100

        if (animRef.current) animRef.current.stop()
        animRef.current = animate(fillPercent, newPct, {
          bounce: 0,
          duration: 0.3,
          onComplete: () => {
            animRef.current = null
          },
          type: "spring",
        })
        onChange(Math.max(min, Math.min(max, newValue)))
      }

      setIsInteracting(false)
      pointerDownPos.current = null
    },
    [isInteracting, positionToValue, onChange, fillPercent, min, max]
  )

  const isActive = isInteracting || isHovered

  return (
    <div
      className={cn(
        "relative flex h-11 cursor-pointer items-center rounded-xl border border-border/50 px-3.5",
        "bg-muted/40 transition-[colors,border-color]",
        isActive && "border-border/70 bg-accent/60",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={trackRef}
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-primary/12"
        style={{ width: fillWidth }}
      />
      <span className="relative text-sm text-muted-foreground select-none">
        {label}
      </span>
      <span className="relative ml-auto text-xs font-medium tabular-nums select-none">
        {Math.round(value)}
      </span>
    </div>
  )
}
