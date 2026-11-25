import type { NextConfig } from 'next';

// Conservative security headers that do not interfere with the inline pre-paint script,
// Web3Forms submissions or WebGL. A full Content-Security-Policy is left for a later pass.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['motion'],
  experimental: {
    // Unmatched URLs render app/global-not-found.tsx (the app has one root layout per language).
    globalNotFound: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  webpack: (config, { dev }) => {
    // Kept from the original project: lets file watching be disabled with DISABLE_HMR=true.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
