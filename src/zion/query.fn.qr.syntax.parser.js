import {QQuery} from 'zmr';
import __Zn from './zero.module.dependency';
import __QRP from './query.__.fn.qr.processor';

const qrCombine = (query = {}, reference, ...condition) => {
    /*
     * 查询条件初始化
     */
    const queryRef = new QQuery(query, reference);
    /*
     * 条件过滤
     */
    if (condition) {
        condition.filter(__Zn.isObject).forEach(item => queryRef.and(item));
    }
    /*
     * 返回合并结果
     */
    const params = queryRef.to();
    const criteria = params.criteria;
    if (criteria) {
        const combine = __Zn.clone(criteria);
        Object.keys(criteria).forEach(field => {
            const child = criteria[field];
            if (__Zn.isObject(child)) {
                const childNorm = __Zn.clone(child);
                if (2 === Object.keys(child).length && child.hasOwnProperty("")) {
                    delete childNorm[""];
                    Object.keys(childNorm).forEach(cField => combine[cField] = childNorm[cField]);
                    delete combine[field];
                    params.criteria = combine;
                }
            }
        })
    }
    return params;
}
const qrCommon = (reference, config) => {
    if (config) {
        const {$query = {}} = reference.props;
        let defaultQuery = qrCombine($query, reference);
        if (__Zn.isObject(config.query)) {
            /*
             * pager 设置
             */
            const pager = config.query.pager;
            if (pager && __Zn.isObject(pager)) {
                defaultQuery.pager = __Zn.clone(pager);
            }
            /*
             * projection 设置
             */
            const projection = config.query.projection;
            if (__Zn.isArray(projection)) {
                defaultQuery.projection = __Zn.clone(projection);
            }
            /*
             * sorter 设置
             */
            const sorter = config.query.sorter;
            if (__Zn.isArray(sorter)) {
                defaultQuery.sorter = __Zn.clone(sorter);
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
            const criteria = __Zn.parseInput(ajax.magic, reference);
            if (!__Zn.isEmpty(criteria)) {
                defaultQuery = qrCombine(defaultQuery, reference, criteria);
            }
        }
        __Zn.dgDebug(defaultQuery.criteria, "[ Ux ] 默认的查询条件：", "#8E8E38");
        return defaultQuery;
    } else {
        /*
         * 不传入 config，则直接从 reference 中处理
         */
        const {$query = {}} = reference.state ? reference.state : {};
        __Zn.dgDebug($query.criteria, "[ Ux ] state 状态中的查询条件：", "#8E8E38");
        return __Zn.clone($query);
    }
}
const qrComplex = (query = {}, reference) => {
    const {
        $condition = {},    // 基础条件
        $terms = {},        // 带有 $filter 的 column 部分的列过滤
        $filters = {},      // 基础表单专用查询条件
    } = reference.state ? reference.state : {};
    /*
     * 查询条件合并，直接在 query 中合并 criteria 节点的查询条件
     */
    const queryRef = new QQuery(query, reference);
    /*
     * 更新合并过后的条件
     */
    const condition = __QRP.qrNorm($condition, {
        terms: $terms
    });
    /*
     * 初始化
     */
    return queryRef.init($filters).and(condition).to();
}

const qrInherit = (reference) => {
    /*
     * 默认使用 reference.props 中的 $query 信息
     */
    const {$query} = reference.props;
    let defaultQuery = {};
    if (__Zn.isQrArg($query)) {
        /*
         * props 属性中的 $query 优先
         */
        defaultQuery = __Zn.clone($query);
    } else {
        /*
         * 直接从 state 属性中读取 query
         */
        const seekQuery = reference.state ? reference.state.$query : {};
        if (seekQuery) {
            defaultQuery = __Zn.clone(seekQuery);
        }
    }
    __Zn.dgQuery(reference, " qrInherit 继承参数");
    if (!__Zn.isQrArg(defaultQuery)) {
        console.error("List组件需要合法的 $query 默认参数，参数非法，请检查你的配置。");
    }
    return qrComplex(defaultQuery, reference);
}
export default {
    qrCommon,
    qrCombine,
    qrComplex,
    qrInherit,
}