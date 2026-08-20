import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Na Vercel, carimba o commit publicado; fora dela, fica "local".
    NEXT_PUBLIC_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  },
};

export default nextConfig;
