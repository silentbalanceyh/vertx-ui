import {Layout} from "antd";
import Header from "./UI.Header";
import Ux from "ux";
import React from "react";

import ExNavigation from '../ExNavigation/UI';
import ExSider from '../ExSider/UI';

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
                clsSider: "ox-sider",
                clsSiderExpand: "ox-sider-expand"
            }
        }/>
        <Layout>
            <Header {...headers}/>
            <Content>
                <ExNavigation {...navigations} css={
                    {
                        clsNav: "ox-navigation",
                        clsBreadcrumb: "breadcrumb",
                    }
                }/>
                {children}
            </Content>
        </Layout>
        {Ux.D.renderTool(ref)}
    </Layout>
)