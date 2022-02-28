import Ex from "ex";
import Ux from "ux";

const yoSider = (reference = {}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 数据
     */
    const {rxMenuFilter = () => true} = reference.props;
    const {$menus} = reference.props;
    attrs.data = Ex.toArray($menus)        // X_MENU 菜单信息
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
    const {$logo, $logoCss, css} = reference.props;
    if ($logo) attrs.$logo = $logo;
    if ($logoCss) attrs.$logoCss = $logoCss;
    if (css) attrs.css = css;
    return attrs;
};
const yoNavigation = (reference = {}, {
    homepage
}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus, $router} = reference.props;
    const source = Ex.toArray($menus);
    const {rxMenuFilter = () => true} = reference.props;
    attrs.data = source      // X_MENU 菜单信息// 特殊类型（导航栏）
        .filter(rxMenuFilter)
        .filter(menu => {
            // calculate path
            if (menu.uri) {
                let path;
                if (0 <= menu.uri.indexOf("?")) {
                    path = menu.uri.split("?")[0];
                } else {
                    path = menu.uri;
                }
                return 0 < $router.path().indexOf(path);
            } else return false;
        });
    /*
     * 配置
     */
    attrs.config = {
        homepage
    };
    attrs.source = Ux.clone(source);
    attrs.extra = "Zero Framework - Development Toolbox";
    return attrs;
};
const yoHeader = (reference = {}, {
    banner,
}) => {
    const attrs = Ex.yoAmbient(reference);
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
        reference.setState({$collapsed: !$collapsed});
    };
    return attrs;
};
const yoAccount = (reference = {}, {
    window
}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus} = reference.props;
    attrs.data = Ex.toArray($menus)        // X_MENU 菜单信息
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
    yoSider,
    yoNavigation,
    yoHeader,
    yoAccount,
}