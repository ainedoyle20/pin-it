/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io", "i.pinimg.com", "just65.com"],
  }
}

module.exports = nextConfig
