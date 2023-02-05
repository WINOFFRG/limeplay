import { allDocuments } from '.contentlayer/generated';

export const getDocumentsByType = (type: string) => {
    return allDocuments.filter((document) => document.type === type);
};
