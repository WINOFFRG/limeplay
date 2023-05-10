import React from 'react';
import { DocumentTypes } from 'contentlayer/generated';
import { MdxPageHeader } from './MdxPageHeader/MdxPageHeader';
import { MdxPageTabs } from './MdxPageTabs/MdxPageTabs';
import { MdxRawContent } from './MdxRawContent/MdxRawContent';

export function MdxPage({ mdx }: { mdx: DocumentTypes }) {
	return (
		<>
			<MdxPageHeader frontmatter={mdx} />
			{Array.isArray(mdx.props) ? (
				<MdxPageTabs data={mdx} />
			) : (
				<MdxRawContent data={mdx} />
			)}
		</>
	);
}
