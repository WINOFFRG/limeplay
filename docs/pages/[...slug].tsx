import React from 'react';
import { MdxPage } from '../components/MdxPage/MdxPage';
import { allDocuments, type DocumentTypes } from 'contentlayer/generated';
import Layout from '@/components/Layout/Layout';
import { MdxErrorPage } from '@/components/MdxPage/MdxErrorPage/MdxErrorPage';
import SEO from '@/components/seo';
import { GetStaticProps } from 'next';

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
                    <MdxErrorPage />
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
