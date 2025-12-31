/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Help Vercel trace Chromium binaries for certificate generation
    outputFileTracingIncludes: {
      '/api/certificates/**': ['./node_modules/@sparticuz/chromium/**/*'],
    },
  },
  // Exclude puppeteer and chromium from webpack bundling
  serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default nextConfig;
