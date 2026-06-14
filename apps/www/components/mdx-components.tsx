import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"

import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"

import { ComponentPreview } from "@/components/component-preview"
import { Mermaid } from "@/components/mdx/mermaid"

const generator = createGenerator()
const fumadocsComponents = defaultComponents as MDXComponents

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...fumadocsComponents,
    Attribution,
    AutoTypeTable: (props: React.ComponentProps<typeof AutoTypeTable>) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ComponentPreview,
    License,
    Mermaid,
    pre: ({ ref: _ref, ...props }: React.ComponentPropsWithRef<typeof Pre>) => (
      <CodeBlock {...props} keepBackground>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
  } as unknown as MDXComponents
}

function Attribution({
  children,
  href,
  name,
}: {
  children?: ReactNode
  href?: string
  name: string
}) {
  return (
    <section>
      <h2>Attribution</h2>
      <p>
        Inspired by{" "}
        {href ? (
          <a href={href} rel="noreferrer" target="_blank">
            {name}
          </a>
        ) : (
          name
        )}
        .
      </p>
      {children}
    </section>
  )
}

function License() {
  return (
    <section>
      <h2>License & Usage</h2>
      <ul>
        <li>Free to use and modify in personal and commercial projects.</li>
        <li>Attribution to Limeplay is appreciated but not required.</li>
        <li>
          Do not resell the registry item as a standalone component library.
        </li>
      </ul>
    </section>
  )
}
