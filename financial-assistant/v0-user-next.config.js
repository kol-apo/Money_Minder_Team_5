/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This ensures Next.js can find components in the frontend folder
  // and API handlers in the backend folder
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
}

module.exports = nextConfig

