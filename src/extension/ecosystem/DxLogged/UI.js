import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {Input, Tooltip} from "antd";

const UCA_NAME = "DxLogged";

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

const renderLogout = (reference) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <Tooltip title={info.logout}>
            {Ux.v4Icon("logout", {
                className: "icon-top",
                onClick: event => {
                    Ux.prevent(event)
                    const {config: {window: {logout}}} = reference.props;
                    const $config = Ex.toDialog(logout);
                    $config.onOk = () => Ex.Op.$opLogout(reference);
                    const md = Ux.v4Modal()
                    md.confirm($config);
                }
            })}
        </Tooltip>
    );
}

const renderBack = (reference) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <Tooltip title={info.home}>
            {Ux.v4Icon("home", {
                className: "icon-top",
                onClick: event => {
                    Ux.prevent(event)
                    // 进入应用中心
                    Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
                }
            })}
        </Tooltip>
    );
}

const renderCommand = (reference) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <div className={"search-top"}>
            <Input.Search placeholder={info.search}/>
        </div>
    )
}

const renderAction = (reference) => {
    const {$menus} = reference.props;
    return (
        <div className={"action-bar"}>
            {renderLogout(reference, $menus.to())}
            {renderBack(reference, $menus.to())}
            {renderCommand(reference)}
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
            /*
             * 菜单操作
             */
            return (
                <div className={"dx-logged"}>
                    {renderAction(this)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;