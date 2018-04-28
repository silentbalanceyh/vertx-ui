/**
 * 读取Tabular专用数据，读取所有数据，一般用于Rxjs
 * @method rxDatum
 * @param data 从响应数据中读取
 */
const rxDatum = (data) => {
    const result = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const hittedKey = `tabular.${key.replace(/\./g, '_')}`;
            result[hittedKey] = data[key];
        }
    }
    return result;
};
/**
 * 读取Assist专用数据，指定某个key，一般用于Rxjs
 * @method rxAssist
 * @param data 从数据中转换
 * @param key
 */
const rxAssist = (data, key) => {
    const result = {};
    const hittedKey = `assist.${key.replace(/\./g, '_')}`;
    result[hittedKey] = data;
    return result;
};
/**
 * @class Redux
 * @description 专用State状态树中的读取器
 */
export default {
    rxDatum,
    rxAssist
}
