import Store from './Ux.Store';
import Env from './Ux.Env';

const isLogged = () => {
    const key = Env.KEY_USER;
    let userData = Store.Session.get(key);
    if (!userData) userData = {};
    return userData;
};
const isInit = () => {
    const key = Env.KEY_APP;
    let appData = Store.Storage.get(key);
    if (!appData) appData = {};
    return appData;
};

const toLogout = () => {
    const key = Env.KEY_USER;
    return Store.Session.remove(key);
};
const isAuthorized = (reference) => {
    const {$router} = reference.props;
    if (!isLogged()) {
        $router.to(Env.ENTRY_LOGIN);
    }
};

export default {
    // 是否登录
    isLogged,
    // 是否初始化应用
    isInit,
    // 登陆控制
    isAuthorized,
    // 注销
    toLogout
}
