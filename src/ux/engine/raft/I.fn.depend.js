import Ut from '../../unity';
import Abs from '../../abyss';
import Ele from '../../element';

import G from '../datum';
import U from 'underscore';

const readForm = (reference, fields = []) => {
    const values = {};
    fields.forEach(field => {
        const value = Ut.formGet(reference, field);
        if (value) {
            values[field] = value;
        }
    });
    return values;
};
/*
 * optionJsx.depend.enabled：当前字段 disabled 的条件
 */
export default (reference, jsx = {}) => {
    const {depend} = jsx;
    if (depend) {
        /*
         * 计算 disabled 的基本规则
         * 1）enabled 作为 key
         * 2）数据结构：
         * {
         *      "field": "value" // 等于
         *      "field": ["xxx"] // 包含
         * }
         */
        if (depend.hasOwnProperty('enabled')) {
            const config = Abs.clone(depend.enabled);
            /*
             * 提取值
             */
            const fields = Object.keys(config);
            const values = readForm(reference, fields);
            /*
             * 遍历 config 检查条件是否满足
             * fields = [ field1, field2 ]
             */
            const counter = fields.map(field => {
                const expected = config[field];
                const actual = values[field];
                if (U.isArray(expected)) {
                    /*
                     * 固定值配置
                     * field = []
                     */
                    return Abs.isIn(actual, expected);
                } else if (U.isObject(expected)) {
                    /*
                     * 特殊配置，用于处理 DATUM 这种下拉
                     * {
                     *     "source": "surety.type",
                     *     "field": "code",
                     *     "value": "None"
                     * }
                     */
                    if (expected.source || expected.field) {
                        /*
                         *  读取数据
                         */
                        const dataArray = G.onDatum(reference, expected.source);
                        const $values = Abs.immutable(Ele.ambiguityArray(expected.value));
                        let compared = Abs.immutable(dataArray
                            .filter(each => undefined !== each[expected.field])
                            .filter(each => $values.contains(each[expected.field]))
                            .map(each => each.key));
                        return compared.contains(actual);
                    } else {
                        return false;
                    }
                } else {
                    if (false === expected) {
                        /*
                         * 多带一个条件
                         */
                        return undefined === actual || false === actual;
                    } else {
                        return actual === expected;
                    }
                }
            }).filter(checked => false === checked).length;
            /*
             * counter = 0：全部验证通过，disabled = false
             * counter > 0：有内容未通过，disabled = true;
             */
            jsx.disabled = (0 < counter);
        }
    }
    return jsx;
}