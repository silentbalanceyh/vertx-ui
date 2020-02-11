import Ready from "./I.ready";
import Datum from '../datum';
import Ut from '../../unity';

const duplicatedDatum = (reference = {}) => (rule = {}, value, callback) => {
    if (Ready.isReady(rule, reference, value)) {
        const {config = {}, field} = rule;
        const {datum = "", keyField = "key"} = config;
        if (datum) {
            /*
             * 从当前表单中读取数据
             */
            const source = Datum.onDatum(reference, datum);
            const key = Ut.formGet(reference, keyField);
            /*
             * duplicated检查
             * 1. 当前字段已存在
             * 2. 主键必须不同
             */
            const counter = source
                .filter(item => (
                    key !== item[keyField] &&
                    value === item[field]
                )).length;
            if (0 < counter) {
                callback(rule.message);
            } else {
                callback();
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
};
export default {
    // 重复检查
    duplicatedDatum,
}