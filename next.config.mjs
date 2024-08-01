/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true, // Включаем поддержку app директории
    },
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'img.hhcdn.ru',
                    pathname: '**',
                },
                {
                    protocol: 'https',
                    hostname: 'habrastorage.org',
                    pathname: '**',
                },
            ],
        },
};

export default nextConfig;

