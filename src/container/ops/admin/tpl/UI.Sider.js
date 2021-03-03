import React from 'react';
import {Layout, Spin} from "antd";
import '../Cab.less'
import Op from './Op';
import Ux from 'ux';
import Ex from "ex";

const {Sider} = Layout;

class Component extends React.PureComponent {
    state = {
        $ready: false
    }

    componentDidMount() {
        Op.yiSider(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuSider(this, {props: prevProps, state: prevState})
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = [], $loading = true} = this.state;
            /*
             * siderAttrs
             */
            const siderAttrs = {
                theme: "dark",
                width: 160,
                collapsedWidth: 60,
                style: {
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                },
                className: "ops-sider",
                collapsible: true,
                onCollapse: (collapsed, type) => {
                    const ref = Ux.onReference(this, 1);
                    if (ref) {
                        ref.setState({$collapsed: collapsed})
                    }
                }
            }
            const {$keySet = {}} = this.state;
            return (
                <Sider {...siderAttrs}>
                    <Spin spinning={$loading} style={{
                        paddingTop: 60
                    }}>
                        {Ux.aiSider($data, {
                            ...$keySet,
                            theme: "dark",
                            className: "ops-sider-menu",
                            mode: "inline",
                            onClick: Op.rxMenu(this)
                        })}
                    </Spin>
                </Sider>
            )
        }, Ex.parserOfColor("ExSider").private())
    }
}

export default Component