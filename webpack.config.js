const { resolve } = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'youtube-data-api.js',
    path: resolve('dist')
  },
  module: {
    rules: [
      { test: /\.m?js$/, loader: 'babel-loader' }
    ]
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()]
  }
}
