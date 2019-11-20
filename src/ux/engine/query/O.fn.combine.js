import {QQuery} from 'entity';
import Abs from '../../abyss';

export default (query = {}, reference, ...condition) => {
    /*
     * 查询条件初始化
     */
    const queryRef = new QQuery(query, reference);
    /*
     * 条件过滤
     */
    if (condition) {
        condition.filter(Abs.isObject).forEach(item => queryRef.and(item));
    }
    /*
     * 返回合并结果
     */
    return queryRef.to();
}