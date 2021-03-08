import Ux from 'ux';

const yoQuery = (reference, $config = {}) => {
    /*
     * 特殊的 $query 配置
     */
    const {$query, ...rest} = $config;
    const config = Ux.clone(rest);
    if ($query && config.query) {
        /*
         * 合并基础规则
         */
        if (!config.query.criteria) {
            config.query.criteria = {};
        }
        Object.assign(config.query.criteria, $query);
    }
    /*
     * 读取 criteria 引用
     */
    const criteriaRef = config.query.criteria;
    let query = Ux.toQuery("query");
    if (query && "string" === typeof query) {
        try {
            query = Ux.decryptBase64(query);
            query = JSON.parse(query);
            if (Ux.isEmpty(criteriaRef)) {
                Object.assign(criteriaRef, query);
            } else {
                const merged = {};
                merged["$0"] = query;
                merged[""] = true;
                merged["$1"] = Ux.clone(criteriaRef);
                config.query.criteria = merged;
            }
        } catch (e) {
            console.error("解析 query 参数出错！", e);
        }
    } else {
        Ux.dgDebug({query}, "跳过外置 query 参数：", "#388E8E");
    }
    return config;
};
const rxPostSelected = (reference) => (data = []) => {
    const categoryData = Ux.onDatum(reference, "data.category");
    if (0 < categoryData.length) {
        let $tree = data.map(item => item['categoryThird']);
        $tree = Ux.clone($tree);
        reference.setState({$tree});
    }
};
export default {
    rxPostSelected,
    yoQuery
}