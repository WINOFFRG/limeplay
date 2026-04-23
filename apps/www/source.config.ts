import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"
import remarkGfm from "remark-gfm"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
  },
})

const blockFrontmatterSchema = z.object({
  component: z.string(),
  description: z.string().optional(),
  full: z.boolean().optional(),
  preview: z.string(),
  registry: z.enum(["default", "pro"]).default("default"),
  status: z.enum(["free", "pro"]).default("free"),
  title: z.string(),
})

export const blocks = defineDocs({
  dir: "content/docs/blocks",
  docs: {
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
    schema: blockFrontmatterSchema,
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
