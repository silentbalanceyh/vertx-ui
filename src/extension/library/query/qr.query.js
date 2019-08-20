import Ux from 'ux';

/*
 * filters 的最终计算处理
 */
const _qdNormalized = (params = {}) => {
    /*
     * 计算最终的 $filters
     */
    const $filters = Ux.clone(params);
    /*
     * 如果只有 "" 和 其他键值
     */
    if (Object.keys($filters).length <= 2) {
        if ($filters.hasOwnProperty("")) {
            delete $filters[""];
        }
    }
    return $filters;
};
/*
 * 专用的 Or 条件生成
 */
const qdInput = (cond = [], value) => {
    const condition = {};
    if (value) {
        cond.forEach(field => condition[field] = value);
    } else {
        cond.forEach(field => condition[field] = "__DELETE__");
    }
    condition[""] = false;
    return _qdNormalized(condition);
};
const qdForm = (input, connector = "OR") => {
    const condition = {};
    condition[""] = ("AND" === connector);
    Ux.itObject(input, (field, value) => {
        if (value) {
            condition[field] = value;
        } else {
            condition[field] = "__DELETE__";
        }
    });
    return _qdNormalized(condition);
};
export default {
    // 参数专用方法
    qdForm,
    qdInput,
}