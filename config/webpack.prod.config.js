const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.base.config')
let { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'initial',
            automaticNameDelimiter: '.',
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2,
                    priority: 3,
                },
                // 抽离第三方插件
                vendors: {
                    // 指定是node_modules下的第三方包
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor', // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 1,
                },
            },
        },
        runtimeChunk: {
            name: (entrypoint) => `manifest.${entrypoint.name}`,
        },
    },
    plugins: [
        // 打包前先清空
        new CleanWebpackPlugin(),
    ],
})
