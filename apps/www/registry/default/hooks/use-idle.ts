import { useEffect, useState } from "react"
import throttle from "lodash.throttle"

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

const useIdle = (
  ms: number = oneMinute,
  initialState = false,
  events: string[] = defaultEvents
): boolean => {
  const [state, setState] = useState<boolean>(initialState)

  useEffect(() => {
    let mounted = true
    let timeout: NodeJS.Timeout | undefined
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

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        set(true)
      }, ms)
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

    timeout = setTimeout(() => {
      set(true)
    }, ms)

    return () => {
      mounted = false

      for (const event of events) {
        off(window, event, onEvent)
      }
      off(document, "visibilitychange", onVisibility)
    }
  }, [ms, events])

  return state
}

export default useIdle
