import __Zn from './zero.module.dependency';
import Session from './store.c.session';
import Storage from './store.c.storage';

const isLogged = () => {
    const key = __Zn.Env.KEY_USER;
    let userData = Session.get(key);
    if (!userData) userData = {};
    return userData;
};
const isInit = () => {
    const key = __Zn.Env.KEY_APP;
    let appData = Storage.get(key);
    if (!appData) appData = {};
    return appData;
};

const isMod = (moduleKey) => {
    if (!moduleKey) {
        return {};
    }
    const app = isInit();
    // 提取所有 Object 类型
    const result = app[moduleKey];
    return __Zn.valueSTDN(result);
}
export default {
    isMod,
    isInit,
    isLogged,
}