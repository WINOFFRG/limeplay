import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
})

export default defineConfig({
  mdxOptions: {
    remarkNpmOptions: {
      persist: {
        id: "pkg-manager",
      },
    },
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
