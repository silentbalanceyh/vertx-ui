import __Zn from './zero.module.dependency';
import __AGGR from './statistic.__.fn.aggr.unit';

const aggrSum = (grouped = {}, config = {}, source = []) => {
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
        dataItem.value = __AGGR.aggrExec(groupV, source, (l, r) => l + r, config);
        if (percent) {
            dataItem.display = __Zn.formatPercent(dataItem.value);
        } else {
            if (amount) {
                dataItem.display = `${amount}${__Zn.formatCurrency(dataItem.value)}`;
            } else {
                dataItem.display = dataItem.value;
            }
        }
        data.push(dataItem);
    })
    return data;
}

export default {
    aggrSum,
}