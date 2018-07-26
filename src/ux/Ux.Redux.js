/**
 * 读取Tabular专用数据，读取所有数据，一般用于Rxjs
 * @method rxDatum
 * @param data 从响应数据中读取
 * @param orderBy 排序字段
 */
const rxDatum = (data, orderBy = 'order') => {
    const result = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const hittedKey = `tabular.${key.replace(/\./g, '_')}`;
            result[hittedKey] = data[key].sort((left, right) => left[orderBy] - right[orderBy]);
        }
    }
    return result;
};
/**
 * 读取Assist专用数据，指定某个key，一般用于Rxjs
 * @method rxAssist
 * @param data 从数据中转换
 * @param orderBy 排序字段
 * @param key
 */
const rxAssist = (data, key, orderBy = 'order') => {
    const result = {};
    const hittedKey = `assist.${key.replace(/\./g, '_')}`;
    result[hittedKey] = data.sort((left, right) => left[orderBy] - right[orderBy]);
    return result;
};
export default {
    rxDatum,
    rxAssist
}
