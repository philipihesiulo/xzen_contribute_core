/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        localPatterns: [
            {
                pathname: "/api/image-proxy",
                search: "?url=**", // 👈 allow query param in your API route
            },
            {
                pathname: "/**", // 👈 allow all local static assets
            },
        ],
    },
};

export default nextConfig;
