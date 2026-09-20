/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone - a self-contained server, ideal for tiny Docker images.
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  // The config file is read at request time, so content edits never need a rebuild.
  experimental: {
    // simple-icons ships thousands of ESM named exports; keep it out of the server bundle trace list.
  },
};

export default nextConfig;
