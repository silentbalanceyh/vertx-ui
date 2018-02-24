const fnEnv = (key) => process.env[key];
module.exports = {
    $LANG : fnEnv('APP_LANGUAGE'),
    $ENDPOINT : fnEnv('APP_ENDPOINT'),
    $APP : fnEnv('APP_NAME'),
    $PATH : fnEnv('APP_ROUTE'),
    $K_SESSION : fnEnv('KEY_SESSION'),
    $K_EVENT :fnEnv('KEY_EVENT'),
    $DEBUG : fnEnv('DEV_DEBUG'),
    $TP:{
        // 第三方
        $BAIDU_KEY : fnEnv('TP_BAIDU')
    }
};
