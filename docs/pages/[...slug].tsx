import React from 'react';
import { allDocuments, type DocumentTypes } from 'contentlayer/generated';
import { GetStaticProps } from 'next';
import { MdxPage } from '../components/MdxPage/MdxPage';
import Layout from '@/components/Layout/Layout';
import { MdxErrorPage } from '@/components/MdxPage/MdxErrorPage/MdxErrorPage';
import SEO from '@/components/seo';

export default function DocPage({
	mdx,
	error,
}: {
	mdx: DocumentTypes;
	error?: boolean;
}) {
	if (!mdx || error) {
		return (
			<Layout>
				<MdxErrorPage />
			</Layout>
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
				? `/${params.slug.join('/')}`
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
	}
	return {
		props: {
			error: true,
		},
	};
};

export const getStaticPaths = async () => {
	const paths = allDocuments.map((doc) => doc.slug);

	return {
		paths,
		fallback: false,
	};
};
