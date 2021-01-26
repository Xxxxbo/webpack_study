// import '../css/index.css';
import { add } from './test'
function sum(...args) {
  return args.reduce((p, c) => p + c, 0)
}

console.log(sum(1, 2, 3, 4, 5, 6))

console.log(add(1, 3))
