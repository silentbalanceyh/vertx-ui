import Ux from 'ux';
import Fn from '../functions';
import Q from 'q';

const _application = () => {
    /* 读取应用程序 */
    const appData = Ux.isInit();
    if (appData) {
        /* 已经初始化过一次 */
        if (appData.appKey) {
            /* 二次初始化完成后 */
            return Fn.promise(appData);
        } else {
            /* 直接调用接口 */
            return Ux.ajaxGet("/api/app");
        }
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return Fn.error001();
    }
};

const _menus = () => {
    const appData = Ux.isInit();
    if (appData && appData.key) {
        return Ux.ajaxGet("/api/menus");
    } else {
        /* 拒绝调用，应用程序未初始化 */
        return Fn.error001();
    }
};

const _module = (uri = "") => {
    /*
     * encodeURI 方法执行 encoding URI的编码动作
     */
    const entry = encodeURI(uri);
    return Ux.ajaxGet('/api/module', {entry});
};

export default {
    /* /app/name/:name */
    app: () => Ux.ajaxFetch("/app/name/:name", {name: Ux['Env']['APP']}),
    /* /api/app */
    application: _application,
    /* /api/menus */
    menus: _menus,
    /* /api/module?entry={entry} */
    module: _module,
    /*
     * 首页初始化
     * /api/app
     * /api/menus
     * */
    inited: () => Q.all([
        _application(), // 应用程序
        _menus()        // 菜单
    ])
}