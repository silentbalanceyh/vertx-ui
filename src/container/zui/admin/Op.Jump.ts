import Ux from 'ux';

const fnLogout = (reference, key = "") => {
    Ux.aiConfirm(reference, () => {
        // 清掉Session
        Ux.toLogout();
        // 路由处理
        Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
        // 清楚State上的数据
        Ux.writeTree(reference, {
            "datum.hotel": undefined,
            "datum.menus": undefined,
            "user": undefined
        })
    }, "window", key);
};

const _dispatch = {
    "key.menu.logout": fnLogout
};

const fnSelect = (reference) => (event) => (_dispatch[event.key]) ?
    _dispatch[event.key](reference, event.key) : () => {
    };
export default {
    fnSelect
}
