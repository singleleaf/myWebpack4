let path = require('path')
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin')
// 拆分css样式的插件
// let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
let webpack = require('webpack')
// 这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口。
var website = {
    publicPath: 'http://localhost:90/',
}

module.exports = {
    resolve: {
        // 别名
        alias: {
            '@': './src',
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css'],
    },
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js',
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        // 打包生成的路径
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js', // 打包后会生成index.js和login.js文件
        publicPath: website.publicPath, //publicPath：主要作用就是处理静态文件路径的。
    },
    // 提取公共代码（两个文件相同的部分）
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    // 抽离第三方插件
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor', // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10,
                },
                utils: {
                    // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'util', // 任意命名
                    minSize: 0, // 只要超出0字节就生成一个新包
                },
            },
        },
    },

    module: {
        rules: [
            {
                test: /\.(le|c)ss$/, // 可以打包后缀为sass/scss/css的文件
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                            publicPath: '../',
                            // publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
                            // hmr: devMode, // 仅dev环境启用HMR功能
                        },
                    },
                    'css-loader',
                    'less-loader',
                ],
            },

            // {
            //     test: /\.less|.css$/, // 解析less
            //     use: ExtractTextWebpackPlugin.extract({
            //         use: ['css-loader', 'less-loader', 'postcss-loader'], // 'postcss-loader'自动添加css前缀
            //         publicPath: '../',
            //     }),
            // },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            esModule: false, //解决img的src生成有default
                            limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/', // 图片打包后存放的目录
                        },
                    },
                ],
            },
            // 页面中经常会用到img标签时
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader',
            },
            //引入字体和svg
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader',
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    // 配置选项里的presets
                    // 包含ES6还有之后的版本和那些仅仅是草案的内容
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
                include: /src/, // 只转化src目录下的js
                exclude: /node_modules/, // 排除掉node_modules，优化打包速度
            },
        ],
    },
    plugins: [
        // 通过new一下这个类来使用插件
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['vendor', 'index'], // 对应关系,vender: 抽离出来的第三方的库，index.js对应的是index.html
        }),
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['vendor', 'login'], // 对应关系,vender: 抽离出来的第三方的库，login.js对应的是login.html
        }),
        // // 拆分后会把css文件放到dist目录下的css/style.css
        // new ExtractTextWebpackPlugin('css/style.css'),
        new MiniCssExtractPlugin({
            // 这里的配置和webpackOptions.output中的配置相似
            // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),

        // 打包前先清空
        new CleanWebpackPlugin(),
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist', //生成静态文件路径
        host: 'localhost', // 默认是localhost
        port: 90, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新
        overlay: true, //如果出错，则在浏览器中显示出错误
        inline: true, // 实时构建,
        progress: true, // 显示打包进度,
    },
}
