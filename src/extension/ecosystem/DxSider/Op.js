import Ux from "ux";
/*
 * 解决 onClick 点击事件的切换问题
 */
const onClick = (reference, uris = {}) => ({item, key, keyPath}) => {
    // 如何维持菜单状态？
    if (uris.hasOwnProperty(key)) {
        const {$router, $app} = reference.props;
        // 路由先从 $app 中读取，其次走 环境变量（配置优先）
        let path = $app._("path");
        if (!path) {
            path = Ux.Env['ROUTE'];
        }
        // 没有以 / 开头，需要修正
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        path = `${path}${uris[key]}`;
        // page 核心参数，处理 page
        if (0 > path.indexOf("pid=")) {
            if (0 <= path.indexOf("?")) {
                path += `&pid=${key}`;
            } else {
                path += `?pid=${key}`;
            }
        }
        $router.to(path);
    }
};
export default {
    onClick,
}