import Abs from "../abyss";
import U from "underscore";
import Fm from './O.ant.form';
import G from "../engine/datum";
import Ele from "../element";
import moment from 'moment';
import Dev from '../develop';
/*
 * optionJsx.depend.enabled
 * 当前字段的 disabled 条件专用
 * optionJsx.depend
 * - .mode = "DISABLED", // 默认值 disabled 的值
 * - .mode = "READONLY", // 切换到 ReadOnly 属性的值
 */
const isDepend = (depend = {}, reference) => {
    const {enabled = {}} = depend;
    /*
     * 计算 disabled 的基本规则
     * 1）enabled 作为 key
     * 2）数据结构：
     * {
     *      "field": "value" // 等于
     *      "field": ["xxx"] // 包含
     * }
     */
    if (Abs.isObject(enabled) && !Abs.isEmpty(enabled)) {
        const config = Abs.clone(enabled);
        /*
         * 提取相关值
         */
        const fields = Object.keys(config);
        const values = Fm.formGet(reference, fields);
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
                     * 读取数据
                     */
                    const dataArray = G.onDatum(reference, expected.source);
                    const $values = Abs.immutable(Ele.ambiguityArray(expected.value));
                    let compared = Abs.immutable(dataArray
                        .filter(each => undefined !== each[expected.field])
                        .filter(each => $values.contains(each[expected.field]))
                        .map(each => each.key)
                    );
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
        return 0 < counter;
    } else {
        return false;
    }
};
const writeDisabled = (jsx = {}, reference) => {
    const {depend = {}} = jsx;
    const {mode = "DISABLED"} = Abs.clone(depend);
    if ("DISABLED" === mode) {
        jsx.disabled = isDepend(depend, reference);
    }
};
const writeReadOnly = (jsx = {}, reference) => {
    const {depend = {}} = jsx;
    const {mode = "DISABLED"} = Abs.clone(depend);
    if ("READONLY" === mode) {
        jsx.disabled = isDepend(depend, reference);
    }
};
/*
 * optionJsx.depend.impact
 * 当前字段针对 depend 的反方向处理
 * （生成 form values）
 */
const writeImpact = (formValues = {}, depend = {}) => {
    const {impact = {}} = depend;
    if (Abs.isObject(impact) && !Abs.isEmpty(impact)) {
        /*
         * 读取 impact
         */
        const {reset = []} = impact;
        if (0 < reset.length) {
            /*
             * 将要 reset 部分的内容
             */
            reset.forEach(field => formValues[field] = undefined);
        }
    }
};
/*
 * 链接专用处理
 * optionJsx.config.linker
 * optionJsx.config.linkerField
 * （生成 form values）
 * 1）config的数据结构
 * {
      "linker": {
          "row1": "formField1",
          "row2": "formField2",
          "...."
      },
      "linkerField": "key" // 特殊用法
 * }
 * 2）参数说明
 * config：带有 linker 的配置
 * rowSupplier：执行函数，用于获取单行数据
 * 3）使用场景：
 * - ListSelector 的使用
 * - TreeSelector 的使用
 * - AddressSelector 的使用
 * - onChange 字段专用的处理（触发专用）
 */
const writeLinker = (formValues = {}, config = {}, rowSupplier) => {
    const {linker = {}, linkerField = "key", linkerDate = {}} = config;
    if (!Abs.isEmpty(linker)) {
        /*
         * 输入源头读取
         */
        const linkerSource = U.isFunction(rowSupplier) ? rowSupplier(linkerField) : {};
        if (linkerSource) {
            /*
             * 使用Linker设置最终值
             */
            Object.keys(linker)
                .filter(field => !!field)                               // field 必须存在
                .filter(field => !!linker[field])                       // linker 中定义了 field
                // .filter(field => linkerSource.hasOwnProperty(field))    // 不包含就直接 undefined
                .forEach(field => {
                    const formField = linker[field];
                    let value = linkerSource[field];
                    /*
                     * 日期值处理
                     */
                    if (linkerDate.hasOwnProperty(field)) {
                        const pattern = linkerDate[field];              // 是否有日期
                        const formatted = moment(value, pattern);       // 执行日期格式化
                        if (moment.isMoment(formatted)) {
                            value = formatted;
                        }
                    }
                    formValues[formField] = value;                      // linker 赋值
                });
            Dev.dgDebug({linker, formValues}, "触发 linker 结果！", "#104E8B");
        }
    }
    return formValues;
};
const writeShield = (reference, optionJsx = {}) => {
    const {$shield = false} = reference.props;
    if ($shield) {
        optionJsx.disabled = true;
        optionJsx.readOnly = true;
    }
};
export default {
    /*
    *  linker专用配置处理
    *  1）depend.impact 影响，从 当前 -> 目标
    *  2）depend.enabled 影响，从 目标 -> 当前
    * */
    writeLinker,
    writeImpact,
    /*
     * 写属性
     * disabled / readOnly
     */
    writeDisabled,
    writeReadOnly,
    /*
     * 写全局数据信息
     */
    writeShield,
}