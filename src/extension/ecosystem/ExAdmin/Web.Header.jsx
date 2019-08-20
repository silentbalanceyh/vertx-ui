import {Icon, Layout} from "antd";
import Notify from "./UI.Notify";
import React from "react";
import ExAccount from '../ExAccount/UI';

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
            {/** 提醒菜单 **/}
            <Notify/>
            {/** 用户信息 **/}
            <ExAccount {...accounts} css={
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