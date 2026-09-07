/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    // Static export cannot use the Next.js Image Optimization server.
    unoptimized: true,
  },
  // Ensure a clean static site that can be hosted anywhere.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
