/** @type {import('next').NextConfig} */
const nextConfig = {
  // other configs...

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
