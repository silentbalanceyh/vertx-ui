import Ux from "ux";
import moment from "moment";
import To from './func.to';
import mapButtons from './func.map.buttons';

/**
 * ## 扩展配置
 *
 * 处理 `data` 中的 metadata 字段，强制转换成 Json 格式的数据。
 *
 * @memberOf module:_function
 * @param {Object} data 待处理的输入
 * @returns {Object}
 */
const mapMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};
/**
 * ## 扩展配置
 *
 * 处理 `item` 中的 `uri` 地址，主要用于处理 `EXPAND` 类型的菜单路径专用。
 *
 * @memberOf module:_function
 * @param {Object} item 配置对象信息
 * @param {DataObject} $app 应用对象数据
 * @returns {Object} 处理过后的对象数据
 */
const mapUri = (item = {}, $app) => {
    if (item.uri) {
        if ("EXPAND" !== item.uri) {
            item.uri = To.toUri(item.uri, $app);
        } else {
            item.uri = undefined;
        }
    }
    return item;
};
/**
 * ## 扩展配置
 *
 * 处理 ASSIST 专用配置数据：
 *
 * * DATUM：`$render`专用处理。
 * * DATE：`$render`专用处理。
 *
 * @memberOf module:_function
 * @param {Array} columns 基本类配置信息
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise.<T>} Promise 专用配置处理
 */
const mapAsyncDatum = (columns = [], reference) => {
    const datum = {};
    columns.filter(column => column.hasOwnProperty("$render")).forEach(column => {
        const name = column.dataIndex;
        const render = column['$render'];
        if ("DATUM" === render) {
            const normalized = Ux.Ant.toUnique(reference, column);
            /*
             * 转换成：value = display 的格式
             */
            const {data = [], config = {}} = normalized;
            const {display, value} = config;
            if (display && value) {
                const datumData = {};
                data.filter(record => !!record[value])
                    .filter(record => !!record[display])
                    .forEach(record => datumData[record[value]] = record[display]);
                if (!Ux.isEmpty(datumData)) {
                    datum[name] = datumData;
                }
            }
        } else if ("DATE" === render) {
            datum[name] = (data) => {
                if (data) {
                    const {$format = ""} = column;
                    const output = Ux.valueTime(data);
                    if (moment.isMoment(output)) {
                        /*
                         * 时间格式转换值
                         */
                        return output.format($format);
                    }
                }
                return data;
            };
        }
    });
    return Ux.promise(datum);
};
export default {
    mapUri,
    mapMeta,
    mapButtons,
    mapAsyncDatum,
}
