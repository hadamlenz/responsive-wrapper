//export NODE_ENV=development for sourcemaps and development post processing
const path = require("path");
const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');

var config = {
  'feature-detects': [
    "img/webp"
  ]
}

module.exports = {
  mode: 'development',
  stats: {
    ...defaultConfig.stats,
    assets: false,
    errors: false,
  },
  resolve: {
    alias: {
      'node_modules': path.join(__dirname, 'node_modules')
    }
  },
  ...defaultConfig,
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: '../fonts/[name][ext]',
        },
      },
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
};