const withNextIntl = require('next-intl/plugin')('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export for development
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Enable experimental features for better performance
  experimental: {
    scrollRestoration: true
  }
}

module.exports = withNextIntl(nextConfig)
