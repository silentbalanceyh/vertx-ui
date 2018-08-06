import Ux from 'ux'

const fnCollapse = (reference) => () => {
    const {$_collapsed} = reference.state;
    reference.setState({$_collapsed: !$_collapsed})
};

const fnMenuData = (menu = [], app: any = {}) => {
    return Ux.Uarr.create(menu)
        .filter(item => "SIDEBAR" !== item.type)
        .sort((left, right) => left.left - right.left)
        .convert('uri', (uri) => `/${app._("path")}${uri}`)
        .add('className', "kid-invert")
        .mapping({
            key: "key",
            level: "level",
            pid: "parentId",
            uri: "uri",
            text: "text",
            name: "name",
            icon: "icon",
            left: "left",
            className: "className"
        })
        .tree("key", "pid")
        .to();
};

const fnLocation = (reference: any = {}, prevProps: any = {}) => {
    const props = reference.props;
    const $router = props.$router;
    const $prevRouter = prevProps.$router;
    if ($router.path() !== $prevRouter.path()) {
        // 不相等时清一次数据节点
        Ux.writeTree(reference, {"datum.data": undefined});
    }
};

const fnUriMapping = (menus = []) => {
    const uris = {};
    menus.forEach(menu => {
        if (menu.key && menu.uri) {
            uris[menu.key] = menu.uri;
        }
    });
    return uris;
};

const fnRouting = (reference, uris = {}) => ({item, key, keyPath}) => {
    if (uris.hasOwnProperty(key)) {
        const {$router, $app} = reference.props;
        // 处理路由专用临时方法
        $router.to("/" + $app._('path') + uris[key]);
    }
};

export default {
    fnCollapse,
    fnMenuData,
    fnLocation,
    fnUriMapping,
    fnRouting
}
