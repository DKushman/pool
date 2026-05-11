import type { NextConfig } from "next";

/** Ohne führenden Slash, z. B. `daum-architekten` für https://user.github.io/daum-architekten/ (GitHub Actions setzt Repo-Name automatisch) */
function normalizeBasePath(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.poolarch.ch",
        pathname: "/assets/**",
      },
    ],
  },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
