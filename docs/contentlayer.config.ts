import {
	ComputedFields,
	defineDocumentType,
	makeSource,
} from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import { getTableOfContents } from './utils/get-table-of-contents';

export const Guide = defineDocumentType(() => ({
	name: 'Guide',
	contentType: 'mdx',
	filePathPattern: '**/*.mdx',
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
			required: false,
			of: {
				type: 'string',
			},
		},
		import: {
			type: 'string',
			required: false,
		},
		docs: {
			type: 'string',
			required: false,
		},
		source: {
			type: 'string',
			required: false,
		},
		package: {
			type: 'string',
			required: false,
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
			required: false,
		},
		slug: {
			type: 'string',
			required: true,
		},
		category: {
			type: 'string',
			required: false,
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
	computedFields: {
		headings: {
			type: 'list',
			resolve: (doc) => getTableOfContents(doc.body.raw),
		},
	},
}));

export default makeSource({
	contentDirPath: 'content',
	documentTypes: [Guide],
	mdx: {
		rehypePlugins: [rehypeSlug],
	},
});
