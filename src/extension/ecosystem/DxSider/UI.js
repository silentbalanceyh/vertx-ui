import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import renderJsx from './Web.jsx';
import Op from './Op';

const UCA_NAME = "DxSider";
/**
 * ## 「组件」`DxSider`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 * 1. 全局：$router, $menus, $app, $user
 * 2. 统一：config, data
 * 3. 函数：fnApp, fnOut
 * 4. 风格：css
 *
 * css =
 *
 * ```json
 * {
 *      clsSider: "",
 *      clsSiderExpand: ""
 * }
 * ```
 *
 * config =
 *
 * ```js
 * {
 *      $collapsed,
 *      $theme
 * }
 * ```
 *
 * @memberOf module:uca/extension
 * @method *DxSider
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = Ux.toHeightState(0);
    const {data = []} = reference.props;
    Ux.toPid(reference, data, state);
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: false
    };

    componentDidMount() {
        window.addEventListener("resize", Ux.rxResize(this));
        /*
         * 第一次初始化
         */
        componentInit(this);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", Ux.rxResize(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$app, data = [], config = {}, css = {}} = this.props;
            /*
             * 基本配置
             */
            const {
                $collapsed = true,
            } = config;
            const dataUri = {};
            data.forEach(menu => {
                if (menu.key && menu.uri) {
                    dataUri[menu.key] = menu.uri;
                }
            });
            let {
                clsSider,
                clsSiderExpand = "dx-sider-expand"
            } = css;
            if (clsSider) {
                clsSider = `dx-sider ${clsSider}`;
            } else {
                clsSider = `dx-sider`
            }
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
            $attrsMenu.onClick = Op.onClick(this, dataUri);
            $attrsMenu.style = {padding: '16px 0px', width: '100%'};
            const {$heightStyle = {}} = this.state;
            if (!Ux.isEmpty($heightStyle)) {
                Object.assign($attrsMenu, $heightStyle);
            }
            /*
             * 特殊注入
             */
            // $attrsMenu.childClass = `icon ${$collapsed}` ? `collapse` : "";

            /*
             * Menu-Item计算
             */
            const dataArray = Ux.Uarr.create(data)
                .map(item => Ex.mapUri(item, $app))
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
        }, Ex.parserOfColor(UCA_NAME).private())
    }
}

export default Component;