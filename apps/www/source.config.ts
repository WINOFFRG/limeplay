import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"

export const docs = defineDocs({
  dir: "content/docs",
})

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkCodeTabOptions: {},
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "min-dark",
      },
    },
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [rehypeSlug],
  },
})
