import Ux from 'ux';
import U from 'underscore';
import Criteria from './Fx.Criteria';

const input = (reference, defaultQuery = {}) => {
    const {$query} = reference.props;
    const queryResult = {};
    if ($query) {
        /*
         * 属性中捕捉到 $query 变量，则直接针对 $query 和 defaultQuery 执行合并
         */
        queryResult["$PROP"] = Ux.clone($query);
        queryResult[""] = true;
        queryResult["$DFT"] = defaultQuery;
    } else {
        Object.assign(queryResult, defaultQuery);
    }
    return queryResult;
};
const search = (reference) => {
    if (reference) {
        const {fnSearch, $query = {}} = reference.props;
        if (U.isFunction(fnSearch)) {
            fnSearch($query).then(data => reference.setState({
                data,
                $loading: false // 和分页专用统一
            }));
        }
    }
};
const is = (reference, previous = {}) => {
    const {prevProps} = previous;
    const prevQuery = prevProps.$query;
    const curQuery = reference.props.$query;
    return Ux.isDiff(prevQuery, curQuery);
};
const onCondition = (queryRef, reference, queries) => {
    // 读取原始条件
    const {$condition = {}} = reference.state;
    // 是否传入 queries
    let criteria = Ux.clone($condition);
    if (queries) {
        Object.assign(criteria, queries);
    }
    // 调用 updateFilters处理
    const condition = Criteria.update(reference, $condition);
    Ux.dgDebug(condition.normalized, "[OX] 重新合并后的条件：", "#366");
    queryRef.criteria(condition.normalized);
};
const criteria = (reference) => (pagination, filters, sorter) => {
    const {current, pageSize} = pagination;
    const queryRef = Ux.auiQuery(reference);
    // 触发了分页操作
    if (current && pageSize) {
        /**
         * 分页信息
         * 1. current是当前页
         * 2. pageSize则是当前页的尺寸
         */
        queryRef.page(current).size(pageSize);
    }
    // 执行排序操作
    if (!Ux.isEmpty(sorter)) {
        const {field = "", order = "ascend"} = sorter;
        const isAsc = "ascend" === order;
        /**
         * 排序信息
         * 设置排序字段和排序模式
         * 1. field是排序的字段
         * 2. isAsc是排序模式
         */
        queryRef.sort(field, isAsc);
    } else {
        // 删除
        queryRef.sort([]);
    }
    // 执行查询操作
    if (!Ux.isEmpty(filters)) {
        /**
         * 查询条件规范化处理
         */
        onCondition(queryRef, reference, filters);
    }
    return queryRef.to();
};
export default {
    input,
    search,
    criteria,
    is
};