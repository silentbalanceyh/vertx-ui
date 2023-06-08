import Ux from 'ux';
import {QQuery} from "zmr";
/*
 * 第四参数的重要性
 * action = filter, paginate, sort
 * 通过该参数判断当前 onChange 触发了什么操作
 */
const __doPagination = (reference, pagination = {}) => {
    const {$query = {}} = reference.state;
    const queryRef = new QQuery($query, reference);
    /*
     * 分页信息
     * 1. current 是当前页
     * 2. pageSize 是每页数据
     **/
    const {current, pageSize} = pagination;
    queryRef.page(current).size(pageSize);
    return {$query: queryRef.to()};
}
const __doSorting = (reference, sorter = {}) => {
    const {$query = {}} = reference.state;
    const queryRef = new QQuery($query, reference);
    /*
     * 排序信息，设置排序字段和排序模式
     * 1. field 是排序的字段
     * 2. isAsc 是排序模式
     */
    const {field, order} = sorter;
    let query;
    if (order) {
        const isAsc = "ascend" === order;
        queryRef.sort(field, isAsc);
        query = queryRef.to();
    } else {
        // 还原到默认值
        const {
            $queryView = {}
        } = reference.state;
        const {sorter = []} = $queryView;
        query = queryRef.to();
        query.sorter = sorter;
    }
    return {$query: query};
}

const __doFilter = (reference, filters = {}) => {
    const {$qr = {}} = reference.state;
    const qr = {};
    Object.keys(filters).forEach(field => qr[field] = filters[field]);
    const qrDataFn = Ux.irData(reference);
    // #QR-COMMENT
    const [state, queryRef] = qrDataFn({
        isAppend: true,         // 条件追加
        $condition: qr,         // 条件运算
    });


    /*
     * 「QR」列过滤方法中默认使用 AND 连接符，简单说多个列过滤
     * 之间会产生累加效果，最终影响查询树的生成。
     * Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQJV
     */
    if ($qr.connector) {
        qr.connector = "AND" === $qr.connector;
    } else {
        qr.connector = "AND";
    }


    state.$query = queryRef.to();
    return state;
}

/**
 * ## 「标准」`Ex.kinTChange`
 *
 * @method kinTChange
 * @memberOf module:kin/unfold
 * @param reference
 * @return {*}
 */
export default (reference) => (pagination, filters, sorter, extra = {}) => {
    const {action} = extra;
    let state = {};
    if ("paginate" === action) {
        // 分页
        state = __doPagination(reference, pagination);
    } else if ("sort" === action) {
        // 排序
        state = __doSorting(reference, sorter);
    } else if ("filter" === action) {
        // 搜索
        state = __doFilter(reference, filters);
    }
    Ux.of(reference).in(state).spinning().loading().handle(() => {
        Ux.dglQrFilter(reference);
    });
}