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
 * ## 引擎函数
 *
 * 解析 fabric 专用事件配置处理器。
 *
 * @memberOf module:_value
 * @param {ReactComponent} reference React对应组件引用。
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
 * ## 引擎函数
 *
 * 解析 fabric 专用事件配置处理器（可支持过滤器的版本）。
 *
 * @memberOf module:_value
 * @param {ReactComponent} reference React对应组件引用。
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