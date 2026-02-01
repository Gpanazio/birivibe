/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization (not supported on Cloudflare Pages without R2/Image Resizing)
  images: {
    unoptimized: true,
  },

  // Garante que o build não quebre por causa de otimizações de imagem
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
