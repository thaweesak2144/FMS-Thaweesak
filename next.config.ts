import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const staticCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const dynamicUploadCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/images/(.*)", headers: staticCacheHeaders },
      { source: "/uploads/(.*)", headers: dynamicUploadCacheHeaders },
    ];
  },
};

export default nextConfig;
