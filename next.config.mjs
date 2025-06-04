/** @type {import('next').NextConfig} */
const nextConfig = {
   async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://35.202.100.254/oe/api/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Stub out the canvas module for server-side builds
      config.resolve.alias['canvas'] = false;
    }
    return config;
  },
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
