import Abs from "../abyss";
import {Dsl} from 'entity';

/**
 * ## 「标准」`Ux.dslArray`
 *
 * Zero UI 中存储 Array 的专用数据，配置数据格式
 *
 * ```json
 * {
 *     field: "主键字段",
 *     remove: "是否 true / false"
 * }
 * ```
 *
 * @memberOf module:_unity
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key 写内容所需的 key
 * @param {Array} data 合并到 reference state 中的数据本身
 * @param {Object} config 配置数据
 */
const dslArray = (reference, key, data = [], config = {}) => {
    const {field = "key", remove = false} = config;
    /* 转换成 DataArray */
    let dataArray = reference.state ? reference.state[key] : [];
    let $dataArray;
    if (Abs.isArray(dataArray)) {
        $dataArray = Dsl.getArray(dataArray);
    } else {
        $dataArray = dataArray;
    }
    /* 转换成 Array */
    let normalized = [];
    if (Abs.isObject(data)) {
        normalized = [data];
    } else {
        normalized = normalized.concat(data);
    }
    /* 合并处理 */
    normalized.forEach(data => {
        if (remove) {
            $dataArray.removeElement(data[field], field);
        } else {
            $dataArray.saveElement(data, field);
        }
    });
    return $dataArray.to();
}
export default {
    dslArray
}