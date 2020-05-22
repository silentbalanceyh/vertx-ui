import React from 'react'
import './Cab.less';
import Bg from './image/bg.jpg';
import {Col, Layout, Row} from 'antd'
import Ux from "ux";
import Ex from "ex";

const {Header, Content} = Layout;

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .loading("app")
    .connect(state => Ux.dataIn(state)
        .revamp(["app"])
        .to()
    )
    .connect({
        fnApp: Ex.epicApp
    }, true)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        this.props.fnApp(error => this.setState({error}));
    }

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
