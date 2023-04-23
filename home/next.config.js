/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	compiler: {
		emotion: true,
	},
	transpilePackages: ['@limeplay/core'],
};

module.exports = nextConfig;
