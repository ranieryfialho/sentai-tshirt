/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net', // A maioria das imagens da Nuvemshop vem daqui
      },
      {
        protocol: 'https',
        hostname: '*.nuvemshop.com.br',
      },
      {
        protocol: 'https',
        hostname: 'images.tcdn.com.br', // Algumas lojas usam esse CDN
      }
    ],
  },
};

export default nextConfig;