// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withContentlayer } = require('next-contentlayer');

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

module.exports = withContentlayer(nextConfig);
