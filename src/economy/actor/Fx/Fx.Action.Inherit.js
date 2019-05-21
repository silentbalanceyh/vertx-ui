import Ux from 'ux';
/*
 * ComplexList -> IxTable
 * 因为选择结果在 Batch 中会使用
 */
const fnSelect = (reference) => ($selected) => reference.setState({$selected: Ux.clone($selected)});
const fnQuery = (reference) => (query = {}) => reference.setState({query: Ux.clone(query)});
export default {
    fnSelect,
    fnQuery
}