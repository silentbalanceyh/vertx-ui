import Ux from 'ux';
import Ex from 'ex';

export default (reference, state = {}) => {
    const {data = {}} = reference.props;
    if (data) {
        const {$gEvent} = state;
        const {
            rxGraphInit = () => Ux.promise({nodes: [], edges: []}),
        } = reference.props;
        return rxGraphInit($gEvent).then($data => {
            state.$data = $data;
            {
                // 构造 on系列方法
                const gxFun = {};
                /**
                 * 三个核心函数
                 * 1. onNodeInitBefore / onEdgeInitBefore：这两个函数不可使用状态内部函数
                 *    它们的触发生命周期位于第一个流程中，此时构造 $gEvent 对象的组件中
                 *    state 还没执行任何初始化动作，所以不可能在执行时初始化
                 * 2. onSubmit 提交函数，不同的提交内容不一样，所以此处提交必须走内部
                 */
                gxFun.onNodeRemovable = Ex.X6.onNodeRemovable(reference, data);

                // 窗口专用函数
                gxFun.onWindowClose = Ex.X6.onWindowClose(reference);
                gxFun.onWindowSubmit = Ex.X6.onWindowSubmit(reference);

                // 连接专用
                gxFun.onEdgeConnectedAfter = Ex.X6.onEdgeConnectedAfter(reference);
                // gxFun.onEdgeConnectedBefore = Ex.X6.onEdgeConnectedBefore(reference, data);

                // 重置专用函数
                gxFun.onReset = Ex.X6.onReset(reference, $data);

                // 计算被 Ko 的节点集
                gxFun.onNodeFilter = Ex.X6.rxNodeFilter(reference);

                // 连接完成后的处理
                Object.assign(state, gxFun);
            }
            /*
             * 提交必须要使用
             */
            return Ux.promise(state);
        });
    } else {
        throw new Error("（Editor）当前组件要求必须传入 data 属性！！")
    }
}