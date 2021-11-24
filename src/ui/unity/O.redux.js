import Abs from '../abyss';
import {Dsl} from "entity";
import U from 'underscore';
import E from '../error';
import Dev from '../develop';

/**
 * ## 「标准」`Ux.writeTree`
 *
 * Zero UI中和 redux 连接到一起的状态统一修改函数，主要修改节点为 `out` 根节点下的数据。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React组件。
 * @param {Object} state 被修改的状态信息。
 * @param {any} dft 状态默认值
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
        Dev.dgDebug($state, "触发 Redux 更新！");
        fnOut(Dsl.createIn($state, dft));
    } else {
        E.fxFatal(10003, reference);
    }
};
/**
 * ## 「标准」`Ux.writeClean`
 *
 * Zero UI 中的 redux 树的清除方法，用于清除该节点上的数据，该清除会清掉默认信息。
 *
 * * `datum.data`。
 * * `datum.menus`。
 * * `datum.inited`。
 * * `assist`。
 * * `state.submitting`.
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React组件。
 * @param {Array} keys 被清除的所有节点信息。
 */
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
/**
 * ## 「标准」`Ux.writeSubmit`
 *
 * Zero UI 中的 redux 树的防重复提交专用方法，用于检查 redux 引擎下的防重复提交。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React组件。
 * @param {boolean} loading 防重复提交专用状态值。
 */
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
    writeClean,
}