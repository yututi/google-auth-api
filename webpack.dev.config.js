const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'module.js'
  },
  module: {
    rules: [
      { test: /\.m?js$/, loader: 'babel-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'example/index.html',
    clientId: require('./config').cliendId,
    inject: true
  })],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: {
      index: '/'
    }
  }
}
