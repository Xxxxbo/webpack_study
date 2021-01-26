// 拼接路径
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

// 定义nodejs的环境变量  决定使用browerslist中的哪个环境配置
process.env.NODE_ENV = 'production'

/**
 * PWA：渐进式网络开发应用程序（离线可访问）
 * workbox --> workbox-webpack-plugin
 *
 */

// 复用处理样式的loader
const commonCssLoader = [
  // 提取css成单独文件
  MiniCssExtractPlugin.loader,
  'css-loader',
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
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      /**
       * 先执行语法检查  在做兼容性处理
       */
      // js语法检查
      // 在package.json中eslintConfig --> airbnb
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
      {
        // oneOf：优化生产环境的打包构建速度
        // 以下loader只会匹配一个（匹配到了后就不会再往下匹配了）
        // 注意：不能有两个配置处理同一种类型的文件（所以把eslint-loader放外面）
        oneOf: [
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
           * 正常来讲，一个文件只能被一个loader处理。
           * 当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
           * 先执行eslint 在执行babel
           */
          // js兼容性
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              // 开启多进程打包
              // 进程启动大概600ms 进程通信也有开销
              // 只有工作消耗时间比较长  才需要多进程打包
              {
                loader: 'thread-loader',
                options: {
                  workers: 2, // 进程2个
                },
              },
              {
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
                  // 开启babel缓存
                  // 第二次构建时  会读取缓存
                  cacheDirectory: true,
                },
              },
            ],
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
      filename: 'css/built.[contenthash:10].css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      /**
       * 1. 帮助serviceworker快速启动
       * 2. 删除旧的 serviceworker
       *
       * 生成一个 serviceworker 配置文件
       */
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devtool: 'source-map',
  // 让某些库不打包
  // externals: {
  //   // 拒绝jQuery被打包进来(通过cdn引入，速度会快一些)
  //   // 忽略的库名 -- npm包名
  //   jquery: 'jQuery',
  // },
}
