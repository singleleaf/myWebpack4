import './css/style.css'
import b from './js/b.js'
// es6语法测试
const test = () => {
    b()
}
test()

let a = 'hello dfgf'
document.body.innerHTML = a
console.log('这是webpack打包的入口文件')

// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept()
}
