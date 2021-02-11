const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
  plugins: [new HtmlWebpackPlugin({
    clientId: '88457129753-tqqvr0ds1j2d20dojtirv21kn78bfi5n.apps.googleusercontent.com'
  })],
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('example'),
    watchContentBase: true,
    historyApiFallback: {
      index: 'index.html'
    }
  }
}
