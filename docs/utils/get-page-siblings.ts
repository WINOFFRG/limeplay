import { DocumentTypeMap } from 'contentlayer/generated';
import { getDocumentsByType } from './get-docs-by-type';

export function getPageSiblings(type: keyof DocumentTypeMap, pathname: string) {
	const allDocuments = getDocumentsByType(type);
	const index = allDocuments.findIndex((page) => page.slug === pathname);

	return {
		next: allDocuments[index + 1] || null,
		prev: allDocuments[index - 1] || null,
	};
}
