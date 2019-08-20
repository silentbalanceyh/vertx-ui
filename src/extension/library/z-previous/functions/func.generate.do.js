import U from "underscore";
import G from "../../functions/global/datum";

const _consume = (reference, fnName) => (args) => {
    if (reference) {
        if (U.isString(fnName) && fnName.startsWith('fn')) {
            /* 参数规范化 */
            args = (args && U.isArray(args)) ? args : [];
            /* 优先从 props 中读取 函数 */
            let fun = reference.props[fnName];
            if (U.isFunction(fun)) {
                return fun.apply(this, [].concat(args));
            } else {
                /* 没找到的情况，直接从 state 中读取 */
                fun = G.state(reference)[fnName];
                if (U.isFunction(fun)) {
                    return fun.apply(this, [].concat(args));
                } else {
                    throw new Error(`[ Ex ] ${fnName} 函数出错！`);
                }
            }
        } else {
            throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `fn` 前缀！");
        }
    } else {
        throw new Error("[ Ex ] 空 reference 引用！");
    }
};
export default (reference) => ({
    /* 更新过滤条件 $filters 处理，该函数更新默认的 $query 信息 */
    query: (filters = {}) => _consume(reference, 'fnQuery')([filters]),
    /* 更新列过滤条件 $condition，在列过滤的时候才使用 */
    condition: (condition = {}, terms = {}) => _consume(reference, 'fnCondition')([condition, terms]),
    /* 列处理方法，读取全列 / 或者我的列 */
    column: (full = true) => (full) ? _consume(reference, 'fnColumn')([]) : _consume(reference, 'fnColumnMy')([]),
    /* 表格中的多选选中专用 */
    selected: (selected = []) => _consume(reference, 'fnSelect')([selected]),

    /* 单条记录初始化 */
    open: (key, data = {}) => _consume(reference, 'fnOpen')([key, data]),
    /* 搜索专用方法  */
    search: (params) => _consume(reference, 'fnSearch')([params]),
    /* 删除专用方法 */
    delete: (key) => _consume(reference, 'fnDelete')([key]),
    /* 读取数据专用 */
    detail: (key) => _consume(reference, 'fnDetail')([key]),
    // ------------ 内置组件专用方法 ------------
    loading: () => _consume(reference, 'fnLoading')([]),
    loaded: () => _consume(reference, 'fnLoaded')([]),
    submitting: () => _consume(reference, 'fnSubmitting')([]),
    submitted: () => _consume(reference, 'fnSubmitted')([]),
    close: (data = {}) => _consume(reference, 'fnClose')([data]),
    synced: () => _consume(reference, 'fnSynced')([]),
    dirty: () => _consume(reference, 'fnDirty')([])
})