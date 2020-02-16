const path = require('path')
const uglify = require('uglifyjs-webpack-plugin') //压缩js
const htmlPlugin = require('html-webpack-plugin') //打包HTML文件
const extractTextPlugin = require('extract-text-webpack-plugin') //打包HTML文件

// 这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口。
var website = {
    publicPath: 'http://localhost:80/',
    // publicPath:"http://192.168.1.103:8888/"
}

module.exports = {
    mode: 'development',
    // 入口配置文件

    entry: {
        // 多个入口，其中main、main2可以随便定义, ./src 相对于package.json来说的，../src会报错
        //  packsge.json里面的script配置下命令，让打包的时候执行我们在config/webpack.dev.js下面配置的入口)

        main: './src/main.js',
        main2: './src/main2.js',
    },
    // 出口配置文件
    output: {
        // 打包生成的路径
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js', //打包生成的文件的名字，入口文件是什么，出口文件就叫什么
        publicPath: website.publicPath, //publicPath：主要作用就是处理静态文件路径的。
    },
    //模块 解读css 、图片、压缩等
    module: {
        rules: [
            {
                test: /\.css$/,
                // 将css从打包的js中分离出来
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
                // use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    },
                ],
            },

            {
                test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
                use: [
                    {
                        loader: 'url-loader', //是指定使用的loader和loader的配置参数
                        options: {
                            limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
                            outputPath: 'images/', //打包后的图片放到images文件夹下
                        },
                    },
                ],
            },
            // 处理HTML中的图片
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader'],
            },
            //babel 配置
            // {
            //     test: /\.(jsx|js)$/,
            //     use: {
            //         loader: 'babel-loader',
            //     },
            //     exclude: /node_modules/,
            // },
        ],
    },
    //插件，用于生产模板和各项功能
    plugins: [
        new uglify(), //js压缩插件
        new htmlPlugin({
            minify: {
                //是对html文件进行压缩
                removeAttributeQuotes: true, //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html', //是要打包的html模版路径和文件名称。
        }),
        new extractTextPlugin('css/index.css'), //这里的/css/index.css 是分离后的路径
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, '../dist'),
        //服务器ip地址
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 80,
    },
}
