import React from 'react';
import Ux from 'ux';

import renderJsx from './Web.jsx';
import Ex from "ex";

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
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => {
            const $user = Ux.isLogged();
            const {css = {}} = this.props;
            /*
             * 菜单操作
             */
            const {data = [], $app} = this.props;
            const $data = data
                .map(item => Ex.mapMeta(item))
                .map(item => Ex.mapUri(item, $app));
            return renderJsx(this, {
                $user,
                $data,
                css,
            })
        }, Ex.parserOfColor("ExLogged").component())
    }
}

export default Component;