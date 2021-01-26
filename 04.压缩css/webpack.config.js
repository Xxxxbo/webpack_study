const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
const { resolve } = require('path') // resolve用来拼接绝对路径的方法

// 可以提取css为单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// optimize-css-assets-webpack-plugin 压缩css的插件

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 定义node环境变量，决定browerslist用哪个环境
process.env.NODE_ENV = 'development'

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        // 处理less资源
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // 或者将插件引入写在单独的配置js中
                // config: './postcss.config.js',
                plugins: [['postcss-preset-env', {}]],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    // open: true,
  },
}
