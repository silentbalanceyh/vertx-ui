import {Dsl} from 'entity';
import Abs from '../../abyss';

/**
 *
 * ## 特殊函数「Qr」
 *
 * Query 专用的合并函数，用于合并两个同样的 Query（深度计算）。
 *
 * @memberOf module:_qr
 * @method qrCombine
 * @param {Object} query 查询条件。
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String[]} condition 查询条件处理。
 * @returns {any} 返回最终的 query 结构。
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