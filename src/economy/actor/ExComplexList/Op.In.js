import Fx from '../Fx';
import U from 'underscore';
import Ux from 'ux';
/*
 * 函数注入函数
 */
const _inheritFun = (reference, inherit = {}, name) => {
    let fun = reference.state[name];
    if (U.isFunction(fun)) {
        inherit[name] = fun;
    } else {
        const hocFun = Fx[name];
        if (U.isFunction(hocFun)) {
            fun = hocFun(reference);
            if (U.isFunction(fun)) {
                inherit[name] = fun;
            }
        }
    }
};

const _inheritComponent = (reference, inherit = {}) => {
    const {config = {}} = reference.state;
    if (config.component) {
        inherit.$componentConfig = Ux.clone(config.component);
        /* 不可变更 */
        Object.freeze(inherit.$componentConfig);
    }
};

const _inFilter = (projection = []) => item => {
    if (0 === projection.length) {
        /* 没有任何projection的情况，无权限 */
        return true;
    } else {
        /* 有内容 */
        const items = projection.map(each => each.key);
        items.push('key');  // 操作行
        const $projection = Ux.immutable(items);
        return $projection.contains(item.dataIndex);
    }
};

const _inProjection = (reference, inherit = {}) => {
    const {projection = [], projectionCurrent = []} = reference.state;
    /* 基本列过滤，直接使用 projection 生成列过滤函数 */
    inherit.fnFilterColumn = _inFilter(projection);
    /* 同时将 projection 继承传递 */
    inherit.fnFilterView = _inFilter(projectionCurrent);
    /* 修改函数 */
    inherit.fnSaveView = (views = []) => {
        const state = Fx.etatProjection(reference, views);
        reference.setState(state)
    };
};
/*
 * 统一处理函数
 */
const _inUniform = (reference) => {
    const {options = {}} = reference.state;
    /* 不可变更 */
    Object.freeze(options); // 不允许修改 options
    return {reference, $options: options};
};
const inAdd = (reference) => _inUniform(reference);
const inSearch = (reference) => _inUniform(reference);

const inExtra = (reference) => {
    const inherit = _inUniform(reference);

    _inheritComponent(reference, inherit);
    // 列处理（更改列、导出都需要）
    _inProjection(reference, inherit);
    // 由于要知道原始列信息
    const {config = {}} = reference.state;
    inherit.$table = config.table;
    // Mock环境才会使用
    Fx.Mock.mockInherit(reference, inherit);
    return inherit;
};
const inBatch = (reference) => {
    const inherit = _inUniform(reference);
    const {$selected = []} = reference.state;
    inherit.$selected = $selected;

    _inheritFun(reference, inherit, 'fnSelect');
    _inheritFun(reference, inherit, 'fnLoading');
    _inheritFun(reference, inherit, 'fnRefresh');
    _inheritFun(reference, inherit, 'fnMock');

    inherit.fnBatchDelete = Fx.rxBatchDelete;
    inherit.fnBatchEdit = Fx.rxBatchEdit;
    // 列处理，批量更新必须用
    _inProjection(reference, inherit);

    _inheritComponent(reference, inherit);
    // Mock环境才会使用
    Fx.Mock.mockInherit(reference, inherit);
    return inherit;
};
const inTable = (reference) => {
    const inherit = _inUniform(reference);
    const {rxSearch} = reference.props;
    if (U.isFunction(rxSearch)) {
        const {query = {}, config = {}, $selected = []} = reference.state;
        // 参数专用
        inherit.$query = query;
        inherit.$table = config.table;
        inherit.$selected = $selected;
        // 列处理（更改列、导出都需要）
        _inProjection(reference, inherit);
        // 函数区域
        inherit.fnSearch = rxSearch;
        _inheritFun(reference, inherit, 'fnSelect');
        _inheritFun(reference, inherit, 'fnQuery');
        _inheritFun(reference, inherit, 'fnInit');

        // Mock环境才会使用
        Fx.Mock.mockInherit(reference, inherit);

        return inherit;
    } else {
        throw new Error("[Ex] rxSearch 核心函数丢失！");
    }
};
export default {
    inAdd,
    inBatch,
    inSearch,
    inExtra,
    inTable
};