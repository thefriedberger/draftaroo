/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverActions: true,
      appDir: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'assets.nhle.com',
            port: '',
         },
      ],
   },
};

module.exports = nextConfig;
