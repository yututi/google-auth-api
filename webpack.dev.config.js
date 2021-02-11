const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')
const { clientId } = require('./config')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    library: pkg.author,
    filename: 'module.js',
    publicPath: 'example'
  },
  module: {
    rules: [
      { test: /\.m?js$/, loader: 'babel-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    clientId: clientId
  })],
  devtool: 'source-map',
  devServer: {
    contentBase: 'example',
    watchContentBase: true,
    historyApiFallback: {
      index: 'index.html'
    }
  }
}
