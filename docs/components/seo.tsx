import { NextSeo, NextSeoProps } from 'next-seo';
import React from 'react';
import siteConfig from 'settings/site-config.json';

export type SEOProps = Pick<NextSeoProps, 'title' | 'description'>;

function SEO({ title, description }: SEOProps) {
	return (
		<NextSeo
			title={title}
			description={description}
			openGraph={{ title, description }}
			titleTemplate={siteConfig.seo.titleTemplate}
		/>
	);
}

export default SEO;
