import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cmm',
  assetPrefix: '/cmm',
};

export default nextConfig;
