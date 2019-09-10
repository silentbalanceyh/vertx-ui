import Abs from '../../abyss';

const finalize = (params = {}) => {
    /*
     * 计算最终的 $filters
     */
    const $filters = Abs.clone(params);
    /*
     * 如果只有 "" 和 其他键值
     */
    if (Object.keys($filters).length <= 2) {
        if ($filters.hasOwnProperty("")) {
            delete $filters[""];
        }
    }
    return $filters;
}
export default {
    finalize
}