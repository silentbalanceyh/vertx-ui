import qrCombine from './O.fn.combine';
import Abs from '../../abyss';
import Pr from '../parser';
import Dev from '../../develop';

/**
 * ## 特殊函数「Qr」
 *
 * 复杂内容核心操作，用于设置默认的 $query 信息
 *
 * 优先级选取
 *
 * 1. props 中的 $query 优先
 * 2. config 中的 query 第一级，直接合并 config.query （全合并）
 * 3. config 中的 ajax.magic 合并（需解析，只合并 criteria）
 *
 * @memberOf module:_qr
 * @method qrCommon
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 查询配置
 * @returns {Object} 返回最终的 query 结构。
 */
export default (reference, config) => {
    if (config) {
        const {$query = {}} = reference.props;
        let defaultQuery = qrCombine($query, reference);
        if (Abs.isObject(config.query)) {
            /*
             * pager 设置
             */
            const pager = config.query.pager;
            if (pager && Abs.isObject(pager)) {
                defaultQuery.pager = Abs.clone(pager);
            }
            /*
             * projection 设置
             */
            const projection = config.query.projection;
            if (Abs.isArray(projection)) {
                defaultQuery.projection = Abs.clone(projection);
            }
            /*
             * sorter 设置
             */
            const sorter = config.query.sorter;
            if (Abs.isArray(sorter)) {
                defaultQuery.sorter = Abs.clone(sorter);
            }
            /*
             * 合并查询条件
             */
            const criteria = config.query.criteria;
            defaultQuery = qrCombine(defaultQuery, reference, criteria);
        }
        /*
         * 针对 ajax 专用的 magic 处理
         */
        const {ajax = {}} = config;
        if (ajax.magic) {
            const criteria = Pr.parseInput(ajax.magic, reference);
            if (!Abs.isEmpty(criteria)) {
                defaultQuery = qrCombine(defaultQuery, reference, criteria);
            }
        }
        Dev.dgDebug(defaultQuery.criteria, "[ Ux ] 默认的查询条件：", "#8E8E38");
        return defaultQuery;
    } else {
        /*
         * 不传入 config，则直接从 reference 中处理
         */
        const {$query = {}} = reference.state ? reference.state : {};
        Dev.dgDebug($query.criteria, "[ Ux ] state 状态中的查询条件：", "#8E8E38");
        return Abs.clone($query);
    }
}