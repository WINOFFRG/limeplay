// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  filePathPattern: "**/*.mdx",
  fields: {}
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "docs",
  documentTypes: [Guide]
});
export {
  Guide,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-CL5H7GVP.mjs.map
