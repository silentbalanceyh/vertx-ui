import Fn from "../functions";
import Ux from "ux";
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
    const queryRef = Fn.newQuery(query);
    /*
     * 更新合并过后的条件
     */
    const condition = qrQuery($condition, {
        filterType: $terms
    });
    /*
     * query是传入的核心查询条件，它需要和 $condition / $filters 中的条件进行运算
     * $condition 和 $filters 都是查询条件，但 $condition 优先计算
     */
    if (!Ux.isEmpty($filters)) {
        Object.assign(condition, $filters);
    }
    return queryRef.criteria(condition).to();
};