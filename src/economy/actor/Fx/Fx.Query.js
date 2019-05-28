import Ux from 'ux';
import Cond from './Fx.Condition';

const is = (reference, previous = {}) => {
    /* 外置改动，判断 $query 变量 */
    const {prevProps, prevState = {}} = previous;
    const prevQuery = prevProps.$query;
    const curQuery = reference.props.$query;
    /* 内置改动，判断 $condition */
    let updated = Ux.isDiff(prevQuery, curQuery);
    if (!updated) {
        /* 判断条件 */
        const state = reference.state ? reference.state : {};
        const curCond = state.$condition;
        const prevCond = prevState.$condition;
        updated = Ux.isDiff(curCond, prevCond);
    }
    return updated;
};
const criteria = (reference) => (pagination, filters, sorter) => {
    Ux.dgDebug({
        pagination,
        filters,
        sorter
    }, "[Ex] 调用 Query.criteria 改变条件：", "#f96");
    const queryRef = Cond.initFilters(reference, filters);
    if (pagination) {
        const {current, pageSize} = pagination;
        // 触发了分页操作
        if (current && pageSize) {
            /**
             * 分页信息
             * 1. current是当前页
             * 2. pageSize则是当前页的尺寸
             */
            queryRef.page(current).size(pageSize);
        }
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
    return queryRef.to();
};
export default {
    criteria,
    init: Cond.initQuery,
    is
};