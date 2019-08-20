import Ux from "ux";
import Criteria from './Fx.Criteria';

/*
 * 专用处理查询条件
 * 1. inputQuery 入参中带了查询条件
 * 2. $query 当前组件的外围传入了查询条件
 * 3. $condition 在状态中触发了列更新
 */

const initQuery = (reference, inputQuery = {}) => {
    /* 1.直接使用 inputQuery 处理 */
    const defaultQuery = Ux.irGrid(inputQuery, reference);
    /* 2.如果当前 props 中包含了 $query */
    const {$query} = reference.props;
    let queryResult = defaultQuery;
    if ($query) {
        queryResult = Ux.aiCriteria(defaultQuery, $query);
    }
    return queryResult;
};
const initFilters = (reference, filters = {}) => {
    const queryRef = Ux.auiQuery(reference);
    // 读取原始条件
    const {$condition = {}} = reference.state ? reference.state : {};
    let criteria = Ux.clone($condition);
    if (filters) {
        Object.assign(criteria, filters);
    }
    // 调用 Update
    const condition = Criteria.update(reference, criteria);
    Ux.dgDebug(condition.normalized, "[OX] 重新合并后的条件：", "#366");
    return queryRef.criteria(condition.normalized);
};
export default {
    initQuery,
    initFilters
};