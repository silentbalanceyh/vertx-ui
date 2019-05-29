import Ux from 'ux'

const fnCollapse = (reference) => () => {
    const {$_collapsed} = reference.state;
    reference.setState({$_collapsed: !$_collapsed})
};

const fnMenuData = (menu = [], app: any = {}) => {
    // 计算 style，修正缩进
    menu.forEach(item => {
        if (!item.style) item.style = {};
        if (!item.className) item.className = "ux-invert";
        item.itemClass = `node${item.level}`;
    });
    return Ux.Uarr.create(menu)
        .filter(item => "SIDEBAR" !== item.type)
        .sort((left, right) => left.left - right.left)
        .convert('uri', (uri) => `/${app._("path")}${uri}`)
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
        Ux.eraseTree(reference, []);
        // 切换页面清除连接点
        Ux.D.earsePointer();
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
const fnNavigator = (reference: any = {}) => {
    const {$menus, $router} = reference.props;
    let current = $menus.to().filter(menu => menu.uri &&
        0 < $router.path().indexOf(menu.uri));
    current = (current[0]) ? current[0].key : undefined;
    // 构造导航栏
    const navigator = Ux.elementBranch($menus.to(), current, "parentId");
    const $nav = [];
    $nav.push(Ux.fromHoc(reference, "nav"));
    if (navigator) {
        navigator.forEach(item => $nav.push({
            key: item.name,
            text: item.text,
            // 必须添加"/"前缀，否则会生成错误路由
            uri: (item.uri) ? "/" + Ux.Env['ROUTE'] + item.uri : undefined
        }))
    }
    return $nav;
};
export default {
    fnCollapse,
    fnNavigator,
    fnMenuData,
    fnLocation,
    fnUriMapping,
    fnRouting
}
