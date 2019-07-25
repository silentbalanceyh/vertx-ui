import Ux from "ux";
import Ex from 'ex';

const _1normalizeUri = (data = []) => {
    const uris = {};
    data.forEach(menu => {
        if (menu.key && menu.uri) {
            uris[menu.key] = menu.uri;
        }
    });
    return uris;
};
/*
 * 菜单种类
 * 1. 左边菜单：SIDE-MENU
 * 2. 导航菜单：NAV-MENU
 * 3. 顶部菜单：TOP-MENU
 * 4. 右键菜单：CONTEXT-MENU
 */
const _1normalizeMenu = (data = [], app = {}) => {
    data = Ux.clone(data).map(item => Ex.mapUri(item, app));
    return Ux.Uarr.create(data)
        .add('className', "ux-invert")
        .mapping({
            key: "key",
            level: "level",
            pid: "parentId",
            uri: "uri",
            disabled: "disabled",
            text: "text",
            name: "name",
            icon: "icon",
            left: "left",
            className: "className"
        })
        .tree("key", "pid")
        .to();
};

const _2fnRouting = (reference, uris = {}) => ({item, key, keyPath}) => {
    // 如何维持菜单状态？
    if (uris.hasOwnProperty(key)) {
        const {$router, $app} = reference.props;
        // 路由先从 $app 中读取，其次走 环境变量（配置优先）
        let path = $app._("path");
        if (!path) {
            path = Ux.Env['ROUTE'];
        }
        $router.to("/" + path + uris[key]);
    }
};
export default {
    _1normalizeUri,
    _1normalizeMenu,
    _2fnRouting,
}