import Fn from '../../functions';
import Ux from "ux";

export default (reference, virtualRef) => {
    /*
     * 先检查 props 中的 $query 变化
     */
    const prevProps = virtualRef.props;
    const props = reference.props;
    /*
     * 默认的 $query 改变
     */
    const $defaultChecked = Fn.upValue(props, prevProps, '$query');
    if ($defaultChecked) {
        /*
         * 外层组件引起内置组件的变更，修改默认的 query
         * 1）这种情况不执行请求发送
         * 2）直接更新：
         *    从：props -> $query
         *    到：state -> $query
         */
        const $query = $defaultChecked.current;
        /*
         * 分支1：
         * 1）props 中的 $query 变化引起 state 中的 $query 变化
         * 2）$loading = true
         * Q 为 4 态对象
         */
        Fn.rsLoading(reference)({$query});
    } else {
        /*
         * 状态变更
         */
        const prevState = virtualRef.state;
        const state = reference.state;
        /*
         * 检查状态中的 query
         */
        const checked = Fn.upQuery(state, prevState);
        if (checked) {
            const {current = {}} = checked;
            /*
             * 只有 $loading = true 的时候执行
             */
            if (state.$loading) {
                Ux.toLoading(() => Fn.rx(reference).search(current)
                    .then($data => {
                        /*
                         * 设置当前组件的加载
                         * ( ExTable )
                         */
                        Fn.rsLoading(reference, false)({$data});
                    })
                );
            }
        } else {
            Ux.dgDebug(state.$query, "[ ExU ] $query 未改变，不刷新！", "#6E8B3D");
        }
    }
}