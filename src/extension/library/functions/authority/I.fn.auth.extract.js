import Ux from 'ux';

const authRow = (datum = [], original = {}, config = {}) => {
    if ("SINGLE" === config.type) {
        // 单行过滤处理
        const field = config.field;
        const {mapping = {}} = config;
        let $source = Ux.clone(datum);
        if (!Ux.isEmpty(mapping)) {
            $source.forEach(record => Ux.itObject(mapping, (from, to) => {
                if (record[from]) {
                    record[to] = record[from];
                }
            }))
        }
        const originalRows = original[field];
        if (originalRows) {
            // 计算原始选择行和 selectedKeys
            const $keys = Ux.immutable(originalRows);
            const rows = $source.filter(item => $keys.contains(item[field]));
            return {
                keys: rows.map(row => row.key),
                rows,
            }
        }
    } else {
        // 非 SINGLE 部分的配置信息
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