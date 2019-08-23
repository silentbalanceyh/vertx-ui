import React from 'react'
import Ux from "ux";
import Op from './Op';
import renderJsx from './Web.jsx';

/*
 * React属性props:
 * 1) 全局：$router, $menus, $app, $user
 * 2) 统一：config, data
 * 3) 函数：fnApp, fnOut
 * 4) 风格：css
 * css =
 * {
 *      clsSider: "",
 *      clsSiderExpand: ""
 * }
 * config =
 * {
 *      $collapsed,
 *      $theme
 * }
 */
class Component extends React.PureComponent {
    render() {
        Ux.dgDebug(this.props, "[ ExSider ]", "#c60");
        const {$app, data = [], config = {}, css = {}} = this.props;
        /*
         * 基本配置
         */
        const {
            $collapsed = true,
            $theme = "dark"
        } = config;
        return renderJsx(this, {
            $collapsed,
            $theme,
            dataUri: Op._1normalizeUri(data),
            dataArray: Op._1normalizeMenu(data, $app),
            $app,
            css,
        })
    }
}

export default Component;