"use client"

import { useRender } from "@base-ui/react/use-render"
import * as React from "react"

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

type ElementWithChildren = React.ReactElement<{ children?: React.ReactNode }>

type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Combines multiple refs into a single ref callback.
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: null | T) => {
    const cleanups = refs.map((ref) => setRef(ref, node))

    if (cleanups.some((cleanup) => typeof cleanup === "function")) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === "function") {
            cleanup()
          } else {
            setRef(refs[index], null)
          }
        })
      }
    }
  }
}

/**
 * Marks which child of a `Slot` is the element to render. Its siblings are
 * placed inside that element, after its own children.
 */
export function Slottable({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

/**
 * A memoized ref callback that forwards the node to every given ref.
 */
export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  // The refs themselves are the dependencies, matching Radix's useComposedRefs.
  return React.useCallback(composeRefs(...refs), refs)
}

function getRenderElement(
  children: React.ReactNode
): React.ReactElement | undefined {
  const childArray = React.Children.toArray(children)
  const slottable = childArray.find(isSlottable)

  if (!slottable) {
    return React.isValidElement(children) ? children : undefined
  }

  const target = slottable.props.children
  if (!React.isValidElement<{ children?: React.ReactNode }>(target)) {
    return undefined
  }

  const siblings = childArray.map((child) =>
    child === slottable ? target.props.children : child
  )
  return React.cloneElement(target, undefined, ...siblings)
}

function isSlottable(child: React.ReactNode): child is ElementWithChildren {
  return React.isValidElement(child) && child.type === Slottable
}

/**
 * Sets a ref value. Returns the ref callback's cleanup function, if any.
 */
function setRef<T>(ref: PossibleRef<T>, value: null | T) {
  if (typeof ref === "function") {
    return ref(value)
  }
  if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

/**
 * Renders its single child element, merging the slot's props onto it.
 * Event handlers are chained, `className` and `style` are combined, and the
 * child's own props win otherwise. Built on Base UI's `useRender`.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...props },
  forwardedRef
) {
  const render = getRenderElement(children)

  return useRender({
    enabled: render !== undefined,
    props,
    ref: forwardedRef,
    render,
  })
})
