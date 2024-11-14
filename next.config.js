/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.aiwith.me',
        pathname: '/**',
      },
    ],
    unoptimized: true, // 如果你想完全禁用图片优化
  },
}

module.exports = nextConfig 