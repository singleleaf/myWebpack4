let webpack = require('webpack')
const merge = require('webpack-merge')
let common = require('./webpack.base.config')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist', //生成静态文件路径
        host: 'localhost', // 默认是localhost
        port: 90, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新
        overlay: true, //如果出错，则在浏览器中显示出错误
        inline: true, // 实时构建,
        progress: true, // 显示打包进度,
        // 如果找不到界面就返回默认首页
        historyApiFallback: {
            index: '../index.html',
        },
    },
    plugins: [
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin(),
    ],
})
