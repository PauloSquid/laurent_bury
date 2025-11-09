/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimisations SEO
  compress: true,
  poweredByHeader: false,
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
