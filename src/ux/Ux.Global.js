import Store from './Ux.Store';
import Env from './Ux.Env';

const isLogged = () => {
    const key = Env.KEY_USER;
    return Store.Session.get(key);
};
const isInit = () => {
    const key = Env.KEY_APP;
    return Store.Storage.get(key);
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
