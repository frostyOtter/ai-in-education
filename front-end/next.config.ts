import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
