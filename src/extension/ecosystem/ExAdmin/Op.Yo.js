import Ex from "ex";

const yoSider = (reference = {}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus} = Ex.props(reference);
    attrs.data = Ex.array($menus)        // X_MENU 菜单信息
        .filter(menu => "SIDE-MENU" === menu.type)
        .sort((left, right) => left.order - right.order);
    /*
     * 配置
     */
    const {$collapsed = false} = Ex.state(reference);
    attrs.config = {$collapsed};
    return attrs;
};
const yoNavigation = (reference = {}, {
    homepage
}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 数据
     */
    const {$menus, $router} = Ex.props(reference);
    attrs.data = Ex.array($menus)        // X_MENU 菜单信息
        .filter(menu => menu.uri && 0 < $router.path().indexOf(menu.uri));
    /*
     * 配置
     */
    attrs.config = {
        homepage
    };
    return attrs;
};
const yoHeader = (reference = {}, {
    banner,
}) => {
    const attrs = Ex.yoAmbient(reference);
    /*
     * 配置
     */
    const state = Ex.state(reference);
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
    const {$menus} = Ex.props(reference);
    attrs.data = Ex.array($menus)        // X_MENU 菜单信息
        .filter(menu => "TOP-MENU" === menu.type)
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