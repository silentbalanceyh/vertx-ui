import React from 'react'
import './Cab.less';
import Bg from './image/bg.jpg';
import {Col, Layout, Row} from 'antd'
import Ux from 'ux';
import {OpsHeader} from 'app';

const {Content} = Layout;

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {component: Component} = this.props;
        return (
            <Layout className={"login"} style={{
                backgroundImage: `url(${Bg})`
            }}>
                <OpsHeader {...this.props} />
                <Content className={"login-content"}>
                    <Row>
                        <Col xxl={2} span={3}/>
                        <Col xxl={10} span={10} className={"range"}>
                            <Component {...this.props}/>
                        </Col>
                        <Col xxl={12} span={11}/>
                    </Row>
                </Content>
            </Layout>
        )
    }
}

export default Component;
