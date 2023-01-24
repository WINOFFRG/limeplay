var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
var Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  filePathPattern: "**/*.mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    group: {
      type: "string"
    },
    order: {
      type: "number"
    },
    package: {
      type: "string"
    },
    slug: {
      type: "string",
      required: true
    },
    category: {
      type: "string"
    },
    description: {
      type: "string"
    },
    import: {
      type: "string",
      required: true
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "docs",
  documentTypes: [Guide],
  mdx: {
    remarkPlugins: [
      __require("remark-slug"),
      remarkFrontmatter,
      remarkMdxFrontmatter
    ]
  }
});
export {
  Guide,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-R5HZPJ4T.mjs.map
