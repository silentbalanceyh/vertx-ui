import React from 'react';
import Ux from 'ux';
import Op from './Op';

import renderJsx from './Web.jsx';

/*
 * React属性props:
 * 1) 全局：$router, $menus, $app, $user
 * 2) 统一：config, data
 * 3) 函数：fnApp, fnCollapse, fnOut
 * 4) 风格：css
 * css =
 * {
 *      clsDropdown: "",
 *      clsAccount: "",
 *      clsAvatar: "",
 *      clsUser: ""
 * }
 * config =
 * {
 *      window:{
 *          logout
 *      }
 * }
 */
class Component extends React.PureComponent {
    render() {
        Ux.dgDebug(this.props, "[ ExAccount ]", "#c60");
        const $user = Ux.isLogged();
        const {css = {}} = this.props;
        return renderJsx(this, {
            $user,
            data: Op._1normalizeMenu(this),
            css,
        })
    }
}

export default Component;