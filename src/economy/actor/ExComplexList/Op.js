import Fx from '../Fx';
import U from 'underscore';

const _inUniform = (reference) => {
    const {options = {}} = reference.state;
    Object.freeze(options); // 不允许修改 options
    return {reference, $options: options};
};
const inAdd = (reference) => _inUniform(reference);
const inSearch = (reference) => _inUniform(reference);
const inExtra = (reference) => _inUniform(reference);
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
const inBatch = (reference) => {
    const inherit = _inUniform(reference);
    const {$selected = [], config = {}} = reference.state;
    inherit.$selected = $selected;

    _inheritFun(reference, inherit, 'fnSelect');
    _inheritFun(reference, inherit, 'fnLoading');
    _inheritFun(reference, inherit, 'fnRefresh');
    _inheritFun(reference, inherit, 'fnMock');

    inherit.fnBatchDelete = Fx.rxBatchDelete;
    inherit.fnBatchEdit = Fx.rxBatchEdit;
    if (config.hasOwnProperty('batch.editor')) {
        inherit.$editor = config['batch.editor']
    }
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