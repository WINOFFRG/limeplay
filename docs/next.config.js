import withContentlayer from 'next-contentlayer';

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withContentlayer(nextConfig);
