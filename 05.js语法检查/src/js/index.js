function add(x, y) {
  return x + y;
}

// 下一行eslint所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line
console.log(add(3, 8))

function say(x, y) {
  return x + y;
}

console.log(say('hello', 'eslint'));
