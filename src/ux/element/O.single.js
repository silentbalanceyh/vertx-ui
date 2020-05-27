import U from "underscore";
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 将一个字符串转换成整数，保证转换成功，如果出现转换失败，取默认值。
 *
 * ```js
 * const valid = "1231";
 * const okValue = Ux.valueInt(valid, 12);
 *
 * const invalid = null;
 * const koValue = Ux.valueInt(invalid, 12);
 *
 * // 最终结果
 * // okValue 的值为 1231
 * // koValue 的值为 12
 * ```
 *
 * @memberOf module:_value
 * @param {String} literal 被转换的字符串
 * @param {Number} dft 转换失败的默认值
 * @return {number} 返回转换后的函数
 */
const valueInt = (literal = "", dft = 0) => {
    let ret = parseInt(literal, 10);
    if (isNaN(ret)) {
        ret = dft;
    }
    return ret;
};
/**
 * ## 标准函数
 *
 * 将一个字符串转换成合法浮点数，保证转换成功，如果出现转换失败，取默认值。
 *
 * @memberOf module:_value
 * @param {String} literal 被转换的字符串
 * @param {Number} dft 转换失败的默认值
 * @param {Number} digest 小数点之后的位数
 * @return {Number} 返回最终浮点数
 */
const valueFloat = (literal, dft = 0.0, digest = 2) => {
    let ret = parseFloat(literal);
    if (isNaN(ret)) {
        ret = dft;
    } else {
        ret = ret.toFixed(digest);
    }
    ret = parseFloat(ret);
    return ret;
};
/**
 * ## 标准函数
 *
 * 因子计算函数，将一个带 `%` 号的字符串转换成浮点数，转换不成功则 undefined，步骤：
 *
 * ```js
 * const item = "62.5%";
 * const value = Ux.valueFactor(item);
 *
 * // value 的值为 0.625
 * ```
 *
 * @memberOf module:_value
 * @param {String} literal 将要被转换的字符串
 * @return {Number} 返回最终转换函数
 */
const valueFactor = (literal = "") => {
    // 无百分号
    if (literal.endsWith("%")) {
        const item = literal.replace(/%/g, '');
        return valueFloat(item) / 100;
    }
};
/**
 * ## 标准函数
 *
 * 表达式解析成对象的专用函数
 *
 * 1. 如果 expr 是 String 则执行解析。
 * 2. 如果 expr 是 Object类型，则直接返回 expr 这个对象。
 *
 * ```js
 * const user = "username=Lang,email=lang.yu@hpe.com";
 * const userObj = Ux.valuePair(user);
 * ```
 *
 * 上述代码执行后生成格式如：
 *
 * ```json
 * {
 *     "username": "Lang",
 *     "email": "lang.yu@hpe.com"
 * }
 * ```
 *
 * @memberOf module:_value
 * @param {String} expr 表达式信息，可能包含键值对：`name1=value1,name2=value2`。
 * @return {Object} 返回转换好的对象
 */
const valuePair = (expr) => {
    let mapping;
    if ("string" === typeof expr) {
        mapping = {};
        expr.split(',').filter(kv => 0 < kv.indexOf('=')).forEach(kv => {
            const kvArr = kv.split('=');
            if (kvArr[0] && kvArr[1]) {
                mapping[kvArr[0]] = kvArr[1];
            }
        });
    } else {
        if (expr && U.isObject(expr)) mapping = expr;
        if (!mapping) mapping = {};
    }
    return mapping;
};
/**
 * ## 特殊函数「Zero」
 *
 * Zero UI 中用于计算自定义组件中的继承属性，移除原生态的 Ant Design 中不支持的特殊属性
 *
 * * fnOut：Redux架构下写状态树的专用函数，可统一写。
 * * reference：React Component 组件引用。
 * * config：自定义控件传入的基本配置信息（大部分组件中的配置都是使用 config）。
 *
 * 框架中的代码如：
 *
 * ```js
 * // 根据Filter计算双重数据源
 * const from = Op.getFrom(this, config, fromTable);
 * const to = Op.getTo(this, config, toTable);
 *
 * // 处理InputGroup中的jsx
 * const attrs = Ux.valueLimit(jsx);
 * const $attrs = Ux.clone(attrs);
 *
 * return (
 *      <Input.Group {...$attrs} className={"web-table-transfer"}>
 *          <Table {...fromTable} dataSource={from}/>
 *          <Filter config={config} reference={this}/>
 *          <Table {...toTable} dataSource={to}/>
 *      </Input.Group>
 * );
 * ```
 *
 * @memberOf module:_value
 * @param {Object} jsx 处理React中的jsx继承属性专用
 * @return {Object} 返回最终将要继承的属性信息
 */
const valueLimit = (jsx = {}) => {
    const processed = {};
    const flips = Abs.immutable([
        "fnOut",
        "reference",
        "config"
    ]);
    Object.keys(jsx).filter(key => !flips.contains(key))
        .forEach((field) => processed[field] = jsx[field]);
    return processed;
};
/**
 * ## 标准函数
 *
 * 该函数负责将 `field` 字段中的信息从 source 拷贝到 target 中。
 *
 * 1. field 为 String：拷贝单个字段数据
 * 2. field 为 Array：拷贝多个字段数据
 * 3. 如果读取的数据为 Object / Array 则采用深度拷贝
 *
 * @memberOf module:_value
 * @param {Object} target 拷贝目标对象
 * @param {Object} source 拷贝源对象
 * @param {String |Array} field 需要拷贝的字段信息
 */
const valueCopy = (target = {}, source = {}, field) => {
    if (field) {
        if ("string" === typeof field) {
            if (source[field]) {
                if (Abs.isObject(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else if (U.isArray(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else {
                    target[field] = source[field];
                }
            }
        } else if (U.isArray(field)) {
            field.forEach(eachField => valueCopy(target, source, eachField));
        }
    }
};

/*
 * ## 标准函数
 * 处理解析流程
 **/
const valueParse = (valueOrExpr) => {
    const firstIndex = valueOrExpr.indexOf(":");
    const parsed = {};
    parsed.type = valueOrExpr.substring(0, firstIndex);
    parsed.expression = valueOrExpr.substring(firstIndex + 1, valueOrExpr.length);
    return parsed;
}
export default {
    valueParse,
    valueInt,
    valueFloat,
    valueFactor,
    valuePair,
    valueLimit,
    valueCopy,
}