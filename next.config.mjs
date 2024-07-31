/** @type {import('next').NextConfig} */
const nextConfig = {
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

