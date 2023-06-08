import React from 'react'
import {Col, Layout, Row} from 'antd'
import Ux from "ux";
import Ex from "ex";
import Sk from "skin";
import __ from './Cab.module.scss';
import imgBg from "./image/bg.jpg";
import imgLogo from "./image/logo.png";

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
        const {fnApp} = this.props;
        fnApp(error => this.setState({error}));
    }

    render() {
        const {component: Child, $app} = this.props;
        return (
            <Layout {...Sk.mix(__.hm_login, () => ({
                backgroundImage: `url(${imgBg})`
            }))}>
                <Header className="hm_header">
                    <Row>
                        <Col xl={10} xxl={10}>
                            <header>
                                <img src={imgLogo} alt={$app._("title")}/>
                                <h2>{$app._("title")}</h2>
                            </header>
                        </Col>
                        <Col span={8} xl={10} xxl={11}/>
                    </Row>
                </Header>
                <Content className={"content"}>
                    <Row>
                        <Col span={6} xl={7} xxl={6}/>
                        <Col span={12} xl={10} xxl={12}>
                            <Child {...this.props}/>
                        </Col>
                        <Col span={6} xl={7} xxl={6}/>
                    </Row>
                </Content>
            </Layout>
        )
    }
}

export default Component;
