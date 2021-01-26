// 拼接路径
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 代码分割：将打包输出的一个大的bundle.js文件拆分为多个小文件，这样可以并行加载多个文件，比加载一个文件更快
 */

module.exports = {
  // 生产模式自动压缩js
  mode: 'production',
  // 单入口
  entry: './src/js/index.js',
  output: {
    // [name]:取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  /**
   * 1. 可以将node_modules中的代码单独打包成一个chunk最终输出
   * 2. 自动分析多入口chunk中有没有引入公共文件 如果有 会打包成单独的一个chunk
   */
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    // HtmlWebpackPlugin：html文件的打包和压缩处理
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
  ],
}
