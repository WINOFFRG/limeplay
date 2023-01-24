// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  filePathPattern: "**/*.mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string"
    },
    props: {
      type: "list",
      required: true,
      of: {
        type: "string"
      }
    },
    import: {
      type: "string",
      required: true
    },
    docs: {
      type: "string",
      required: true
    },
    source: {
      type: "string",
      required: true
    },
    package: {
      type: "string",
      required: true
    },
    installation: {
      type: "string"
    },
    pageTitle: {
      type: "string",
      required: true
    },
    license: {
      type: "string"
    },
    styles: {
      type: "list",
      required: true,
      of: {
        type: "string"
      }
    },
    group: {
      type: "string"
    },
    order: {
      type: "number",
      required: true
    },
    slug: {
      type: "string",
      required: true
    },
    category: {
      type: "string",
      required: true
    },
    release: {
      type: "string"
    },
    date: {
      type: "string"
    },
    search: {
      type: "string"
    },
    error: {
      type: "string"
    },
    componentPrefix: {
      type: "string"
    },
    hideToc: {
      type: "boolean"
    },
    polymorphic: {
      type: "boolean"
    },
    hidden: {
      type: "boolean"
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "docs",
  documentTypes: [Guide]
});
export {
  Guide,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-NL6NKP2T.mjs.map
