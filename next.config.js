/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ISSO AQUI É O QUE O NEXT-AUTH PRECISA NO EDGE
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'node:crypto': 'commonjs crypto',
        'node:stream': 'commonjs stream',
        'node:url': 'commonjs url',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
