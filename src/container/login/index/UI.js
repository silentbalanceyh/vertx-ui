import React from 'react'
import './Cab.less';
import Bg from './image/bg.jpg';
import {Col, Layout, Row} from 'antd'

const {Header, Content} = Layout;

class Component extends React.PureComponent {

    render() {
        const {component: Component} = this.props;
        return (
            <Layout className={"login"} style={{
                backgroundImage: `url(${Bg})`
            }}>
                <Header className={"login-header"}/>
                <Content className={"login-content"}>
                    <Row>
                        <Col xxl={8} xl={7} span={8}/>
                        <Col xxl={8} xl={10} span={8}>
                            <Component {...this.props}/>
                        </Col>
                        <Col xxl={8} xl={7} span={8}/>
                    </Row>
                </Content>
            </Layout>
        )
    }
}

export default Component;
