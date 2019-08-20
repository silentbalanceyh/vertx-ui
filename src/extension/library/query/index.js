import qrCondition from './qr.condition';
import qrTerms from './qr.terms';
import qrClear from './qr.clear';

import qrQuery from './qr.query';
import qiButton from './qr.ui.button';

export default {
    /*
     * 列筛选会让 <Table/> 控件中的 $condition 发生改变
     * 当 $condition 改变时，若存在 rxCondition 函数，则会调用 rxCondition
     * -- 当前 ExComplexList 中会设置 state -> $condition
     * 然后在传入默认的 $query 变量时候，它的计算会根据
     * 1）state 中的 query （默认查询条件）
     * 2）state 中的 $condition（列筛选的条件变量）
     */
    qrCondition,
    /*
     * 列筛选中配置了Filter，需要根据Filter生成配置
     * 1）Filter类型
     * 2）Filter列的数据类型（后端查询需要）
     */
    qrTerms,
    /*
     * 清除当前 $condition 的条件
     * 清除当前 $searchText
     */
    qrClear,
    /*
     * 将两个 query 合并到一起，传入参数为标准的查询树
     */
    ...qrQuery,
    /*
     * 标准按钮类
     */
    qiButton,
}