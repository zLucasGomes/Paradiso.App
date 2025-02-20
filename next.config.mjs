/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "5000mb"
        }
    }
};

export default nextConfig;
