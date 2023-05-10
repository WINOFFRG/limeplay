import { allDocuments } from 'contentlayer/generated';

export const getDocumentsByType = (type: string) =>
	allDocuments.filter((document) => document.type === type);
