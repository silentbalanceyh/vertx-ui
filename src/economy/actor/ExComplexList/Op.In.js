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
/*
 * 统一处理函数
 */
const _inUniform = (reference) => {
    const {options = {}} = reference.state;
    /* 不可变更 */
    Object.freeze(options); // 不允许修改 options
    return {reference, $options: options};
};
const inOpen = (reference) => {
    const inherit = _inUniform(reference);
    const {$cond} = reference.state;
    if ($cond) {
        // 条件对象专用（ $cond 引用 IxTable 中的条件）
        inherit.$cond = $cond;
    }
    _inheritFun(reference, inherit, 'fnCondition');
    return inherit;
};
const inSearch = (reference) => {
    const inherit = _inUniform(reference);
    // 更改 query
    _inheritFun(reference, inherit, 'fnCondition');
    _inheritFun(reference, inherit, 'fnQueryMerge');
    const {FormFilter} = reference.props;
    if (FormFilter) {
        inherit.FormFilter = FormFilter;
    }
    const {query = {}} = reference.state;
    inherit.$query = query;   // 拷贝则只提供镜像
    return inherit;
};

const inExtra = (reference, item = {}) => {
    const inherit = _inUniform(reference);

    _inheritComponent(reference, inherit);
    // 列处理（更改列、导出都需要）
    Fx.inheritProjection(reference, inherit);
    // 由于要知道原始列信息
    const {config = {}} = reference.state;
    inherit.$table = config.table;
    _inheritFun(reference, inherit, 'fnLoading');
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
    Fx.inheritProjection(reference, inherit);

    _inheritComponent(reference, inherit);
    // Mock环境才会使用
    Fx.Mock.mockInherit(reference, inherit);
    return inherit;
};
const inFormAdd = (reference, item = {}) => {
    const inherit = _inUniform(reference);
    inherit.fnMock = Fx.Mock.mockRecord(reference);
    // 处理 Loading
    _inheritFun(reference, inherit, 'fnLoading');
    // 处理 Refresh
    _inheritFun(reference, inherit, 'fnRefresh');
    // 特殊函数，只在子表单提交中使用
    inherit.fnSubmitting = ($submitting = true) =>
        reference.setState({$submitting});
    // 回调函数注入
    inherit.fnClose = Fx.rxCloseTab(reference, item.key);
    inherit.fnView = Fx.rxSwitchView(reference, item);
    inherit.$addKey = item.key;
    return inherit;
};
const inFormEdit = (reference, item = {}) => {
    const inherit = _inUniform(reference);
    // 必须走更新流程
    inherit.fnMock = Fx.Mock.mockRecord(reference, true);
    // 处理 Loading
    _inheritFun(reference, inherit, 'fnLoading');
    // 处理 Refresh
    _inheritFun(reference, inherit, 'fnRefresh');
    // 特殊函数，只在子表单提交中使用
    inherit.fnSubmitting = ($submitting = true) =>
        reference.setState({$submitting});
    // 回调函数注入
    inherit.fnClose = Fx.rxCloseTab(reference, item.key);
    const {$inited = {}} = reference.state;
    inherit.$inited = $inited;
    return inherit;
};
const inTable = (reference) => {
    const inherit = _inUniform(reference);
    const {rxSearch} = reference.props;
    if (U.isFunction(rxSearch)) {
        const {query = {}, config = {}, $selected = []} = reference.state;
        // 参数专用
        inherit.$query = query;   // 拷贝则只提供镜像
        inherit.$table = config.table;
        inherit.$selected = $selected;
        // 列处理（更改列、导出都需要）
        Fx.inheritProjection(reference, inherit);
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
const inBar = (reference, $tabs = {}) => {
    const inherit = _inUniform(reference);
    const {$submitting = false, view = "list"} = reference.state;
    inherit.$loading = $submitting;
    inherit.$activeKey = $tabs.activeKey;
    inherit.$view = view;

    _inheritFun(reference, inherit, 'fnLoading');
    _inheritFun(reference, inherit, 'fnRefresh');
    _inheritFun(reference, inherit, 'fnMock');

    inherit.fnSubmitting = ($submitting = true) =>
        reference.setState({$submitting});
    // 回调函数注入
    inherit.fnClose = Fx.rxCloseTab(reference, $tabs.activeKey);

    Fx.Mock.mockInherit(reference, inherit);
    return inherit;
};
export default {
    inOpen,
    inBatch,
    inSearch,
    inExtra,
    inTable,
    inBar,  // 外层按钮
    inFormAdd,
    inFormEdit,
};