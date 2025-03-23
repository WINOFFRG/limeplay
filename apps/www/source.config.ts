import { rehypeCode } from "fumadocs-core/mdx-plugins"
import { remarkInstall } from "fumadocs-docgen"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"

import { rehypeCodeOptions } from "./rehype-code.config"

export const docs = defineDocs({
  dir: "content/docs",
})

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    rehypeCodeOptions: rehypeCodeOptions,
    rehypePlugins: [rehypeCode],
    remarkPlugins: [
      [
        remarkInstall,
        {
          persist: {
            id: "persist-install",
          },
        },
      ],
    ],
  },
})
