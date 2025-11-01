import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  optimizeFonts: true,
  experimental: {
    optimizePackageImports: ['next/font']
  }
}

export default nextConfig
