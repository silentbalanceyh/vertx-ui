import Ux from "ux";
import {QQuery} from 'entity';

export default (reference) => {
    const {config = {}, value, id} = reference.props;
    /*
     * 当前字段没有值的时候触发该流程
     */
    if (undefined === value) {
        const ref = Ux.onReference(reference, 1);
        const values = Ux.onLinker(config, (fields) => Ux.formGet(ref, fields));
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
                if (1 === $data.count) {
                    const $defaultValue = Ux.formLinker($data.list, config, id);
                    if ($defaultValue) {
                        reference.setState({$defaultValue})
                    }
                }
            })
        }
    }
};