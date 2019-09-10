import normalizer from './I.fn.normalized';
import {QQuery} from 'entity';

export default (query = {}, reference) => {
    const {
        $condition = {},
        $terms = {},
        $filters = {},
    } = reference.state ? reference.state : {};
    /*
     * 查询条件合并，直接在 query 中合并 criteria 节点的查询条件
     */
    const queryRef = new QQuery(query, reference);
    /*
     * 更新合并过后的条件
     */
    const condition = normalizer($condition, {
        filterType: $terms
    });
    /*
     * 初始化
     */
    return queryRef.init($filters).and(condition).to();
}