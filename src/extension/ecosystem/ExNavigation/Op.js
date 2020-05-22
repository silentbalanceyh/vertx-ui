import Ux from "ux";

const _1normalizeNavs = (reference = {}) => {
    const {data = [], source = [], config: {homepage}} = reference.props;
    // 配置中读取主页
    let $nav = [];
    if (homepage) {
        $nav.push(homepage);
    }
    let current = (data[0]) ? data[0].key : undefined;
    // 构造导航栏
    let navigator = Ux.elementBranch(source, current, "parentId");
    if (navigator) {
        navigator = navigator.sort((left, right) => left.level - right.level);
        navigator.forEach(item => $nav.push({
            key: item.name ? item.name : Ux.randomUUID(),
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