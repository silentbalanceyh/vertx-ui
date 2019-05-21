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
const inBatch = (reference) => {
    const inherit = _inUniform(reference);
    const {$selected = []} = reference.state;
    inherit.$selected = $selected;
    return inherit;
};
const inTable = (reference) => {
    const inherit = _inUniform(reference);
    const {rxSearch} = reference.props;
    if (U.isFunction(rxSearch)) {
        const {query = {}, config = {}, $selected = []} = reference.state;
        inherit.$query = query;
        inherit.$table = config.table;
        inherit.$selected = $selected;
        // 函数区域
        inherit.fnSelect = Fx.fnSelect(reference);
        inherit.fnSearch = rxSearch;
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
}