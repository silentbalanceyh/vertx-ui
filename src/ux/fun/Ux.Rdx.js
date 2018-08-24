import Immutable from "immutable";
import E from "../Ux.Error";
import U from "underscore";
import Prop from "../prop/Ux.Prop";
import State from '../prop/Ux.State';
import Dialog from "../Ux.Dialog";

const rdxSubmitting = (reference, loading = true) => {
    const state = {};
    state[`status.submitting`] = {loading};
    const $state = Immutable.fromJS(state).toJS();
    State.writeTree(reference, $state);
};
const rdxReject = (message) => Promise.reject({data: {info: message}});
/**
 * 专写方法，更新list.items
 * @param reference
 * @param values
 */
const rdxListItem = (reference, values = {}) => {
    const {fnListItem} = reference.props;
    E.fxTerminal(!fnListItem, 10087, fnListItem);
    if (U.isFunction(fnListItem)) {
        const ref = Prop.onReference(reference, 1);
        if (ref) {
            const {$inited = {}} = ref.props;
            fnListItem($inited.key, values);
        }
    }
};
const rdxClear = (reference) => {
    const {fnClear} = reference.props;
    E.fxTerminal(!fnClear, 10086, fnClear);
    if (U.isFunction(fnClear)) {
        fnClear()
    }
};
const rdxClose = (reference) => {
    rdxClear(reference);
    Dialog.closeWindow(reference);
};
export default {
    // 防重复提交专用方法，写status.submitting节点
    rdxSubmitting,
    // 返回Promise的reject结果
    rdxReject,
    // 更新特殊节点list.items，调用fnListItem方法
    rdxListItem,
    // 清除editKey，调用fnClear方法
    rdxClear,
    // 关闭窗口专用，调用fnClose方法
    rdxClose,
}