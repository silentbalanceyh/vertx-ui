import Fn from "../../functions";
import Ux from 'ux';
import Yi from '../yi';

const updateInternal = (reference, prevState, consumer) => {
    /*
     * 先检查 props 中的 $query 变化
     */
    const state = Ux.clone(reference.state);
    const current = state['$dirty'];
    const original = prevState['$dirty'];
    /*
     * 防止 $loading 一旦改变就更新
     */
    if (original !== current) {
        if (current) {
            Ux.dgDebug({
                $dirty: current
            }, "[ ExU ] $dirty 标记出现，重新同步数据：Sync....");
            /*
             * 内置更新
             */
            if (state.$loading) {
                const {$query = {}} = Ux.clone(reference.state);
                Ux.toLoading(() => Fn.rx(reference).search($query)
                    .then($data => Yi.yiColumn(reference, reference.state, $data)))
                    .then(done => consumer(done))
            }
        }
    }
};

export default (reference, virtualRef) => {
    const {$dirty = false} = reference.props;
    const prevState = virtualRef.state;
    if ($dirty) {
        /*
         * 侦测到上层 Dirty（外置 Reload）
         * 将外部改成 $dirty = false
         */
        Fn.rx(reference).dirty(false);
        /*
         * 修改内部状态双变量
         * $dirty = true
         * $loading = true （效果）
         */
        Fn.rsLoading(reference)({$dirty: true});
    } else {
        updateInternal(reference, prevState, ((state = {}) => {
            const {$data, $lazy} = state;
            /*
             * 修改内部状态双变量
             * $dirty = false
             * $loading = false
             */
            Fn.rsLoading(reference, false)({$data, $lazy, $dirty: false});
        }));
    }
}