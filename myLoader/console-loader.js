module.exports = function (context) {
    console.log(context)
    //将js文件的console.log去掉
    return context.replace(/console\.log\(.*?\)/g, '') //一定要renturn出去
}
