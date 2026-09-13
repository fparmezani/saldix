/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.SALDIX_NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  transpilePackages: ['@saldix/shared-types'],
};

export default nextConfig;
