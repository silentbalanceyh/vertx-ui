import Ux from "ux";
import {QQuery} from 'entity';

const getValue = (val = {}, linker = {}) => {
    const values = {};
    for (const key in val) {
        if (val.hasOwnProperty(key)) {
            if (key in linker) {
                values[key] = val[key];
            } else {
                for (const keys in linker) {
                    if (linker.hasOwnProperty(keys)) {
                        if (linker[keys] === key) {
                            values[keys] = val[key];
                        }
                    }
                }
            }
        }
    }
    return values;
};

export default (reference) => {
    const {config = {}, value, id} = reference.props;
    const {linker = {}} = config;
    /*
     * 当前字段没有值的时候触发该流程
     */
    if (undefined === value && !Ux.isEmpty(linker)) {
        /*
         * 提取Form中需要读取的字段信息
         */
        const fields = Object.keys(linker)
            .map(field => linker[field]);
        const ref = Ux.onReference(reference, 1);
        const val = Ux.formGet(ref, fields);
        const values = getValue(val, linker);
        if (!Ux.isEmpty(values)) {
            values[""] = true;      // 构造严格条件
            /*
             * 读取数据，这种情况下不可能有 $filters
             */
            const params = Ux.parseAjax(ref, config.ajax.params);
            /*
             * 构造 QQuery
             */
            const queryRef = new QQuery(params, reference);
            queryRef.and(values);
            const request = queryRef.to();
            Ux.asyncData(config.ajax, request, ($data = {}) => {
                /*
                 * 是否命中
                 */
                if (1 === $data.count && $data.list[0]) {
                    const response = $data.list[0];
                    /*
                     * 读取当前字段的值的，设置默认
                     */
                    const hitField = Object.keys(linker)
                        .filter(field => linker[field] === id);
                    if (1 === hitField.length && hitField[0]) {
                        const $defaultValue = response[hitField[0]];
                        /*
                         * 捕捉到当前字段的值，直接设置
                         */
                        reference.setState({$defaultValue})
                    }
                }
            })
        }
    }
};