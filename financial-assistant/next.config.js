/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
      unoptimized: true,
    },
  }
  
  module.exports = nextConfig