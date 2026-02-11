/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', 
    // reactStrictMode: false,
    webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
