import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable server actions if needed
    serverActions: {
      allowedOrigins: ['localhost:3001', 'localhost:3000']
    }
  },
  // Configure image domains for Auth0 profiles
  images: {
    domains: ['*.gravatar.com', 'lh3.googleusercontent.com', 's.gravatar.com']
  },
  // Redirect configuration for API routes
  async rewrites() {
    return [
      {
        source: '/api/session/:path*',
        destination: 'http://localhost:3001/api/:path*'
      }
    ]
  }
};

export default nextConfig;