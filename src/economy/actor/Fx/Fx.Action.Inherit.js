/*
 * ComplexList -> IxTable
 * 因为选择结果在 Batch 中会使用
 */
const fnSelect = (reference) => ($selected) => reference.setState({$selected});
const fnQuery = (reference) => (query = {}) => reference.setState({query});
export default {
    fnSelect,
    fnQuery
}