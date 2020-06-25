class HelloWorldPlugin {
    constructor(options) {
        console.log(options)
    }
    apply(compiler) {
        console.log(`Hello World`)
        // compiler.plugin('事件名', 回调函数)
        // compilation（'编译器'对'编译ing'这个事件的监听）

        compiler.plugin('compile', function () {
            console.log(`The compiler is starting to compile...-----`)
        })
        // compilation（'编译器'对'编译ing'这个事件的监听）
        compiler.plugin('compilation', function (compilation) {
            console.log(`The compiler is starting a new compilation...-----`)
            compilation.plugin('optimize', function () {
                console.log('The compilation is starting to optimize files...')
            })
        })
        compiler.plugin('done', function () {
            console.log(`done......`)
        })
        //常见钩子：afterPlugins	启动一次新的编译 compile	创建compilation对象之前  compilation	compilation对象创建完成
        // emit	资源生成完成，输出之前 afterEmit	资源输出到目录完成done	完成编译

        compiler.hooks.emit.tap('HelloWorldPlugin', (compilation) => {
            console.log('自定义插件编译了！！')
        })
    }
}

module.exports = HelloWorldPlugin
