module.exports = {
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
}