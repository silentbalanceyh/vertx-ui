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
                const parsed = Ux.valueExpr(valueOrExpr);
                Object.assign(record, parsed);
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