import React from 'react';
import Ux from 'ux';
import Ex from "ex";

import Rdr from './Web';

/**
 * ## 「组件」`ExLogged`
 *
 * ```js
 * import { ExLogged } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 *
 * 1. 全局：$router, $menus, $app, $user
 * 2. 统一：config, data
 * 3. 函数：fnApp, fnCollapse, fnOut
 * 4. 风格：css
 *
 * css =
 *
 * ```js
 * {
 *      clsDropdown: "",
 *      clsAccount: "",
 *      clsAvatar: "",
 *      clsUser: ""
 * }
 * ```
 *
 * config =
 *
 * ```js
 * {
 *      window:{
 *          logout
 *      }
 * }
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExLogged
 */
const UCA_NAME = "ExLogged";
const renderAction = (reference, params) => {
    const {$menus} = reference.props;
    const menus = Ex.toArray($menus);
    return (
        <div className={"action-bar"}>
            {Rdr.renderCode(reference, menus)}
            {Rdr.renderMessage(reference, menus)}
            {Rdr.renderSetting(reference, menus, params)}
            {Rdr.renderHelp(reference, menus)}
        </div>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => {
            const $user = Ux.isLogged();
            const {css = {}} = this.props;
            /*
             * 菜单操作
             */
            const {
                data = [], $app,
            } = this.props;
            // 拷贝不更改原始菜单
            const $data = Ux.clone(data)
                .filter(item => Ux.Env.MENU_TYPE.TOP === item.type)
                .map(item => Ex.mapMeta(item))
                .map(item => Ex.mapUri(item, $app));
            const params = {};
            params.$user = $user;
            params.$data = $data;
            params.css = css;
            return (
                <div className={"ex-logged"}>
                    {Rdr.renderAccount(this, params)}
                    {renderAction(this, params)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;