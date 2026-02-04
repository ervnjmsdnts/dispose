import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'watchful-wolverine-191.convex.cloud',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'content-clownfish-133.convex.cloud',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
