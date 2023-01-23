import { Document } from 'contentlayer/core';
import {
    ComputedFields,
    FieldDefs,
    defineDocumentType,
    makeSource,
} from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import { getTableOfContents } from './utils/get-table-of-contents';

const computedFields: ComputedFields = {
    slug: {
        type: 'string',
        resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
};

const computeFrontmatter = (fields: FieldDefs, doc: Document) => {
    const result: any = {};

    for (const [key, field] of Object.entries(fields)) {
        if (doc[key] !== undefined) {
            result[key] = field;
        }

        return result;
    }
};

const GuideFields: FieldDefs = {
    title: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
    },
    props: {
        type: 'list',
        required: true,
        of: {
            type: 'string',
        },
    },
    import: {
        type: 'string',
        required: true,
    },
    docs: {
        type: 'string',
        required: true,
    },
    source: {
        type: 'string',
        required: true,
    },
    package: {
        type: 'string',
        required: true,
    },
    installation: {
        type: 'string',
    },
    pageTitle: {
        type: 'string',
    },
    license: {
        type: 'string',
    },
    styles: {
        type: 'list',
        of: {
            type: 'string',
        },
    },
    group: {
        type: 'string',
    },
    order: {
        type: 'number',
        required: true,
    },
    slug: {
        type: 'string',
        required: true,
    },
    category: {
        type: 'string',
        required: true,
    },
    release: {
        type: 'string',
    },
    date: {
        type: 'string',
    },
    search: {
        type: 'string',
    },
    error: {
        type: 'string',
    },
    componentPrefix: {
        type: 'string',
    },
    hideToc: {
        type: 'boolean',
    },
    polymorphic: {
        type: 'boolean',
    },
    hidden: {
        type: 'boolean',
    },
};

export const Guide = defineDocumentType(() => ({
    name: 'Guide',
    contentType: 'mdx',
    filePathPattern: '**/*.mdx',
    fields: GuideFields,
    computedFields: {
        ...computedFields,
        frontMatter: {
            type: 'json',
            resolve: (doc) => ({
                ...computeFrontmatter(GuideFields, doc),
                headings: getTableOfContents(doc.body.raw),
            }),
        },
    },
}));

export default makeSource({
    contentDirPath: 'docs',
    documentTypes: [Guide],
    mdx: {
        rehypePlugins: [rehypeSlug],
    },
});
