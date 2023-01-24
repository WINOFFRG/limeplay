import React from 'react';
import TableOfContents from '../TableOfContents/TableOfContents';
import { MdxPageBase } from '../MdxPageBase/MdxPageBase';
import { MdxSiblings } from '../MdxSiblings/MdxSiblings';
import { MdxPageProps } from '../../../types';
import useStyles from './MdxRawContent.styles';
import { useMDXComponent } from 'next-contentlayer/hooks';
import useRawPath from '@/hooks/use-raw-path';

export function MdxRawContent({ data }: MdxPageProps) {
    const { classes } = useStyles({ withToc: !data.hideToc });
    const Component = useMDXComponent(data.body.code);
    const { rawPath } = useRawPath();

    return (
        <MdxPageBase>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Component>{data.body}</Component>
                    {!data.hideToc && (
                        <MdxSiblings type={'Guide'} route={rawPath} />
                    )}
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