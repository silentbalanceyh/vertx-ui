import Ux from "ux";

const _1normalizeNavs = (reference = {}) => {
    const {$menus, $router, config = {}} = reference.props;
    let current = $menus.to().filter(menu => menu.uri &&
        0 < $router.path().indexOf(menu.uri));
    current = (current[0]) ? current[0].key : undefined;
    // 构造导航栏
    let navigator = Ux.elementBranch($menus.to(), current, "parentId");
    let $nav = [];
    // 配置中读取主页
    const {homepage} = config;
    if (homepage) {
        $nav.push(homepage);
    }
    if (navigator) {
        navigator = navigator.sort((left, right) => left.level - right.level);
        navigator.forEach(item => $nav.push({
            key: item.name,
            text: item.text,
            // 必须添加"/"前缀，否则会生成错误路由
            uri: (item.uri && "EXPAND" !== item.uri) ? "/" + Ux.Env['ROUTE'] + item.uri : undefined
        }));
    }
    return $nav;
};

export default {
    _1normalizeNavs
}