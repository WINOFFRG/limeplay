import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        dark: "min-dark",
        light: "github-light",
      },
    },
    rehypePlugins: [rehypeSlug],
    remarkCodeTabOptions: {},
    remarkNpmOptions: {
      persist: {
        id: "pkg-manager",
      },
    },
    remarkPlugins: [remarkGfm, codeImport],
  },
})
