import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;


