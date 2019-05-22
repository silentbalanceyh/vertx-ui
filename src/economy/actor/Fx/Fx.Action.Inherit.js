import Ux from 'ux';
/*
 * ComplexList -> IxTable
 * 因为选择结果在 Batch 中会使用
 */
const fnSelect = (reference) => ($selected) =>
    reference.setState({$selected: Ux.clone($selected)});
const fnQuery = (reference) => (query = {}) =>
    reference.setState({query: Ux.clone(query)});
const fnInit = (reference) => (inited = {}, extra = {}) =>
    reference.setState({
        $inited: Ux.clone(inited),
        ...extra
    });
export default {
    fnSelect,
    fnQuery,
    fnInit,
};