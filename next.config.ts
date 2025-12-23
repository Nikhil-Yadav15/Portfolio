import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '192.168.1.8',
    '192.168.1.0/24', // Allow all devices on your local network
  ],
};

export default nextConfig;
