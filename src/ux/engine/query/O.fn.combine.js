import {Dsl} from 'entity';
import Abs from '../../abyss';
/*
 * 直接合并条件处理
 */
export default (query = {}, reference, ...condition) => {
    /*
     * 查询条件初始化
     */
    const queryRef = Dsl.getQuery(query, reference);
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