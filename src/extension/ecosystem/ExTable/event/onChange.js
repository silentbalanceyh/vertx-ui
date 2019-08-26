import Ux from "ux";
import Ex from 'ex';
import {QQuery} from 'entity';

export default (reference) => (pagination, filters, sorter) => {
    /*
     * 表格条件变更
     * 1. pagination：分页变更
     * 2. filters：筛选表更
     * 3. sorter：排序变更
     */
    reference.setState({
        $loading: true,
        // FIX：带有 filters 的列同时使用排序和过滤时的排序不生效的问题
        $sorter: sorter,
    });
    Ux.dgDebug({
        pagination,
        filters,
        sorter
    }, "[ ExTable ] 改变条件专用事件");
    Ux.toLoading(() => {
        /*
         * 由于当前引用的 props 中包含了 $query
         * 构造四个核心参数
         */
        const {$query = {}, $condition = {}, $terms = {}} = reference.props;    // 默认的 $query
        /*
         * 最终条件计算
         */
        const query = Ex.qrCondition($query, {$condition, $terms, $filters: filters});
        const queryRef = new QQuery(query, reference);
        /*
         * 分页参数处理
         */
        if (pagination) {
            const {current, pageSize} = pagination;
            /*
             * 分页动作触发
             */
            if (current && pageSize) {
                /*
                 * 分页信息
                 * 1. current 是当前页
                 * 2. pageSize 是每页数据
                 */
                queryRef.page(current).size(pageSize);
            }
        }
        /*
         * 执行排序操作
         */
        if (Ux.isEmpty(sorter)) {
            queryRef.sort([]);
        } else {
            const {field = "", order = "ascend"} = sorter;
            const isAsc = "ascend" === order;
            /**
             * 排序信息
             * 设置排序字段和排序模式
             * 1. field是排序的字段
             * 2. isAsc是排序模式
             */
            queryRef.sort(field, isAsc);
        }
        /*
         * 最终的 Query 变更
         */
        // Ex.rx(reference).query(queryRef.to());
        reference.setState({$query: queryRef.to()});
    })
};