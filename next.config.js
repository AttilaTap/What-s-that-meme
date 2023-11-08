const withPWA = require("next-pwa");

const nextConfig = {};

module.exports =
  process.env.NODE_ENV === "production"
    ? withPWA({
        pwa: {
          dest: "public",
        },
        ...nextConfig,
      })
    : nextConfig;
