import Ux from 'ux';
/*
 * ComplexList -> IxTable
 * 因为选择结果在 Batch 中会使用
 */
const fnSelect = (reference) => ($selected) =>
    reference.setState({$selected: Ux.clone($selected)});
const fnQuery = (reference) => (query = {}) =>
    reference.setState({query: Ux.clone(query)});
const fnQueryMerge = (reference) => (input = {}) => {
    const {query = {}} = reference.state;
    /* 1. 提取 connector */
    let connector = "AND";
    if (input.hasOwnProperty("")) {
        connector = input[""] ? "AND" : "OR";
    }
    const merged = Ux.aiCriteria(query, input, connector);
    /* 2. 设置 */
    Ux.dgDebug(merged, "[Ex] ExComplexList 中的 Query 改动：");
    reference.setState({query: Ux.clone(merged)});
};
const fnInit = (reference) => (inited = {}, extra = {}) =>
    reference.setState({
        $inited: Ux.clone(inited),
        ...extra
    });
export default {
    fnSelect,
    fnQueryMerge,
    fnQuery,
    fnInit,
};