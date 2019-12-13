import Fn from "../../functions";
import Ux from 'ux';

const updateInternal = (reference, prevState, consumer) => {
    /*
     * 先检查 props 中的 $query 变化
     */
    const state = Ux.clone(reference.state);
    const current = state['$dirtyAsync'];
    const original = prevState['$dirtyAsync'];
    /*
     * 防止 $loading 一旦改变就更新
     */
    if (original !== current) {
        Ux.dgDebug({
            $dirty: current
        }, "[ ExU ] $dirtyAsync 标记出现，重新同步数据：Sync....");
        /*
         * 内置更新
         */
        if (state.$loading) {
            const {$query = {}} = Ux.clone(reference.state);
            Ux.toLoading(() => Fn.rx(reference).search($query)
                .then($data => consumer($data)));
        }
    }
};

export default (reference, virtualRef) => {
    const {$dirtyAsync = false} = reference.props;
    const prevState = virtualRef.state;
    if ($dirtyAsync) {
        /*
         * 修改内部状态双变量
         * $dirty = true
         * $loading = true （效果）
         */
        Fn.rsLoading(reference)();
    } else {
        updateInternal(reference, prevState, ($data => {
            /*
             * 修改内部状态双变量
             * $dirty = false
             * $loading = false
             */
            Fn.rsLoading(reference, false)({$data});
        }));
    }
}