import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
const __aiSum = (config = {}, record = {}) => {
    const {field = [], op = "P"} = config;
    const defaultValue = op === "M" ? 1 : 0;
    let sum = defaultValue;
    field.forEach(each => {
        const value = __Zn.valueFloat(record[each], defaultValue);
        if ("M" === op) {
            sum *= value;
        } else {
            sum += value;
        }
    });
    return sum;
}
export default {
    TOTAL: (reference, column = {}) => {
        let attrs = Cmn.normInit(column);
        return (text, record = {}) => {
            const {$config = {}} = column;
            let sum = __aiSum($config, record);
            record[column.dataIndex] = sum;
            const {currency} = $config;
            if (currency) {
                sum = `${currency}${__Zn.formatCurrency(sum)}`;
            }
            return Cmn.jsxSpan(attrs, sum, column);
        }
    },
}