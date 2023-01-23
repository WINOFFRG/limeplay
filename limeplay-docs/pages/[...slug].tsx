import React from 'react';
import { MdxPage } from '../components/MdxPage/MdxPage';
import { allDocuments, type DocumentTypes } from 'contentlayer/generated';
import Layout from '@/components/Layout/Layout';
import { Heading, getTableOfContents } from '@/utils/get-table-of-contents';
import { MdxErrorPage } from '@/components/MdxPage/MdxErrorPage/MdxErrorPage';
import useRawPath from '@/hooks/use-raw-path';
import SEO from '@/components/seo';
import { getDocumentsByType } from '@/utils/get-docs-by-type';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

export default function DocPage({
    mdx,
    error,
}: {
    mdx: DocumentTypes;
    error?: boolean;
}) {
    if (!mdx || error) {
        return (
            <>
                <Layout>
                    NOT FOUND
                    {/* <MdxErrorPage /> */}
                </Layout>
            </>
        );
    }

    return (
        <>
            <SEO title={mdx.title} description={mdx.description} />
            <Layout>
                <article>
                    <MdxPage mdx={mdx} />
                </article>
            </Layout>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const document = allDocuments.find((post) => {
        const pathAsked =
            params?.slug && Array.isArray(params.slug)
                ? '/' + params.slug.join('/')
                : params?.slug;
        const pathFound = post.slug;

        return pathAsked === pathFound;
    });

    if (document) {
        return {
            props: {
                mdx: document,
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

export const getStaticPaths = async () => {
    const paths = allDocuments.map((doc) => doc.slug);

    return {
        paths,
        fallback: false,
    };
};
