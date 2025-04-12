/**
 * Type-safe event handler utility function
 * Provides autocomplete for available events based on element type
 */

// Helper type to extract valid event names from an element type
type EventNames<T> = {
  [K in keyof T]: K extends `on${infer E}` ? Lowercase<E> : never
}[keyof T]

// Helper type to get the event type for a given event name and element
type EventType<T, E> = T extends {
  addEventListener: (event: any, handler: infer H) => any
}
  ? H extends (event: infer Event) => any
    ? Event
    : never
  : never

/**
 * Attaches event listeners to an element with type-safe event names
 * @param element - The DOM element to attach events to
 * @param events - Event name or array of event names
 * @param callback - The event handler function
 * @returns The original element (for chaining)
 */
export function on<
  T extends EventTarget,
  E extends EventNames<T> | EventNames<T>[]
>(
  element: T,
  events: E,
  callback: (
    event: E extends Array<any> ? EventType<T, E[number]> : EventType<T, E>
  ) => void
): T {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.addEventListener(event, callback as EventListener)
    })
  } else {
    element.addEventListener(events, callback as EventListener)
  }

  return element
}

/**
 * Removes event listeners from an element with type-safe event names
 * @param element - The DOM element to remove events from
 * @param events - Event name or array of event names
 * @param callback - The event handler function to remove
 * @returns The original element (for chaining)
 */
export function off<
  T extends EventTarget,
  E extends EventNames<T> | EventNames<T>[]
>(
  element: T,
  events: E,
  callback: (
    event: E extends Array<any> ? EventType<T, E[number]> : EventType<T, E>
  ) => void
): T {
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
 * No-op function
 * @returns undefined
 */
export function noop() {}
