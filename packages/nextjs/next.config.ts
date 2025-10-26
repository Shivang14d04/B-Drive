import type { NextConfig } from "next";

const isIpfs = process.env.NEXT_PUBLIC_IPFS_BUILD === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  // Ignore TypeScript build errors if the env variable is set
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },

  // IPFS export settings
  output: isIpfs ? "export" : undefined,
  trailingSlash: isIpfs ? true : undefined,
  images: isIpfs
    ? {
        unoptimized: true,
      }
    : undefined,

  // Webpack fallback for node modules in frontend
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals?.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  turbopack: {},
};

export default nextConfig;
