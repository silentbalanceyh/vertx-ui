import Ux from 'ux';

const authRow = (datum = [], original = {}, config = {}) => {
    if ("SINGLE" === config.type) {
        // 单行过滤处理
        const field = config.field;
        const originalRows = original[field];
        if (originalRows) {
            // 计算原始选择行和 selectedKeys
            const $keys = Ux.immutable(originalRows);
            const rows = datum.filter(item => $keys.contains(item[field]));
            return {
                keys: rows.map(row => row.key),
                rows,
            }
        }
    }
}
const authCriteria = (datum = [], config = {}, grouped) => {

}
const authProjection = (datum = [], config = {}, grouped) => {

}
const authBind = (input, grouped, executor) => {
    return (state = {}, source) => {
        if (input && input.datum) {
            const {datum, ...rest} = input;
            const calculated = executor(source, datum, {
                ...rest,
                grouped
            })
            if (calculated) {
                Object.assign(state, calculated);
            }
        }
    }
}
export default (source = [], config = {}, grouped = {}) => {
    const {rows, projection, criteria} = config;
    /*
     * 提取不同的数据信息
     */
    const data = {};
    authBind(rows, grouped, authRow)(data, source);
    authBind(criteria, grouped, authCriteria)(data, source);
    authBind(projection, grouped, authProjection)(data, source);
    return data;
}