import React from 'react';
import {Col, Layout, Menu, Row} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Logo from './image/logo.png'
import Op from './Op';
import OpsLogged from '../OpsLogged/UI';
import './Cab.less';

const {Header} = Layout

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .connect(state => Ux.dataIn(state)
        .revamp(["user"])
        .rinit(["user"])
        .to()
    )
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {props: prevProps, state: prevState})
    }

    render() {
        const config = Ux.fromHoc(this, "config");
        const {login = [], logged = [], title} = config;
        const {$nav = false} = this.props;
        const {$module} = this.state;
        let $selectedKeys = $module ? [$module] : []
        return (
            <Header className={$nav ? "login-header login-home" : "login-header"}>
                <Row>
                    <Col span={3} className={"op-logo"}>
                        <img src={Logo} alt={"Logo"} style={{width: 28, height: 28}}/>
                        <span className={"text"}>{title}</span>
                    </Col>
                    <Col span={18} className={"op-menu"}>
                        {$nav ? (() => (
                            <Menu mode={"horizontal"} theme={"dark"}
                                  selectedKeys={$selectedKeys}
                                  onSelect={Op.onSelected(this)}>
                                {(() => {
                                    const {$menus = []} = this.state;
                                    return $menus.map(each => (
                                        <Menu.Item key={each.key} data={each}>
                                            <span>{each.text}</span>
                                        </Menu.Item>
                                    ));
                                })()}
                            </Menu>
                        ))() : false}
                    </Col>
                    <Col span={3} className={"op-bar"}>
                        {(() => {
                            const {$logged = false} = this.state;
                            const data = {};
                            data.login = login;
                            /* 登录后链接专用处理 */
                            logged.filter(item => "lnkHome" === item.key).forEach(each => {
                                const {$router} = this.props;
                                const path = $router.path();
                                if (path.endsWith("/main/index")) {
                                    each.uri = "/login/form";
                                } else {
                                    each.uri = "/main/index";
                                }
                            })
                            data.logged = logged;
                            return (
                                <OpsLogged {...Ex.yoAmbient(this)}
                                           $logged={$logged} data={data}/>
                            )
                        })()}
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default Component