import React from 'react';
import { PageHead } from '../components/PageHead/PageHead';
import { MdxPage } from '../components/MdxPage/MdxPage';
import { getDocsData } from '../components/Layout/get-docs-data';
import { MdxPageProps, Frontmatter } from '../types';
import { allDocuments, type DocumentTypes } from 'contentlayer/generated';
import Layout from '@/components/Layout/Layout';
import { Heading, getTableOfContents } from '@/utils/get-table-of-contents';
import { MdxErrorPage } from '@/components/MdxPage/MdxErrorPage/MdxErrorPage';
import useRawPath from '@/hooks/use-raw-path';
import { getPageSiblings } from '@/utils/get-page-siblings';

export default function DocPage({
    mdx,
}: {
    mdx: {
        data: DocumentTypes;
        headings: Heading[];
    };
}) {
    const { rawPath } = useRawPath();

    if (!mdx) {
        return (
            <>
                <PageHead title="Error" />
                <Layout
                    location={{
                        pathname: rawPath,
                    }}
                >
                    <MdxErrorPage />
                </Layout>
            </>
        );
    }

    return (
        <>
            <PageHead
                title={mdx.data.title}
                description={mdx.data.description}
            />
            <Layout
                location={{
                    pathname: rawPath,
                }}
            >
                <article>
                    <MdxPage data={mdx.data} headings={mdx.headings} />
                </article>
            </Layout>
        </>
    );
}

export const getStaticProps = ({ params }) => {
    const document = allDocuments.find((post) => {
        const pathAsked = params.slug.join('/');
        const pathFound =
            post._raw.sourceFileDir +
            '/' +
            post._raw.sourceFileName.replace(/\.mdx$/, '');

        return pathAsked === pathFound;
    });

    if (document) {
        return {
            props: {
                mdx: {
                    data: document,
                    headings: getTableOfContents(document.body.raw),
                },
            },
        };
    } else {
        return {
            props: {
                error: true,
            },
        };
    }
};

export const getStaticPaths = () => {
    return {
        paths: allDocuments.map((post) => ({
            params: {
                slug: [
                    post._raw.sourceFileDir,
                    post._raw.sourceFileName.replace(/\.mdx$/, ''),
                ],
            },
        })),
        fallback: false,
    };
};
