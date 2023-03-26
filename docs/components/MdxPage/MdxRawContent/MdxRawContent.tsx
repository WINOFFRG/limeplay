import React from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import TableOfContents from '../TableOfContents/TableOfContents';
import { MdxPageBase } from '../MdxPageBase/MdxPageBase';
import { MdxSiblings } from '../MdxSiblings/MdxSiblings';
import { MdxPageProps } from '../../../types';
import useStyles from './MdxRawContent.styles';

const codePrefix = `
if (typeof process === 'undefined') {
  globalThis.process = { env: {} }
}
`;

export function MdxRawContent({ data }: MdxPageProps) {
	const { classes } = useStyles({ withToc: !data.hideToc });
	const Component = useMDXComponent(codePrefix + data.body.code);

	return (
		<MdxPageBase>
			<div className={classes.wrapper}>
				<div className={classes.container}>
					<Component>{data.body}</Component>
					{!data.hideToc && <MdxSiblings type="Guide" />}
				</div>

				{!data.hideToc && (
					<div className={classes.tableOfContents}>
						<TableOfContents
							headings={data.headings}
							withTabs={false}
						/>
					</div>
				)}
			</div>
		</MdxPageBase>
	);
}
