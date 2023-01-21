import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';

export const Guide = defineDocumentType(() => ({
    name: 'Guide',
    contentType: 'mdx',
    // Location of Post source files (relative to `contentDirPath`)
    filePathPattern: '**/*.mdx',
    // At the time of writing, we also have to define the `fields`
    // option to prevent an error on generation. We'll discuss
    // this option later. For now, we'll add an empty object.
    fields: {
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
    },
}));

export default makeSource({
    // Location of source files for all defined documentTypes
    contentDirPath: 'docs',
    documentTypes: [Guide],
    mdx: {
        rehypePlugins: [
            rehypeSlug,

        ],
        
    },
});
