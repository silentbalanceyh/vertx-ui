import React from 'react';
import {Spin} from 'antd';
import './Cab.less';
import Op from "./Op";
import Ux from 'ux';

class Component extends React.PureComponent {
    graph = null;
    state = {
        $ready: false
    }

    componentDidMount() {
        Op.yiPage(this);
    }

    componentWillUnmount() {
        const {$gEvent} = this.props;
        if ($gEvent) {
            $gEvent.resizeOn(true)
        }
    }

    render() {
        const {
            $gEvent,
        } = this.props;
        /* 编辑器配置 */
        const container = $gEvent.id();
        const style = $gEvent.css();
        /* 读取状态 */
        const {$ready = false} = this.state;
        return (
            <Spin spinning={!$ready}>
                <div className={"web-g6-viewer"}>
                    <div className={"content"}>
                        <div className={"panel"}>
                            <div id={container.toolbar} className={"toolbar"} style={style.toolbar}>
                                {$ready ? Ux.x6UiToolbar(this, $gEvent) : false}
                            </div>
                            <div id={container.graph} className={"x6-graph"}/>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default Component;