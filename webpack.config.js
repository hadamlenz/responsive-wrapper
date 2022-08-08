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
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
};