import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH || (isGitHubPages ? "/site-cg" : "");

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isGitHubPages ? true : undefined,
  experimental: {
    serverActions: {
      // Cover (10MB) + up to 4 gallery images (10MB each) can exceed the
      // 1MB default limit for Server Action request bodies.
      bodySizeLimit: "50mb",
    },
  },
  async redirects() {
    return [
      { source: "/jogos", destination: "/producoes#jogos", permanent: true },
      { source: "/jogos/:slug", destination: "/producoes/:slug", permanent: true },
    ];
  },
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
