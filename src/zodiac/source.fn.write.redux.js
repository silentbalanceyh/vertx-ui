import __Zn from "zone";
import {StateIn} from "zme";

const writeTree = (reference, state, dft = null) => {
    const {fnOut} = reference.props;
    if (__Zn.isFunction(fnOut)) {
        const $state = state ? __Zn.clone(state) : state;
        const _fnModify = prefix => (field, value) => {
            if (field.startsWith(prefix)) {
                const key = `assist.${field.replace(/\./g, '_').replace(/assist_/g, '')}`;
                $state[key] = value;
                delete $state[field];
            }
        };
        __Zn.itObject(state, (field, value) => {
            /* Assist 节点专用改动 */
            _fnModify("assist")(field, value);
            /* Tabular 节点专用改动 */
            _fnModify("tabular")(field, value);
        }, true);
        __Zn.dgDebug($state, "触发 Redux 更新！");
        fnOut(new StateIn($state, dft));
    } else {
        __Zn.fxFatal(10003, reference);
    }
};
const writeClean = (reference, keys = []) => {
    const baseKeys = [
        "datum.data",       // datum数据处理问题
        "datum.menus",      // menus数据清除
        "datum.inited",     // inited初始化数据
        "assist",           // 辅助数据Assist
        "state.submitting", // 提交按钮状态（尤其重要）
    ].concat(keys);
    const state = {};
    baseKeys.forEach(key => state[key] = undefined);
    writeTree(reference, state, undefined);
};
const writeSubmit = (reference, loading = true) => {
    const state = {};
    state[`status.submitting`] = {loading};
    writeTree(reference, state);
    // FIX：解决双重提交的Bug，修改掉reference中的loading状态，保证非Redux也生效
    __Zn.of(reference).in({
        $loading: loading
    }).done()
    // reference.?etState({$loading: loading});
};
export default {
    writeSubmit,
    writeClean,
    writeTree,
}