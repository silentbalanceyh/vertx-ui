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
                    const $values = Abs.immutable(Ele.ambArray(expected.value));
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
/**
 * ## 特殊函数「Zero」
 *
 * 在标准组件类型的依赖设置中，所有的禁用直接绑定 disabled 属性。
 *
 * @memberOf module:_ant
 * @param {Object} jsx 对应表单配置 optionJsx。
 * @param {ReactComponent} reference React组件引用。
 */
const writeDisabled = (jsx = {}, reference) => {
    const {depend = {}} = jsx;
    const {mode = "DISABLED"} = Abs.clone(depend);
    if ("DISABLED" === mode) {
        // Ant Design Form 模式才计算 disabled，否则属于普通模式
        const {form} = reference.props;
        if (form) {
            jsx.disabled = isDepend(depend, reference);
        }
    }
};
/**
 * ## 特殊函数「Zero」
 *
 * 标准的 readOnly 的禁用设置，这种类型仅用于 Select 组件，因为 Select 组件不支持 readonly 属性，仅支持 disabled。
 *
 * @memberOf module:_ant
 * @param {Object} jsx 对应表单配置 optionJsx。
 * @param {ReactComponent} reference React组件引用。
 */
const writeReadOnly = (jsx = {}, reference) => {
    const {depend = {}} = jsx;
    const {mode = "DISABLED"} = Abs.clone(depend);
    if ("READONLY" === mode) {
        jsx.disabled = isDepend(depend, reference);
    }
};
/**
 * ## 特殊函数「Zero」
 *
 * 用于处理带依赖的数据相关联字段的影响信息，主要用于`联动下拉`组件，在 reset 触发时调用。
 *
 * 主要配置如：
 *
 * ```json
 * {
 *      "metadata": "type,测试类型,,,aiSelect",
 *      "optionJsx.config.datum": "source=ci.type,key=key,label=name",
 *      "optionJsx.depend.impact": {
 *          "reset": [
 *              "surety"
 *          ]
 *      }
 * }
 * ```
 *
 * 这里的配置会被当前方法解析，含义如：
 *
 * 1. 当前字段的值在发生改变时影响了其他表单字段。
 * 2. 影响过程中，如果表单发生了重设，那么会将目标字段调整成最早的状态。
 * 3. 不同类型的下拉值会出现不同的结果。
 *
 * @memberOf module:_ant
 * @param {Object} formValues Form中初始的 linker 相关数据值。
 * @param {Object} depend 反向依赖专用配置。
 * @param {any} value 输入的值。
 */
const writeImpact = (formValues = {}, depend = {}, value) => {
    const {impact = {}} = depend;
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
};
/**
 * ## 特殊函数「Zero」
 *
 * 链接专用处理
 *
 * * optionJsx.config.linker
 * * optionJsx.config.linkerField
 *
 *
 * （生成 form values）
 * 1. config的数据结构
 *      ```json
 *      {
 *          "linker": {
 *              "row1": "formField1",
 *              "row2": "formField2",
 *              "....": "其他字段"
 *          },
 *          "linkerField": "key" // 特殊用法
 *      }
 *      ```
 * 2. 参数说明
 *      * config：带有 linker 的配置
 *      * rowSupplier：执行函数，用于获取单行数据
 * 3. 使用场景：
 *      * ListSelector 的使用
 *      * TreeSelector 的使用
 *      * AddressSelector 的使用
 *      * onChange 字段专用的处理（触发专用）
 *
 * @memberOf module:_ant
 * @param {Object} formValues Form中初始的 linker 相关数据值。
 * @param {Object} config linker配置信息。
 * @param {Function} rowSupplier 读取选中行的数据信息。
 * @return {Object} 返回最终表单需要设置关联字段的表单值。
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
                        if (value) {
                            const formatted = moment(value, pattern);       // 执行日期格式化
                            if (moment.isMoment(formatted)) {
                                value = formatted;
                            } else {
                                value = null;   // Fix issue of Moment
                            }
                        } else {
                            value = null;
                        }
                    }
                    formValues[formField] = value;                      // linker 赋值
                });
            Dev.dgDebug({linker, formValues}, "触发 linker 结果！", "#104E8B");
        }
    }
    return formValues;
};
const _edition = (reference, optionJsx = {}, field) => {
    /*
     * 优先从 reference.props 中读取 $edition
     */
    let $edition = {};
    if (reference.props.hasOwnProperty("$edition")) {
        /*
         * 属性中包含了，则证明定制过，那么取属性中的
         */
        const propEdition = reference.props.$edition;
        if (Abs.isObject(propEdition)) {
            Object.assign($edition, propEdition);
        } else {
            $edition = propEdition;
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }

    /* state 中的优先级高于 props 中 */
    if (reference.state.hasOwnProperty("$edition")) {
        const stateEdition = reference.state.$edition;
        if (Abs.isObject(stateEdition)) {
            Object.assign($edition, stateEdition);
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }
    const {$inited = {}} = reference.props;
    const {metadata} = $inited;

    /* state 中的优先级高于 props 中 */
    if (!Abs.isEmpty(metadata)) {
        if (Abs.isObject(metadata) && metadata.hasOwnProperty("edition")) {
            if (metadata.edition) {
                $edition = {};
            } else {
                $edition = false;
            }
        }
    }
    if (false === $edition) {
        /* 不可编辑，直接切断 */
        return $edition;
    }
    /* 如果当前字段为可编辑 */
    if (false !== $edition[field]) {
        const {config = {}} = optionJsx;
        if (config.once) {
            const value = $inited[field];
            if (undefined !== value) {
                /* 不可编辑 */
                $edition[field] = false;
            }
        }
    }
    /* 权限控制，field 为 undefined 是 $button 按钮专用 */
    if ($edition && $edition.__acl) {
        if (!optionJsx.readOnly && field) {
            // 非只读的情况，才考虑 __acl
            $edition[field] = $edition.__acl[field];
        }
    }
    return $edition;
};
/**
 * ## 特殊函数「Zero」
 *
 * 表单可读写的特殊方法配置，主要包含几个特殊的设置，该设置和表单只读有关。
 *
 * ### 支持模式
 *
 * * 全表单不可编辑——只读表单。
 * * 部分表单不可编辑——部分只读。
 *
 * > 这里计算的不可编辑在表单原生的 readOnly 和 disabled 之下，优先级以原表单为主。
 *
 * ### 提取 $edition 流程
 *
 * 1. 优先从 props 中读取 `$edition` 变量，如果不可编辑（直接false），直接返回。
 * 2. 其次从 state 中读取 `$edition` 变量，如果不可编辑（直接false），直接返回。
 * 3. 提取 props 中的 `$inited` 数据，从数据中提取`metadata`变量，如果出现了`edition`属性，则返回可编辑，否则不可编辑。
 *
 * ### 可编辑的判断
 *
 * 1. 如果返回值是 false，整个表单不可编辑。
 * 2. 如果返回值是 `{}`，则字段名为 true 的情况可编辑，否则不可编辑。
 *
 * 返回对象格式如：
 *
 * ```json
 * {
 *     "username": true,
 *     "email": false,
 *     "age": false
 * }
 * ```
 *
 * 上述格式中，`username` 可编辑，其他两个字段不可编辑。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} optionJsx 表单配置中的将要写入数据的 optionJsx 配置。
 * @param {String} field 将会被处理的字段信息。
 */
const writeSegment = (reference, optionJsx = {}, field) => {
    /*
     * 默认值为 true
     */
    const $edition = _edition(reference, optionJsx, field);
    if ($edition && Abs.isObject($edition)) {
        /*
         * 部分表单禁用
         */
        if ($edition.hasOwnProperty(field)) {
            optionJsx.disabled = !$edition[field];
            optionJsx.readOnly = !$edition[field];
        }
    } else {
        /*
         * 直接禁用（全表单禁用）
         */
        optionJsx.disabled = true;
        optionJsx.readOnly = true;
    }
};
export default {
    writeLinker,
    writeImpact,
    writeDisabled,
    writeReadOnly,
    writeSegment,
}