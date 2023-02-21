const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
    ignoreBuildErrors: true,
};

module.exports = withContentlayer(nextConfig);
