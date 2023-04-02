// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withContentlayer } = require('next-contentlayer');

const handleRedirects = async () => [
	{
		source: '/',
		destination: '/pages/getting-started',
		permanent: false,
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
};

module.exports = withContentlayer(nextConfig);
