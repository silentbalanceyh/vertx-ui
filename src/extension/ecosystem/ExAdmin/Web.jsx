import {Badge, Icon, Layout, Popover} from "antd";
import Header from "./UI.Header";
import React from "react";

import ExNavigation from '../ExNavigation/UI';
import ExSider from '../ExSider/UI';
import ExLogged from "../ExLogged/UI";
import './Cab.less';

const {Content} = Layout;

export default {
    renderTpl: (ref, {
        // 容器专用变量
        children,
        // 配置
        siders,
        headers,
        navigations
    }) => (
        <Layout className={"ux-layout"}>
            <ExSider css={
                {
                    clsSider: "ux-sider",
                    clsSiderExpand: "ux-sider-expand"
                }
            } {...siders}/>
            <Layout>
                <Header {...headers}/>
                <Content className={"ux-content"}>
                    <ExNavigation {...navigations} css={
                        {
                            clsNav: "ux-navigation",
                            clsBreadcrumb: "breadcrumb",
                        }
                    }/>
                    {children}
                </Content>
            </Layout>
        </Layout>
    ),
    renderHeader: (ref, {
        accounts,
        icon,
        fnCollapse
    }) => (
        <Header className="ux-header" id={"__ELE_HEADER"}>
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
    ),
    renderNotify: (ref) => (
        <Popover placement="bottomRight" trigger="click" popupClassName="notify-popover"
                 allowPointAtCenter>
            {/** 提醒菜单专用 **/}
            <span className="action notify-notice-button">
            <Badge count={10}>
                <Icon type="bell" className="notify-icon"/>
            </Badge>
        </span>
        </Popover>
    )
}