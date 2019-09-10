import Abs from '../abyss';
import {Dsl} from "entity";
import U from 'underscore';
import E from '../error';

/**
 * 将数据会写状态树，props中需要包含`fnOut`函数
 * @method writeTree
 * @param reference React对应组件引用 React.PureComponent
 * @param state 写入的状态数据
 * @param dft 默认值
 */
const writeTree = (reference, state, dft = null) => {
    const {fnOut} = reference.props;
    if (U.isFunction(fnOut)) {
        const $state = state ? Abs.clone(state) : state;
        const _fnModify = prefix => (field, value) => {
            if (field.startsWith(prefix)) {
                const key = `assist.${field.replace(/\./g, '_').replace(/assist_/g, '')}`;
                $state[key] = value;
                delete $state[field];
            }
        };
        Abs.itObject(state, (field, value) => {
            /* Assist 节点专用改动 */
            _fnModify("assist")(field, value);
            /* Tabular 节点专用改动 */
            _fnModify("tabular")(field, value);
        }, true);
        fnOut(Dsl.createIn($state, dft));
    } else {
        E.fxFatal(10003, reference);
    }
};
// ComplexList专用节点，旧节点
// "grid.list",
// "grid.query",
// TreeList专用节点
// "grid.tree",
// "tree.selected",
const writeClean = (reference, keys = []) => {
    const baseKeys = [
        "datum.data",       // datum数据处理问题
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
    reference.setState({$loading: loading});
};
export default {
    /* 提交书写 */
    writeSubmit,
    /* 写树统一方法 */
    writeTree,
    /* 清空树统一方法 */
    writeClean
}