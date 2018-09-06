import './Cab.less';
import React from "react";
// -- Defined
import Ux from 'ux';
import Op from './Op';
import {Layout} from 'antd'
import {PagerHeader} from "web";
import Types from './Act.Types';
// -- Sider Bar
import SiderBar from './UI.Sider'
import GlobalHeader from './UI.Header'

const {zero} = Ux;
const {Content} = Layout;

const buildNavs = (reference = {}) => {
    const {$menus, $router} = reference.props;
    let current = $menus.to().filter(menu => menu.uri &&
        0 < $router.path().indexOf(menu.uri));
    current = (current[0]) ? current[0].key : undefined;
    // 构造导航栏
    let navigator = Ux.elementBranch($menus.to(), current, "parentId");
    let $nav = [];
    $nav.push(Ux.fromHoc(reference, "nav"));
    if (navigator) {
        navigator = navigator.sort((left, right) => left.level - right.level);
        navigator.forEach(item => $nav.push({
            key: item.name,
            text: item.text,
            // 必须添加"/"前缀，否则会生成错误路由
            uri: (item.uri) ? "/" + Ux.Env['ROUTE'] + item.uri : undefined
        }));
    }
    return $nav;
};

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
        $_collapsed: false
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
                        <div className={"page-header"}>
                            <PagerHeader {...Ux.toProp(this.props, 'router')} $navs={buildNavs(this)}/>
                        </div>
                        <Component {...Ux.toProp(this.props, "app", "user", "router", "hotel")} />
                    </Content>
                </Layout>
                {Ux.D.renderTool(this)}
            </Layout>
        )
    }
}

export default Component;
