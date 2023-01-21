import React from 'react';
import TableOfContents from '../TableOfContents/TableOfContents';
import { MdxPageBase } from '../MdxPageBase/MdxPageBase';
import { MdxSiblings } from '../MdxSiblings/MdxSiblings';
import { MdxPageProps } from '../../../types';
import useStyles from './MdxRawContent.styles';
import { useMDXComponent } from 'next-contentlayer/hooks';

export function MdxRawContent({ data, headings, siblings }: MdxPageProps) {
    const { classes } = useStyles({ withToc: !data.hideToc });
    const Component = useMDXComponent(data.body.code);

    return (
        <MdxPageBase>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Component>{data.body}</Component>
                    {!data.hideToc && <MdxSiblings siblings={siblings} />}
                </div>

                {!data.hideToc && (
                    <div className={classes.tableOfContents}>
                        <TableOfContents headings={headings} withTabs={false} />
                    </div>
                )}
            </div>
        </MdxPageBase>
    );
}
