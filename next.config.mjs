/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds:true
    },
    async headers() {
        return [
          {
            source: "/api/(.*)",
            headers: [
              {
                key: "Access-Control-Allow-Origin",
                value: "*",
              },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              {
                key: "Access-Control-Allow-Headers",
                value:
                  "Content-Type, Authorization, x-refresh-token,x-assistant-id",
              },
            ],
          },
          {
            source: "/api/(.*)/(.*)",
            headers: [
              {
                key: "Access-Control-Allow-Origin",
                value: "*",
              },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              {
                key: "Access-Control-Allow-Headers",
                value:
                  "Content-Type, Authorization, x-refresh-token,x-assistant-id",
              },
            ],
          },
        ];
  },
    devIndicators:false
};

export default nextConfig;
