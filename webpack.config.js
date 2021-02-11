const { resolve } = require('path')
const pkg = require('./package.json')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    library: pkg.author,
    filename: `${pkg.name}.js`,
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
