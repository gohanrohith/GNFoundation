/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone mode is highly recommended for projects using Chromium/Puppeteer
  output: 'standalone',
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
    // Broaden the trace to ensure the 'bin' folder within the package is captured
    outputFileTracingIncludes: {
      '/api/certificates/**/*': ['node_modules/@sparticuz/chromium/**/*'],
    },
  },
  // Ensure these are not bundled by Webpack to allow the binary to be found at the system level
  serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default nextConfig;