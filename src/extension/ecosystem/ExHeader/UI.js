import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Layout} from "antd";
import ExLogged from "../ExLogged/UI";

const UCA_NAME = "ExHeader";
const {Header} = Layout;

/*
 * React属性props:
 * 1) 全局：$router, $menus, $app, $user
 * 2) 统一：config, data
 * 3) 函数：fnApp, fnCollapse, fnOut
 * 4) 风格：css
 * css =
 * {
 * }
 * config =
 * {
 *      banner:
 *      icon
 * }
 */
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, fnCollapse} = this.props;
            const window = Ux.fromHoc(this, 'window');
            const accounts = Ex.yoTplAccount(this, {
                window
            });
            const icon = config.icon;
            return (
                <Header className="ux-header" id={"__ELE_HEADER"}>
                    {Ux.v4Icon(icon, {
                        className: "trigger",
                        onClick: fnCollapse
                    })}
                    <div className="right">
                        {/** 用户信息 **/}
                        <ExLogged {...accounts}
                                  css={{
                                      clsDropdown: "menu-item",
                                      clsAccount: "action account",
                                      clsAvatar: "avatar",
                                      clsUser: "name"
                                  }}/>
                    </div>
                </Header>
            );
        }, Ex.parserOfColor(UCA_NAME).private());
    }
}

export default Component