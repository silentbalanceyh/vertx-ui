import Ux from "ux";
import {Dsl} from 'entity';

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
    onChange: (reference) => (params = {}) => {
        if (params.name) {
            const $params = Ux.clone(params);
            const {data = []} = reference.state;
            const dataArray = Dsl.getArray(data);
            dataArray.saveElement($params);
            reference.setState({data: dataArray.to()});
        }
    },
    onSubmit: (reference) => (event = {}) => {
        Ux.prevent(event);
        const {data = []} = reference.state;
        /*
         * 生成 magic 格式
         */
        const magic = {};
        data.forEach(item => magic[item.name] = item.value);
        Ux.fn(reference).onChange(magic);
        reference.setState({$visible: false});
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
        }
    }
}