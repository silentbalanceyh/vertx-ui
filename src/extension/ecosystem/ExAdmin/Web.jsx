import {Layout} from "antd";
import Header from "./UI.Header";
import React from "react";

import ExNavigation from '../ExNavigation/UI';
import ExSider from '../ExSider/UI';

import './Cab.less';

const {Content} = Layout;

export default (ref, {
    // 容器专用变量
    children,
    // 配置
    siders,
    headers,
    navigations
}) => (
    <Layout className={"ux-layout"}>
        <ExSider {...siders} css={
            {
                clsSider: "ux-sider",
                clsSiderExpand: "ux-sider-expand"
            }
        }/>
        <Layout>
            <Header {...headers}/>
            <Content>
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
)