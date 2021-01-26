console.log('index.js文件被加载了~')

// import { add } from './test'

document.getElementById('btn').onclick = function () {
  // 正常加载：可以认为是并行加载（同一时间记载多个文件）没有先后顺序 先加载了不需要的资源就会浪费时间~
  // 懒加载：当文件需要使用时才加载 (需要代码分割) 但如果资源较大  加载时间就会较长 有延迟
  // 预加载：prefetch：会在使用之前提前加载js 等其他资源加载完了  浏览器空闲了  再偷偷加载这个资源
  //        这时使用时已经加载好了  速度比较快  所以在懒加载的基础上加上预加载会更好  
  // 预加载兼容性差 慎用！！！
  import(/*webpackChunkName: 'test', webpackPrefetch: true*/ './test')
    .then(({ add }) => {
      // 文件加载成功
      console.log(add(2, 9))
    })
}
