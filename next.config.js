/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages config
  output: 'standalone',

  // Disable image optimization (not supported on Cloudflare Pages)
  images: {
    unoptimized: true,
  },

  // Experimental features for edge runtime
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.pages.dev'],
    },
  },

  // Webpack config for Cloudflare compatibility
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for Prisma
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };

    if (isServer) {
      // Exclude problematic packages from server bundle
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig
