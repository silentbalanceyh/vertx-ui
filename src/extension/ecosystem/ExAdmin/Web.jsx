import {Badge, Icon, Layout, Popover} from "antd";
import React from "react";

import ExNavigation from '../ExNavigation/UI';
import ExSider from '../ExSider/UI';
import ExHeader from "./UI.Header";
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
                <ExHeader {...headers}/>
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