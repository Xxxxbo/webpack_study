// 拼接路径
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 定义nodejs的环境变量  决定使用browerslist中的哪个环境配置
process.env.NODE_ENV = 'production'

// 复用处理样式的loader
const commonCssLoader = [
  // 提取css成单独文件
  MiniCssExtractPlugin.loader,
  'css-loader',
  // css兼容性处理 postcss需要通过package.json中browerslist里面的配置加载指定的兼容性样式
  /**
   * 在package.json中定义browerslist
   * "browerslist":{
   *    // 开发环境 需要设置node的环境变量 process.env.NODE_ENV = 'development'
   *    "development": [
   *      "last 1 chrome vesion",
   *      "last 1 firefox vesion",
   *      "last 1 ie vesion"
   *    ],
   *    // 生产环境 默认是生产环境
   *    "production": [
   *      ">0.2%",
   *      "not dead",
   *      "not op_mini all",
   *    ]
   * }
   */
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['postcss-preset-env', {}]],
      },
    },
  },
]

module.exports = {
  // 生产模式自动压缩js
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // 处理css资源
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      // less
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader'],
      },
      /**
       * 先执行语法检查  在做兼容性处理
       */
      // js语法检查
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复
          fix: true,
        },
      },
      // js兼容性
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设
          presets: [
            [
              // 基本语法转换
              '@babel/preset-env',
              // 高级语法转换   按需加载
              {
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3,
                },
                // 指定兼容到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                },
              },
            ],
          ],
        },
      },
      // 图片
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'imgs',
          // 关闭url-loader默认使用的es6的模块化解析
          esModule: false,
        },
      },
      // html中的img
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      // 其他资源
      {
        // 排除以上资源
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          outputPath: 'media',
        },
      },
    ],
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
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
}
