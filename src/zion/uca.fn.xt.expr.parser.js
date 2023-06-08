import __Zn from './zero.module.dependency';

const xtExprFlat = (value = {}) => {
    const data = [];
    if (value) {
        Object.keys(value).forEach(item => {
            const valueOrExpr = value[item];
            if (valueOrExpr) {
                const record = {};
                /* 数据信息 */
                record.name = item;
                record.value = valueOrExpr;
                const parsed = __Zn.valueParse(valueOrExpr);
                Object.assign(record, parsed);
                data.push(record);
            }
        })
    }
    return data;
}

export default {
    xtExprFlat,
}