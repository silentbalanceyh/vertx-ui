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
                const record = {};
                record.name = item;
                const firstIndex = valueOrExpr.indexOf(":");
                record.type = valueOrExpr.substring(0, firstIndex);
                record.expression = valueOrExpr.substring(firstIndex + 1, valueOrExpr.length);
                data.push(record);
            })
        }
        return data;
    },
    actions: {
        $opSaveParam: (reference) => (params = {}) => {
            console.info(params);
        }
    }
}