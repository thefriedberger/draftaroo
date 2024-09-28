/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverActions: true,
      appDir: true,
      nextScriptWorkers: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'assets.nhle.com',
            port: '',
         },
         {
            protocol: 'https',
            hostname: 'mfiegmjwkqpipahwvcbz.supabase.co',
            port: '',
         },
      ],
   },
   webpack(config, options) {
      config.module.rules.push({
         test: /\.worker\.js$/,
         loader: 'worker-loader',
         // options: { inline: true }, // also works
         options: {
            name: 'static/[hash].worker.js',
            publicPath: '/_next/',
         },
      });
      return config;
   },
};

module.exports = nextConfig;
