import Ux from "ux";

export default {
    onClick: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({$visible: true})
    },
    toValue: (reference) => {
        const {value} = reference.props;
        const data = [];
        if (value) {
            Object.keys(value).forEach(item => {
                const valueOrExpr = value[item];
                if (valueOrExpr) {
                    const record = {};
                    /* 数据信息 */
                    record.name = item;
                    record.value = valueOrExpr;
                    const parsed = Ux.valueParse(valueOrExpr);
                    Object.assign(record, parsed);
                    data.push(record);
                }
            })
        }
        return data;
    },
}