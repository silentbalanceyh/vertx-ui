import Ux from 'ux';
import Ex from 'ex';

export default (reference, state = {}) => {
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