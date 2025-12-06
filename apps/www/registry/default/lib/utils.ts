import type React from "react"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type-safe event handler utility function
 * Provides autocomplete for available events based on element type
 */

// // Helper type to extract valid event names from an element type
// type EventNames<T> = {
//   [K in keyof T]: K extends `on${infer E}` ? Lowercase<E> : never
// }[keyof T]

// // Helper type to get the event type for a given event name and element
// type EventType<T, E> = T extends {
//   addEventListener: (event: any, handler: infer H) => any
// }
//   ? H extends (event: infer Event) => any
//     ? Event
//     : never
//   : never

export function getDeviceLanguage() {
  const primaryLocale = navigator.language
  return primaryLocale.split("-")[0]
}

/**
 * No-op function
 * @returns undefined
 */
export function noop() {
  // noop
}

/**
 * Overloaded function for React synthetic events
 */
export function off<R extends HTMLElement>(
  element: EventTarget,
  events: string | string[],
  callback: (event: React.SyntheticEvent<R>) => void
): EventTarget

/**
 * Implementation
 */
export function off(
  element: EventTarget,
  events: string | string[],
  callback: (event: any) => void
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.removeEventListener(event, callback as EventListener)
    })
  } else {
    element.removeEventListener(events, callback as EventListener)
  }

  return element
}

/**
 * Overloaded function for React synthetic events
 */
export function on<R extends HTMLElement>(
  element: EventTarget,
  events: string | string[],
  callback: (event: React.SyntheticEvent<R>) => void
): EventTarget

/**
 * Implementation
 */
export function on(
  element: EventTarget,
  events: string | string[],
  callback: (event: any) => void
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.addEventListener(event, callback as EventListener)
    })
  } else {
    element.addEventListener(events, callback as EventListener)
  }

  return element
}

export function toFixedNumber(num: number, digits: number, base = 10) {
  const pow = Math.pow(base, digits)
  return Math.round(num * pow) / pow
}
