import React from 'react';
import { MdxPageHeader } from './MdxPageHeader/MdxPageHeader';
import { MdxPageTabs } from './MdxPageTabs/MdxPageTabs';
import { MdxRawContent } from './MdxRawContent/MdxRawContent';
import { MdxErrorPage } from './MdxErrorPage/MdxErrorPage';
import { MdxPageProps, Frontmatter } from '../../types';
import { allDocuments, type DocumentTypes } from 'contentlayer/generated';

export function MdxPage(props: MdxPageProps) {
    const { data } = props;

    return (
        <>
            <MdxPageHeader frontmatter={data} />

            {Array.isArray(props.data.props) ? (
                <MdxPageTabs {...props} />
            ) : (
                <MdxRawContent {...props} />
            )}
        </>
    );
}
