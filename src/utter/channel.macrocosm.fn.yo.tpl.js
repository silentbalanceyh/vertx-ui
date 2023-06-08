import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';

const __yoLocation = (menu = {}, $router) => {
    // 1. 阶段1，如果没有 menu.uri 直接跳过
    if (!menu.uri) {
        return false;
    }
    // 2. 阶段2
    // - 带有 ?部分，
    // - 不带 ?部分
    if (0 <= menu.uri.indexOf("?")) {
        const path = menu.uri.split("?")[0];
        if (0 < $router.path().indexOf(path)) {
            const uriKv = menu.uri.split("?")[1];
            const menuKv = Ux.kvQuery(uriKv);
            const rKv = $router.params();
            // 每一个 key 值都存在
            const keys = Object.keys(menuKv);
            const matched = [];
            keys.forEach(key => {
                if (menuKv[key] === rKv[key]) {
                    matched.push(true);
                }
            })
            return matched.length === keys.length;
        } else return false;
    } else {
        return 0 < $router.path().indexOf(menu.uri);
    }
}
const yoTplHeader = (reference, {
    banner,
}) => {
    const attrs = yoAmbient(reference);
    /*
     * 配置
     */
    const state = reference.state;
    const {$collapsed = false} = state;
    attrs.config = {
        banner,
        icon: $collapsed ? 'menu-unfold' : 'menu-fold'
    };
    /*
     * 函数继承
     */
    attrs.fnCollapse = () => {
        const {$collapsed = false} = state;
        Ux.of(reference).in({
            $collapsed: !$collapsed
        }).done()
        // reference.?etState({$collapsed: !$collapsed});
    };
    return attrs;
}
const yoTplSider = (reference) => {
    const attrs = yoAmbient(reference);
    /*
     * 数据
     */
    const {rxMenuFilter = () => true} = reference.props;
    const {$menus} = reference.props;
    attrs.data = Ux.toArray($menus)        // X_MENU 菜单信息
        .filter(rxMenuFilter)
        .sort((left, right) => left.order - right.order);
    /*
     * 配置
     */
    const {$collapsed = false} = reference.state;
    attrs.config = {$collapsed};
    /*
     * Logo默认设置
     */
    const {$logo, $logoCss, css, $router} = reference.props;
    if ($logo) attrs.$logo = $logo;
    if ($logoCss) attrs.$logoCss = $logoCss;
    if (css) attrs.css = css;
    /*
     * 动态计算菜单选中效果（左侧导航栏）
     */
    const selectedList = Ux.toArray($menus)        // X_MENU 菜单信息
        .filter(rxMenuFilter)
        .filter(menu => __yoLocation(menu, $router));
    attrs.$selected = selectedList.map(item => item.key);
    return attrs;
}

const yoTplNavigation = (reference = {}, {
    homepage,
    extra,
}) => {
    const attrs = yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus, $router} = reference.props;
    const source = Ux.toArray($menus);
    const {rxMenuFilter = () => true} = reference.props;
    attrs.data = source      // X_MENU 菜单信息// 特殊类型（导航栏）
        .filter(rxMenuFilter)
        .filter(menu => __yoLocation(menu, $router));
    /*
     * 配置
     */
    attrs.config = {
        homepage,
        extra
    };
    attrs.source = Ux.clone(source);
    return attrs;
};
const yoTplAccount = (reference = {}, {
    window
}) => {
    const attrs = yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus} = reference.props;
    attrs.data = Ux.toArray($menus)        // X_MENU 菜单信息
        .filter(menu => Ux.Env.MENU_TYPE.TOP === menu.type)
        .sort((left, right) => left.order - right.order);
    /*
     * 配置
     */
    attrs.config = {
        window
    };
    return attrs;
};
export default {
    yoTplSider,
    yoTplAccount,
    yoTplHeader,
    yoTplNavigation
}