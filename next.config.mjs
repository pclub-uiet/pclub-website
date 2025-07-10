/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ibb.co',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", 
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",    // Cloudinary added
      },
    ],
  },
};

export default nextConfig;
