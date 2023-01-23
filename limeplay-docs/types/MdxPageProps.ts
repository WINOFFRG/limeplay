import { Heading } from '@/utils/get-table-of-contents';
import { Frontmatter } from './Frontmatter';
import { type DocumentTypes } from 'contentlayer/generated';

export interface MdxPageProps {
    data: DocumentTypes;
}
