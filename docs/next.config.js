/* eslint-disable @typescript-eslint/no-var-requires */
const { withContentlayer } = require('next-contentlayer');
const { withPlaiceholder } = require('@plaiceholder/next');

const handleRedirects = async () => [
	{
		source: '/',
		destination: '/pages/getting-started',
		permanent: true,
	},
];

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	redirects: handleRedirects,
	images: {
		domains: ['limeplay.me'],
	},
};

const config = withContentlayer(nextConfig);
module.exports = withPlaiceholder(config);
