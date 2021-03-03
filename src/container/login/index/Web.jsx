import React from "react";
import Bg from "./image/bg.jpg";
import './Cab.less';
import {Col, Layout, Row} from "antd";

const {Header, Content} = Layout;

export default (reference, {
    // 容器专用变量
    component: Component,
    links = []
}) => (
    <Layout className={"ux-login-container"} style={{
        backgroundImage: `url(${Bg})`
    }}>
        <Header className={"header"}/>
        <Content className={"content"}>
            <Row>
                <Col xxl={8} xl={7} span={8}/>
                <Col xxl={8} xl={10} span={8}>
                    <Component {...reference.props} links={links}/>
                </Col>
                <Col xxl={8} xl={7} span={8}/>
            </Row>
        </Content>
    </Layout>
)