import Ux from 'ux';
import Fn from '../../functions';
/* ExSider 属性继承 */
const yoSider = (reference, addOn = {}) => {
    const {$menus} = reference.props;
    const {$_collapsed} = reference.state;

    const attrs = Ux.toProp(reference.props,
        'app',      // 应用程序 X_APP 信息
        'router',   // 路由信息 react-router
        'menus',    // X_MENU 菜单信息
        'fnOut'     // fnOut 函数处理
    );
    attrs.config = {
        // 附加配置
        ...addOn,
        collapsed: $_collapsed,
    }; // 配置 config
    attrs.data = Fn.toArray($menus);    // X_MENU 菜单信息
    return attrs;
};
/* ExNavigation 属性继承 */
const yoNavigation = (reference, addOn = {}) => {
    const attrs = Ux.toProp(reference.props,
        'router',   // 路由信息 react-router
        'menus'     // X_MENU 菜单信息
    );
    const homepage = Ux.fromHoc(reference, "nav");
    attrs.config = {
        ...addOn,
        homepage
    };
    return attrs;
};
const yoComponent = (reference) => Ux.toProp(reference.props,
    'app',
    'user',
    'router',
    'hotel'     // Fixed for old system
);
const yoHeader = (reference) => {
    const headers = Ux.toProp(reference.props,
        'app',
        'router',
        'user',
        'menus'
    );
    const effect = Ux.toEffect(reference.state);
    const {$_collapsed} = reference.state;
    Object.assign(headers, effect);
    const info = Ux.fromHoc(reference, "info");
    headers.config = {
        banner: info,
        icon: $_collapsed ? 'menu-unfold' : 'menu-fold'
    };
    return headers;
};
const yoAccount = (reference) => {
    const {$menus} = reference.props;
    const accounts = Ux.toProp(reference.props,
        'user',
        'app',
        'router'
    );
    const {$hoc} = reference.state ? reference.state : {};
    if ($hoc) {
        accounts.data = Fn.toArray($menus);    // X_MENU 菜单信息
        accounts.config = {
            window: $hoc._('window')
        }
    }
    return accounts;
};
export default {
    yoSider,
    yoNavigation,
    yoComponent,
    yoHeader,
    yoAccount
}