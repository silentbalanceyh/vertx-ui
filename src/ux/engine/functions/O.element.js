import Abs from "../../abyss";
import Dt from '../datum';

const configFabric = (input = {}) => {
    const config = {};
    if ("string" === typeof input) {
        const split = input.split(',');
        config.source = split[0];
        config.field = split[1];
        config.value = split[2];
    } else {
        Object.assign(config, input);
    }
    return config;
};
/**
 * ## 「引擎」`Ux.valueFabric`
 *
 * 解析 fabric 专用事件配置处理器，该函数为后期函数，用于提取字段数据。
 *
 * 第二个参数通常为：
 *
 * ```js
 * // source,keyField,keyValue
 Ux.valueFabric(reference, `room.type,key,${roomTypeId}`, type => {
    const standardPrice = type.price;
    formValues.discount = Ux.mathDiscount(price, standardPrice);
 });
 * ```
 *
 * 第三参数为回调函数，会将读取到的数据直接传给回调函数来执行，这里执行的是唯一数据，上述示例中，读取的数据为：
 *
 * 1. source = room.type 的Assist数据源（一般是一个DataArray）。
 * 2. 使用key = 值筛选唯一记录。
 * 3. 将唯一记录传给 consumer 函数执行筛选过后的回调流程。
 *
 * @memberOf module:_value
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} input 输入数据。
 * @param {Function} consumer 执行函数。
 */
const valueFabric = (reference, input = {}, consumer) => {
    if (Abs.isFunction(consumer)) {
        const config = configFabric(input);
        const {source, field, value} = config;
        if (source && field && value) {
            const extract = Dt.elementUniqueDatum(reference, source, field, value);
            if (extract) {
                consumer(extract);
            }
        }
    }
};
/**
 * ## 「引擎」`Ux.valueFabrics`
 *
 * （略）增强版的valueFabric函数，带过滤器的版本，可支持过滤操作。
 *
 * @memberOf module:_value
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} input 输入数据。
 * @param {Function} consumer 执行函数。
 */
const valueFabrics = (reference, input = {}, consumer) => {
    if (Abs.isFunction(consumer)) {
        const config = configFabric(input);
        const {source, field, value} = config;
        if (source) {
            let filters = undefined;
            if (field && value) {
                filters = {};
                filters[field] = value;
            }
            let result;
            if (filters) {
                result = Dt.elementFindDatum(reference, source, filters);
            } else {
                result = Dt.onDatum(reference, source);
            }
            if (result) {
                consumer(result);
            }
        }
    }
};
export default {
    valueFabric,
    valueFabrics,
}