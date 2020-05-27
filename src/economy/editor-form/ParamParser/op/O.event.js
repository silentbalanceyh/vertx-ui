import Ux from "ux";

export default {
    onClick: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({$visible: true})
    },
    onRowSelect: (reference, key) => (event) => {
        Ux.prevent(event);
        let {data = []} = reference.state;
        data = Ux.clone(data);
        data = data.filter(item => key !== item.key);
        reference.setState({data});
    },
    toValue: (reference) => {
        const {value} = reference.props;
        const data = [];
        if (value) {
            Object.keys(value).forEach(item => {
                const valueOrExpr = value[item];
                const record = {};
                /* 数据信息 */
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
            /* 重设表单 */
            Ux.formReset(reference);
            /* 父引用更新 */
            reference.setState({
                $loading: false,        // 加载
                $submitting: false      // 提交
            });
            /* 调用父类 onChange */
            Ux.fn(reference).onChange(params);
        },
        $opSave: (reference) => (params = {}) => {

        }
    }
}