import { Heading } from '@/utils/get-table-of-contents';
import { Frontmatter } from './Frontmatter';
import { type DocumentTypes } from 'contentlayer/generated';

export interface MdxPageProps {
    headings: Heading[];

    data: DocumentTypes;

    siblings: {
        next: Frontmatter;
        prev: Frontmatter;
    };
}
