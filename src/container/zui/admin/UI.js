import './Cab.less';
import React from "react";
// -- Defined
import Ux from 'ux';
import Op from './Op';
import {Layout} from 'antd'
import Types from './Act.Types';
// -- Sider Bar
import SiderBar from './UI.Sider'
import GlobalHeader from './UI.Header'

const {zero} = Ux;
const {Content} = Layout;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .loading("app", "menus")
    .op("collapse", Op.fnCollapse)
    .connect(state => Ux.dataIn(state)
        .rework({datum: ["menus"]})
        .revamp(["app", "user"])
        .to())
    .connect({
        fnInited: Types.fnInited,
        fnOut: Ux.fnOut,
    }, true)
    .state({
        $_collapsed: true
    })
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        // 登陆控制（框架专用）
        Ux.isAuthorized(this);
        // 加载应用程序配置（App和Hotel）
        this.props.fnInited();
    }

    componentDidUpdate(prevProps) {
        Op.fnLocation(this, prevProps);
    }

    render() {
        const {$op = {}} = this.state;
        const {component: Component} = this.props;
        return (
            <Layout>
                <SiderBar {...Ux.toEffect(this.state)}
                          {...Ux.toProp(this.props, 'app', 'router', 'menus')} />
                <Layout>
                    <GlobalHeader fnCollapse={$op.collapse(this)}
                                  {...Ux.toEffect(this.state)}
                                  {...Ux.toProp(this.props, 'router', 'user')} />
                    <Content>
                        <Component {...Ux.toProp(this.props, "app", "user", "router", "hotel")} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Component;
