const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Allow build to succeed even if types have errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint during production build
  },
};

module.exports = nextConfig;
