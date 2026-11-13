import { describe, expect, test } from "bun:test"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { composeRefs, Slot, Slottable } from "@/registry/default/lib/slot"

/** Parses the root element of rendered markup into its tag, attributes and inner HTML. */
function parseRoot(html: string) {
  const match = /^<([a-z0-9]+)([^>]*)>(.*)<\/\1>$/s.exec(html)
  if (!match) throw new Error(`Unexpected markup: ${html}`)
  const [, tag, rawAttributes, inner] = match
  const attributes: Record<string, string> = {}
  for (const [, name, value] of rawAttributes.matchAll(
    /([a-z-]+)="([^"]*)"/g
  )) {
    attributes[name] =
      name === "class" ? value.split(" ").sort().join(" ") : value
  }
  return { attributes, inner, tag }
}

describe("Slot", () => {
  test("renders the child element with the slot's props merged in", () => {
    const html = renderToStaticMarkup(
      <Slot aria-label="Play" className="mt-2" data-state="paused">
        <a className="flex" href="/watch">
          Watch
        </a>
      </Slot>
    )

    expect(parseRoot(html)).toEqual({
      attributes: {
        "aria-label": "Play",
        class: "flex mt-2",
        "data-state": "paused",
        href: "/watch",
      },
      inner: "Watch",
      tag: "a",
    })
  })

  test("lets the child's own props win over the slot's", () => {
    const html = renderToStaticMarkup(
      <Slot id="from-slot" title="slot">
        <button id="from-child" type="button">
          Go
        </button>
      </Slot>
    )

    expect(parseRoot(html)).toEqual({
      attributes: { id: "from-child", title: "slot", type: "button" },
      inner: "Go",
      tag: "button",
    })
  })

  test("places siblings inside the Slottable child, after its children", () => {
    const html = renderToStaticMarkup(
      <Slot className="p-2">
        <Slottable>
          <section className="grid">
            <h2>Title</h2>
          </section>
        </Slottable>
        <div className="hidden" />
      </Slot>
    )

    expect(parseRoot(html)).toEqual({
      attributes: { class: "grid p-2" },
      inner: '<h2>Title</h2><div class="hidden"></div>',
      tag: "section",
    })
  })

  test("renders nothing when the child is not an element", () => {
    expect(renderToStaticMarkup(<Slot>plain text</Slot>)).toBe("")
  })
})

describe("composeRefs", () => {
  test("forwards the node to object and callback refs", () => {
    const objectRef = React.createRef<HTMLDivElement>()
    let callbackValue: HTMLDivElement | null = null
    const node = {} as HTMLDivElement

    composeRefs<HTMLDivElement>(objectRef, (value) => {
      callbackValue = value
    })(node)

    expect(objectRef.current).toBe(node)
    expect(callbackValue).toBe(node)
  })

  test("returns a cleanup that runs callback cleanups and clears object refs", () => {
    const objectRef = React.createRef<HTMLDivElement>()
    let cleanedUp = false
    const node = {} as HTMLDivElement

    const cleanup = composeRefs<HTMLDivElement>(objectRef, () => () => {
      cleanedUp = true
    })(node)

    expect(typeof cleanup).toBe("function")
    cleanup?.()
    expect(cleanedUp).toBe(true)
    expect(objectRef.current).toBeNull()
  })
})
