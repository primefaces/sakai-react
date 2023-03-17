/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NODE_ENV === "production" ? "/sakai-react" : "",
  publicRuntimeConfig: {
    contextPath: process.env.NODE_ENV === "production" ? "/sakai-react" : "",
    uploadPath:
      process.env.NODE_ENV === "production"
        ? "/sakai-react/upload.php"
        : "/api/upload",
  },
};

module.exports = nextConfig;
