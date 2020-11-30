import React from 'react';
import './Cab.less';
import Op from './Op';
import renderTool from './Web.Toolbar';
import {Spin} from 'antd';

class Component extends React.PureComponent {
    graph = null;
    state = {
        $ready: false,       // 初始化状态
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    componentWillUnmount() {
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
                <div className={"web-g6-editor"}>
                    <div className={"content"}>
                        <div id={container.stencil} className={"sider"} style={style.stencil}/>
                        <div className={"panel"}>
                            <div id={container.toolbar} className={"toolbar"} style={style.toolbar}>
                                {$ready ? renderTool(this) : false}
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