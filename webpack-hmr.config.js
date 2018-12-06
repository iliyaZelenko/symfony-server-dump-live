/* You could of course use only babel, for TS this is https://babeljs.io/docs/en/babel-preset-typescript https://babeljs.io/setup#installation */

const { resolve, join } = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'rrr'),
    hot: true,
    // contentBase: join(__dirname, 'rrr'),
    // compress: true,
    port: 9000
  },
  target: 'web',
  // node: {
  //   __dirname: false,
  //   __filename: false
  // },
  entry: './rrr/index.html',
  // output: {
  //   path: resolve(__dirname, './dist'),
  //   filename: 'index.js'
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
