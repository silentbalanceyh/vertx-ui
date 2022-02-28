import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {Avatar, Dropdown, Icon, Modal, Spin, Tooltip} from "antd";
import './Cab.less';

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
 * @memberOf module:web-component
 * @method ExLogged
 */

const fnLogout = (reference) => {
    const {config: {window: {logout}}} = reference.props;
    const $config = Ex.toDialog(logout);
    $config.onOk = () => Ex.Op.$opLogout(reference);
    Modal.confirm($config);
};
const _DISPATCH = {
    fnLogout
};
const onSelect = (reference) => (event) => {
    const {data: {metadata = {}}} = event.item.props;
    const executor = _DISPATCH[metadata.function];
    if (Ux.isFunction(executor)) {
        executor(reference);
    }
};
const renderJsx = (reference, {
    $data,
    $user,
    css: {
        clsDropdown = "",
        clsAccount = "",
        clsAvatar = "",
        clsUser = "",
        clsMenu = ""
    }
}) => {
    if ($user) {
        return (
            <Dropdown overlay={Ux.aiMenuTop($data, {
                className: clsDropdown,
                onClick: onSelect(reference),
            })} className={clsMenu}>
                {/** 用户头像和名字，登陆后状态 **/}
                <span className={clsAccount}>
                <Avatar size="default" className={clsAvatar}
                        src={$user['logo'] ? $user['logo'] : "/img/zui/account/default.jpeg"}/>
                    <span className={clsUser}>{$user['realname'] ? $user['realname'] : $user['username']}</span>
                </span>
            </Dropdown>
        )
    } else {
        return (
            <Spin size="small" style={{marginLeft: 0}}/>
        )
    }
}

const renderCode = (reference, menu = []) => {
    const menuDev = menu.filter(item => "DEV-MENU" === item.type);
    if (0 < menuDev.length) {
        const info = Ux.fromHoc(reference, "info");
        return (
            <Tooltip title={info['develop']} placement={"bottom"}>
                <Icon type={"code"} className={"icon-top"}
                      onClick={event => {
                          Ux.prevent(event);
                          // 进入开发中心
                          Ux.toRoute(reference, "/development/index");
                      }}/>
            </Tooltip>
        )
    } else return false;
}


const renderMessage = (reference, menu = []) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <Tooltip title={info.message} placement={"bottom"}>
            <Icon type={"message"} className={"icon-top"}/>
        </Tooltip>
    )
}

const renderAction = (reference) => {
    const {$menus} = reference.props;
    return (
        <div className={"action-bar"}>
            {renderCode(reference, $menus.to())}
            {renderMessage(reference, $menus.to())}
        </div>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExLogged")
    .to()
)
class Component extends React.PureComponent {
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
            const $data = data
                .map(item => Ex.mapMeta(item))
                .map(item => Ex.mapUri(item, $app));
            return (
                <div className={"ex-logged"}>
                    {renderJsx(this, {
                        $user,
                        $data,
                        css,
                    })}
                    {renderAction(this)}
                </div>
            )
        }, Ex.parserOfColor("ExLogged").component())
    }
}

export default Component;