import React from 'react';
import {Spin} from 'antd';
import './Cab.less';
import Ux from 'ux';

/**
 * ## 「组件」`G6Viewer`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |$gEvent||props|GEvent|图综合对象。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * @memberOf module:web-component
 * @method G6Viewer
 **/

// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    return Ux.promise(state).then(processed => {
        const {$gEvent} = reference.props;
        $gEvent.initialize();
        const graph = $gEvent.g6Graph();

        const {
            data = {
                nodes: [],
                edges: []
            }
        } = reference.props;
        graph.fromJSON(data);
        // 开启重置
        $gEvent.resizeOn();

        processed.$ready = true;
        reference.setState(state);
    })
}

class Component extends React.PureComponent {
    graph = null;
    state = {
        $ready: false
    }

    componentDidMount() {
        componentInit(this);
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