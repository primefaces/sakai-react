/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json'],
        serverActions: true,
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
    env: {
        REACT_APP_ENDPOINT: "https://cloud.appwrite.io/v1",
        REACT_APP_PROJECT: "6547677d91c83d2afab0",
        REACT_APP_COLLECTION_ID: "60631b201eec4",
        REACT_APP_DATABASE_ID: "default"
    }
}

module.exports = nextConfig
