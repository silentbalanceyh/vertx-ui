import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import renderJsx from './Web.jsx';
import Op from './Op';

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
        const dataUri = {};
        data.forEach(menu => {
            if (menu.key && menu.uri) {
                dataUri[menu.key] = menu.uri;
            }
        });
        const {
            clsSider = "ux-sider",
            clsSiderExpand = "ux-sider-expand"
        } = css;
        /*
         * Sider属性计算
         */
        const $attrsSider = {};
        $attrsSider.trigger = null;
        $attrsSider.collapsible = true;
        $attrsSider.collapsed = $collapsed;
        $attrsSider.className = $collapsed ?
            clsSider : `${clsSider} ${clsSiderExpand}`;
        /*
         * Menu属性计算
         */
        const $attrsMenu = {};
        $attrsMenu.key = "mSider";
        $attrsMenu.mode = "inline";
        $attrsMenu.theme = $theme;
        $attrsMenu.onClick = Op.onClick(this, dataUri);
        $attrsMenu.style = {padding: '16px 0px', width: '100%'};
        /*
         * 特殊注入
         */
        // $attrsMenu.childClass = `icon ${$collapsed}` ? `collapse` : "";

        /*
         * Menu-Item计算
         */
        const dataArray = Ux.Uarr.create(data)
            .map(item => Ex.mapUri(item, $app))
            .add("className", "ux-invert")
            .tree({sort: "order"})
            .to();
        return renderJsx(this, {
            $attrsMenu,
            $attrsSider,
            /*
             * 菜单种类
             * 1. 左边菜单：SIDE-MENU
             * 2. 导航菜单：NAV-MENU
             * 3. 顶部菜单：TOP-MENU
             * 4. 右键菜单：CONTEXT-MENU
             */
            dataArray,
            $app,
        })
    }
}

export default Component;