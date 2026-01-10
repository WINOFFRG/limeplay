import throttle from "lodash.throttle"
import { useEffect, useState } from "react"

import { off, on } from "@/registry/default/lib/utils"

const defaultEvents = [
  "mousemove",
  "mousedown",
  "resize",
  "keydown",
  "touchstart",
  "wheel",
]
const oneMinute = 60e3

export interface UseIdleOptions {
  /**
   * List of events to listen for to reset the idle timer.
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: string[]
  /**
   * Initial idle state.
   * @default false
   */
  initialState?: boolean
  /**
   * Time in milliseconds before state becomes idle.
   * @default 60000 (1 min)
   */
  timeout?: number
}

export function useIdle({
  events = defaultEvents,
  initialState = false,
  timeout = oneMinute,
}: UseIdleOptions = {}): boolean {
  const [state, setState] = useState<boolean>(initialState)

  useEffect(() => {
    let mounted = true
    let timer: NodeJS.Timeout | undefined
    let localState: boolean = state
    const set = (newState: boolean) => {
      if (mounted) {
        localState = newState
        setState(newState)
      }
    }

    const onEvent = throttle(() => {
      if (localState) {
        set(false)
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        set(true)
      }, timeout)
    }, 50)

    const onVisibility = () => {
      if (!document.hidden) {
        onEvent()
      }
    }

    for (const event of events) {
      on(window, event, onEvent)
    }
    on(document, "visibilitychange", onVisibility)

    timer = setTimeout(() => {
      set(true)
    }, timeout)

    return () => {
      mounted = false
      clearTimeout(timer)

      for (const event of events) {
        off(window, event, onEvent)
      }
      off(document, "visibilitychange", onVisibility)
    }
  }, [timeout, events])

  return state
}
