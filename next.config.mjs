/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'static.tildacdn.com',
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

