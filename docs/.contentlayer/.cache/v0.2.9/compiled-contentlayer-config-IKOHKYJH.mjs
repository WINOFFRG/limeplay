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
  documentTypes: [Guide]
});
export {
  Guide,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-IKOHKYJH.mjs.map
