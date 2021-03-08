import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {G6Viewer} from "web";
import {Spin} from 'antd';

/**
 * ## 「组件」`ExGraphicViewer`
 *
 * ```js
 * import { ExGraphicViewer } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method ExGraphicViewer
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference, state = {}) => {
    const {data = {}} = reference.props;
    /* 数据节点 */
    if (data) {
        const {$gEvent} = state;
        const {
            rxGraphInit = () => Ux.promise({nodes: [], edges: []}),
        } = reference.props;
        return rxGraphInit($gEvent).then($data => {
            state.$data = $data;
            {
                // 构造 on 系列方法
                const gxFun = {};
                /**
                 * 验证关系专用处理
                 */
                gxFun.onReset = Ex.X6.onReset(reference, $data);
                gxFun.onNodeRemovable = () => false;
                gxFun.onEdgeRemovable = () => false;
                // 连接完成后的处理
                Object.assign(state, gxFun);
            }

            return Ux.promise(state);
        })
    } else {
        throw new Error("（Viewer）当前组件要求必须传入 data 属性！")
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicViewer")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ux.g6PageInit(this, componentInit);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.g6PageUp(this,
            {props: prevProps, state: prevState}, componentInit);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $gEvent, $data = {},
                $submitting = false,
            } = this.state;
            const inherit = Ex.yoAmbient(this);
            inherit.$gEvent = $gEvent;
            inherit.data = $data;

            const info = Ux.fromHoc(this, "info");
            return (
                <div className={"drawer-background"}>
                    <Spin spinning={$submitting} tip={info.loading}>
                        <G6Viewer {...inherit}/>
                        {Ux.x6UiDialog(this, {
                            supplier: Ex.yoDynamic
                        })}
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("ExGraphicViewer").component())
    }
}

/*
 * 直接根据配置项数据构造拓扑图
 */
export default Component;