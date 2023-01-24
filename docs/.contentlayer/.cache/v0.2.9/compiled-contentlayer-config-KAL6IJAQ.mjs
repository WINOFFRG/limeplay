// contentlayer.config.ts
import {
  defineDocumentType,
  makeSource
} from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";

// utils/get-table-of-contents.ts
import { slug } from "github-slugger";
function getTableOfContents(mdxContent) {
  const regexp = new RegExp(/^(### |## )(.*)\n/, "gm");
  const headings = [...mdxContent.matchAll(regexp)];
  let tableOfContents = [];
  if (headings.length) {
    tableOfContents = headings.map((heading) => {
      const headingText = heading[2].trim();
      const headingType = heading[1].trim() === "##" ? "h2" : "h3";
      const headingLink = slug(headingText, false);
      return {
        value: headingText,
        id: headingLink,
        level: headingType,
        depth: parseInt(headingType.replace("h", ""), 10)
      };
    });
  }
  return tableOfContents;
}

// contentlayer.config.ts
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`
  }
};
var GuideFields = {
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
    type: "string"
  },
  license: {
    type: "string"
  },
  styles: {
    type: "list",
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
};
var Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  filePathPattern: "**/*.mdx",
  fields: GuideFields,
  computedFields: {
    ...computedFields,
    frontmatter: {
      type: "json",
      resolve: (doc) => ({
        headings: getTableOfContents(doc.body.raw)
      })
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "docs",
  documentTypes: [Guide],
  mdx: {
    rehypePlugins: [rehypeSlug]
  }
});
export {
  Guide,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-KAL6IJAQ.mjs.map
