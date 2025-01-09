import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/chat',
                destination: 'http://113.56.219.163:5006/chat'
            }
        ];
    }
};

export default nextConfig;