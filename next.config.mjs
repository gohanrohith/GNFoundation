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
    // Help Vercel trace chromium binaries
    outputFileTracingIncludes: {
      '/api/certificates/generate-html': ['./node_modules/@sparticuz/chromium/**/*'],
    },
  },
  // Exclude from webpack bundling (compatible versions: chromium@119.0.2 + puppeteer-core@21.6.1)
  serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default nextConfig;