const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = withContentlayer(nextConfig);
