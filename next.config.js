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
  // Forçar o Next.js a não usar o Edge em páginas que ele acha que deve
  // se elas estiverem quebrando o build.
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'crypto'],
  },
};

module.exports = nextConfig;
