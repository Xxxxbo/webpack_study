// 引入样式文件
import '../css/index.less'
import print from './print'

console.log('js被重新加载了')
function add(x, y) {
  return x + y
}

console.log(add(1, 2))

print()

if (module.hot) {
  // module.hot为true  说明开启了HMR功能  -->  让HMR功能代码生效
  module.hot.accept('./print.js', function () {
    // 方法会监听 print.js 文件的变化 一旦发生变化 其他模块不会重新构建
    // 会执行后面的回调函数
    print()
  })
}
