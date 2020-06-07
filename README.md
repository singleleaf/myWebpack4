 
学习webpack4的一些基本配置，如：多入口、loader、pliugins、热更新、区分开发环境和生产环境等
 开发环境命令：
###  "dev": "cross-env NODE_ENV=development webpack-dev-server --config config/webpack.dev.config.js",
生产环境命令：
###  "build": "cross-env NODE_ENV=production webpack --config config/webpack.prod.config.js --progress --inline --colors",
 不区分环境的命令（对应的配置是webpack.config.js）：
 ### "server": "webpack-dev-server"
