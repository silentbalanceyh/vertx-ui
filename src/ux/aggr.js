import Abs from './abyss';
import Ele from './element';
import Ut from './unity';
/*
 * source：总的数组值
 * executor: 函数
 * config：配置
 * {
 *      field,
 *      percent
 * }
 */
const _aggrValue = (data = [], executor, config = {}) => {
    const {
        field = "",
        seed = 0.00
    } = config;
    let sum = seed;
    if (field) {
        // Total on field
        data.forEach(item => {
            if (Abs.isObject(item)) {
                const itemV = Ele.valueFloat(item[field], sum);
                sum = executor(sum, itemV);
            }
        });
    } else {
        // Total Count
        sum = data.length;
    }
    return sum;
}
const _aggr = (grouped = [], source = [], executor, config = {}) => {
    const {
        percent = false,
    } = config;
    const group = _aggrValue(grouped, executor, config);
    if (percent) {
        const total = _aggrValue(source, executor, config);
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
    /*
     * Sum聚集
     *
     * Result:
     * name = value
     * name = value
     */
    aggrSum: (grouped = {}, config = {}, source = []) => {
        const {
            percent = false,
            amount,
        } = config;
        const data = [];
        /*
         * grouped:
         * {
         *      "group1": [],
         *      "group2": []
         * }
         */
        Object.keys(grouped).forEach(groupN => {
            let groupV = grouped[groupN];
            if (!groupV) {
                groupV = [];
            }
            const dataItem = {};
            dataItem.name = groupN;
            dataItem.value = _aggr(groupV, source, (l, r) => l + r, config);
            if (percent) {
                dataItem.display = Ut.formatPercent(dataItem.value);
            } else {
                if (amount) {
                    dataItem.display = `${amount}${Ut.formatCurrency(dataItem.value)}`;
                } else {
                    dataItem.display = dataItem.value;
                }
            }
            data.push(dataItem);
        })
        return data;
    }
}