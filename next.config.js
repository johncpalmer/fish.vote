module.exports = {
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
  webpack5: true,
  styledComponents: true,
}