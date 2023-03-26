import React, { Suspense } from 'react';
import { GetStaticProps } from 'next';
import { allDocuments, type DocumentTypes } from '@/.contentlayer/generated';
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
			<Suspense fallback={<DocPage mdx={mdx} error />}>
				<Layout>
					<article>
						<MdxPage mdx={mdx} />
					</article>
				</Layout>
			</Suspense>
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const document = allDocuments.find((post) => {
		const pathAsked =
			params?.slug && Array.isArray(params.slug)
				? `/${params.slug.join('/')}`
				: `${params?.slug}`;

		return pathAsked === post.slug;
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
