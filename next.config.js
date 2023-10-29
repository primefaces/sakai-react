/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json'],
        serverActions: true,
    },
}

module.exports = nextConfig
