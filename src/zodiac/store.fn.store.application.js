import __Zn from './zero.module.dependency';
import _Storage from './store.c.storage';
import _Session from './store.c.session';

const Cv = __Zn.Env;

const storeApp = (data, isKey = false) => {
    if (data) {
        const fnPut = _Storage.put;
        const fnPutDirect = _Storage.putDirect;
        // 合并逻辑
        let appData = _Storage.get(Cv.KEY_APP);
        appData = __Zn.clone(appData ? appData : {})
        if (appData) {
            Object.assign(appData, data);
        }
        /*
         * 统一处理
         */
        if (isKey) {
            // 内置页
            if (appData.appKey) fnPutDirect(Cv.X_APP_KEY, data.appKey);
            fnPut(Cv.KEY_APP, appData);
            fnPutDirect(Cv.X_APP_ID, appData.key);
            fnPutDirect(Cv.X_SIGMA, appData.sigma);
        } else {
            // 外置页（登录界面，移除appKey）
            if (appData.appKey) {
                const fnRemove = _Storage.remove;
                fnRemove(Cv.X_APP_KEY);
                delete appData.appKey;
            }
            fnPut(Cv.KEY_APP, appData);
            fnPutDirect(Cv.X_APP_ID, appData.key);
            fnPutDirect(Cv.X_SIGMA, appData.sigma);
        }
        __Zn.dgDebug(data, "更新应用程序配置数据！", "#00CDCD");
    }
    return data;
};
const storeUser = (data) => {
    if (data) {
        const key = Cv.KEY_USER;
        _Session.put(key, data);
    }
    return data;
};
const storeModule = (data, configKey) => {
    if (data && configKey) {
        const app = _Storage.get(Cv.KEY_APP);
        if (app) {
            const dataRef = app[configKey];
            if (dataRef) {
                Object.assign(dataRef, data);
            }
            app[configKey] = dataRef;
            __Zn.dgDebug({
                key: configKey,
                data,
            }, "刷新模块配置数据！", "#00CDCD");
            storeApp(app, true);
        }
    }
    return data;
}
export default {
    storeApp,
    storeUser,
    storeModule,
}