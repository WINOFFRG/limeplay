import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import defaultComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { ComponentPreview } from "@/components/component-preview"

const generator = createGenerator()

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ...TabsComponents,
    ComponentPreview,
    pre: ({ ref: _ref, ...props }: React.ComponentPropsWithRef<any>) => (
      <CodeBlock {...props} keepBackground>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  }
}
