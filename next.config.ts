import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "base44.app",
      },
      {
        protocol: "https",
        hostname: "media.base44.com",
      },
    ],
  },
};

export default nextConfig;
