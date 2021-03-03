import React from 'react';
import Op from './Op';
import Ux from 'ux';
import {Layout} from "antd";
import {OpsHeader} from "app";
import LeftSider from './UI.Sider';
import Navigation from './UI.Nav';
import '../Cab.less';

const {Content} = Layout;

class Component extends React.PureComponent {
    state = {
        $collapsed: true, // 默认将菜单收起来
    }

    componentDidMount() {
        Op.yiLayout(this)
    }

    render() {
        const {children} = this.props;
        return (
            <Layout className={"ux-layout"}>
                {(() => {
                    const attrs = {};
                    attrs.$nav = true;
                    /* 当前节点处理生效 */
                    attrs.reference = this;
                    return (
                        <OpsHeader {...this.props} {...attrs}/>
                    )
                })()}
                <Layout>
                    {(() => {
                        const {$identifier} = this.state;
                        const attrs = {};
                        attrs.$identifier = $identifier;
                        attrs.reference = this;
                        return (
                            <LeftSider {...this.props} {...attrs} />
                        )
                    })()}
                    {(() => {
                        const {$identifier, $navTop, $navLeft, $navSource = []} = this.state;
                        const attrs = {};
                        attrs.$identifier = $identifier;
                        attrs.$source = $navSource;
                        attrs.reference = this;
                        /*
                         * $navLeft 重算
                         */
                        const data = {top: $navTop};
                        if ($navLeft) {
                            data.left = $navLeft;
                        } else {
                            if (0 < $navSource.length) {
                                const pid = Ux.toQuery("pid");
                                const found = Ux.elementUnique($navSource, 'key', pid);
                                if (found) {
                                    data.left = found;
                                }
                            }
                        }
                        attrs.data = data;
                        const {$collapsed = false} = this.state;
                        const style = {}
                        if ($collapsed) {
                            style.marginLeft = 60;
                        } else {
                            style.marginLeft = 160;
                        }
                        style.height = Ux.toHeight(0);
                        return (
                            <Content className={"ux-content ops-content"} style={style}>
                                <Navigation {...this.props} {...attrs}/>
                                <div className={"ops-page"} style={{
                                    minHeight: Ux.toHeight(48)
                                }}>
                                    {children}
                                </div>
                            </Content>
                        )
                    })()}
                </Layout>
            </Layout>
        )
    }
}

export default Component