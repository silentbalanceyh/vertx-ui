import {Icon, Layout} from "antd";
import React from "react";
import ExLogged from '../ExLogged/UI';

const {Header} = Layout;

export default (ref, {
    accounts,
    icon,
    fnCollapse
}) => (
    <Header className="ux-header">
        <Icon className="trigger"
              type={icon}
              onClick={fnCollapse}
        />
        <div className="right">
            {/** 用户信息 **/}
            <ExLogged {...accounts} css={
                {
                    clsDropdown: "menu-item",
                    clsAccount: "action account",
                    clsAvatar: "avatar",
                    clsUser: "name"
                }
            }/>
        </div>
    </Header>
)