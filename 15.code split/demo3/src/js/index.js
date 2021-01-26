/**
 * 通过js代码 让某个文件单独打包成一个chunk
 * import动态导入语法：能将某个文件单独打包
 * webpackChunkName：指定test文件打包后的名称
 */
import(/*webpackChunkName: 'test'*/'./test')
  .then(({ add }) => {
    // 文件加载成功
    console.log(add(2, 9))
  })
  .catch(() => {
    console.log('文件加载失败~')
  })

function sum(...args) {
  return args.reduce((p, c) => p + c, 0)
}

console.log(sum(1, 2, 3, 4, 5, 6))
