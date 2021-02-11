const { resolve } = require('path')
const pkg = require('./package.json')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    library: pkg.author,
    filename: 'module.js',
    path: resolve('example')
  },
  module: {
    rules: [
      { test: /\.m?js$/, loader: 'babel-loader' }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('example'),
    watchContentBase: true
  }
}
