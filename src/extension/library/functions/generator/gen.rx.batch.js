import G from '../global';
import Cm from './gen.common';
import Fn from './gen.runtime.status';
import Ux from 'ux';
import Bs from '../business';
/*
 * 这里的 reference 是当前 ExComplexList
 */
const rxBatchDelete = (reference) => (event) => {
    Cm.prevent(event);
    const {$selected = [], options = {}} = G.state(reference);
    if (0 < $selected.length) {
        /* 当前组件中的状态设置成 $loading = true */
        Fn.rsLoading(reference)();
        const uri = options[G.Opt.AJAX_BATCH_DELETE_URI];
        /*
         * 参数提取
         */
        const message = options[G.Opt.MESSAGE_BATCH_DELETE];
        const {$selected = []} = reference.state;
        return Ux.ajaxDelete(uri, $selected)
            .then(Bs.cbTrue(() =>
                Fn.rsLoading(reference, false)({
                    $dirty: true
                }), message)
            );
    } else {
        throw new Error("[ Ex ] 选择项丢失！rxBatchDelete.");
    }
};
const rxBatchEdit = (reference) => (params = []) => {
    const {$selected = [], options = {}} = G.state(reference);
    if (0 < $selected.length) {
        /* 当前组件中状态设置成提交 */
        const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
        return Ux.ajaxPut(uri, params)
            .then(Bs.cbTrue(() => Fn.rsLoading(reference, false)({
                    $dirty: true,
                    $submitting: false,
                }))
            );
    } else {
        throw new Error("[ Ex ] 选择项丢失！rxBatchEdit.");
    }
};
export default {
    rxBatchDelete,
    rxBatchEdit,
}