import Yo from '../yo';
import Ux from 'ux';
import yiAssist from './yi.assist'

/**
 * ## 扩展函数
 *
 * 带有企业信息页面的专用处理流程，主要用于查询条件设置。
 *
 * 1. 员工页面
 * 2. 部门页面
 * 3. 组页面
 * 4. 分公司页面
 *
 * 为这些页面注入 `companyId` 的查询条件。
 *
 * @memberOf module:_channel
 * @method yiCompany
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 返回Promise。
 */
export default (reference) => {
    const state = Yo.yoAmbient(reference);
    /*
     * 处理 $query 部分的信息
     */
    const $query = Ux.cabQuery(reference);
    if ($query) {
        /*
         * 追加条件进入到 criteria
         */
        if (!$query.criteria) $query.criteria = {};
        /*
         * 双条件合并，大于0的时候需要取新条件
         */
        if (0 < Object.keys($query.criteria).length) {
            $query.criteria[''] = true;
        }
        const {$inited = {}} = reference.props;
        $query.criteria['companyId,='] = $inited.key;
        state.$query = $query;
    }
    return yiAssist(reference, state)
        .then(Ux.ready)
}