import U from 'underscore';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * DataArray和Array的统一数据处理，返回最终的 Array 数组。
 *
 * @memberOf module:_function
 * @param {any} data 输入数据
 * @returns {Array} 最终返回数组
 */
const array = (data) => {
    if (data && U.isFunction(data.to)) {
        /*
         * Data Array
         */
        const $data = data.to();
        if (U.isArray($data)) {
            return Ux.clone($data);
        } else {
            return [];
        }
    } else {
        /*
         * JavaScript Array
         */
        if (U.isArray(data)) {
            return Ux.clone(data);
        } else {
            return [];
        }
    }
};
export default {
    array,
}