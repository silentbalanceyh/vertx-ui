import __Zn from './zero.module.dependency';
/*
 * source：总的数组值
 * executor: 函数
 * config：配置
 * {
 *      field,
 *      percent
 * }
 */
const aggrValue = (data = [], executor, config = {}) => {
    const {
        field = "",
        seed = 0.00
    } = config;
    let sum = seed;
    if (field) {
        // Total on field
        data.forEach(item => {
            if (__Zn.isObject(item)) {
                const itemV = __Zn.valueFloat(item[field], sum);
                sum = executor(sum, itemV);
            }
        });
    } else {
        // Total Count
        sum = data.length;
    }
    return sum;
}
const aggrExec = (grouped = [], source = [], executor, config = {}) => {
    const {
        percent = false,
    } = config;
    const group = aggrValue(grouped, executor, config);
    if (percent) {
        const total = aggrValue(source, executor, config);
        if (0 !== total) {
            return group / total;
        } else {
            return 0;
        }
    } else {
        return group;
    }
}

export default {
    aggrValue,
    aggrExec,
}