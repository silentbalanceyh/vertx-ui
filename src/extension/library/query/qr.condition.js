import Fn from "../functions";
import {QQuery} from 'entity';
import qrQuery from './qr.condition.normalized';

export default (
    /*
     * 列表中默认的查询条件
     * List : state.query
     */
    query = {},
    reference,
) => {
    const {
        $condition = {},
        $terms = {},
        $filters = {},
    } = Fn.state(reference);
    /*
     * 查询条件合并，直接在 query 中合并 criteria 节点的查询条件
     */
    const queryRef = new QQuery(query, reference);
    /*
     * 更新合并过后的条件
     */
    const condition = qrQuery($condition, {
        filterType: $terms
    });
    /*
     * 初始化
     */
    return queryRef.init($filters).and(condition).to();
};