const fnEnv = (key) => process.env[key];
module.exports = {
    $LANG : fnEnv('APP_LANGUAGE'), // VIE - 系统使用的语言
    $ENDPOINT : process.env.UI_ENDPOINT, // VIE - 远程地址Api
    $APP : process.env.UI_APP, // 应用程序名称
    $LOGIN : process.env.URI_LOGIN, // 系统入口（一般是登陆）
    $MAIN : process.env.URI_MAIN, // 系统主界面地址,
    $PATH : process.env.URI_CTX, // Context根路径：重要参数
    $K_SESSION : process.env.KEY_SESSION, // 存储专用Key前缀
    $K_EVENT : process.env.KEY_EVENT, // Redux专用Key前缀
    $DEBUG : process.env.DEV_DEBUG, // 是否DEBUG模式
    $MAP_KEY : process.env.MAP_KEY
}
