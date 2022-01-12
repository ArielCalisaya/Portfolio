const withTM = require("next-transpile-modules")([
  "three",
]);
module.exports = withTM({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
      },
    });

    return config;
  },
});