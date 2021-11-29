import Abs from './abyss';
import E from './error';
import Py from 'js-pinyin';
import moment from "moment";
import {DataObject} from 'entity';
// 特殊排序法则
import St from "./unity/O.sorter";

Py.setOptions({checkPolyphone: false, charCase: 0})
/**
 *
 * ## 「标准」`Ux.valuePinyin`
 *
 * 将汉字转换成拼音，在某些场景中，中文字转换成拼音后可根据拼音的字典序进行排列，这是业务场景所必须的，这种转换
 * 也是有必要的，而系统中主要使用了`js-pinyin`模块实现直接转换，封装了第三方库。
 *
 * @memberOf module:_value
 * @param {String} input 输入的数据
 * @returns {String} 返回转换好的拼音信息
 */
const valuePinyin = (input) => {
    if ("string" === typeof input) {
        return Py.getFullChars(input);
    } else return input;
}
/**
 * ## 「标准」`Ux.valueAppend`
 *
 * 不重复追加值到`item`对象中（包含则不设置）
 *
 * 框架内部的使用代码如：
 *
 * ```js
 *
 *     const {$clear, form} = reference.props;
 *     // 记录切换：从更新表单 -> 添加表单切换
 *     if ($clear && $clear.is()) {
 *          const keys = $clear.to();
 *          keys.forEach(key => Value.valueAppend(data, key, undefined));
 *     }
 * ```
 *
 * 这里需要解释这个API和`Ux.assign`（mode=2）的区别，在`Ux.assign`中，追加模式是做合并，而且追加时支持嵌套追加，
 * 除了顶层Object以外它的子对象也会实现合并追加流程，而`Ux.valueAppend`是单纯的值追加过程，只在当前传入对象中追加
 * 是否包含了field的情况。
 *
 * @memberOf module:_value
 * @param {Object} item 被设置的对象引用
 * @param {String} field 将要设置的字段名
 * @param {any} value 将要设置的字段值
 */
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};

/**
 * ## 「标准」`Ux.valueValid`
 *
 * 将输入数据处理成合法对象，两种模式处理对象Object，由于后端无法识别某些值，所以执行下边处理
 *
 * 1. 宽模式，0, null, undefined，false 都会被移除，包括 ""。
 * 2. 严格模式，仅移除 undefined，其他的保留。
 *
 * 注意对比这个API和`denull`的区别，`denull`中只处理null值的属性。
 *
 * @memberOf module:_value
 * @param {Object} data 输入的Object对象。
 * @param {boolean} wild 是否使用宽模式。
 * @returns {Object} 返回处理好的数据。
 */
const valueValid = (data = {}, wild = false) => {
    // eslint-disable-next-line
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (Abs.isArray(value)) {
                value.forEach(item => valueValid(item, wild));
            } else if (Abs.isObject(value)) {
                valueValid(value, wild);
            } else {
                if (wild) {
                    // 空字符串、0，以及其他值
                    if (!value) {
                        delete data[key];
                    }
                } else {
                    if (undefined === value) {
                        delete data[key];
                    }
                }
            }
        }
    }
    return data;
};
/**
 * ## 「标准」`Ux.valuePath`
 *
 * 对象树检索专用函数，可根据 path 检索对象树
 *
 * ```js
 * const user = {
 *     "teacher":{
 *         "son":{
 *             "username": "Lang"
 *         }
 *     }
 * }
 * const son = Ux.valuePath(user, "teacher.son");
 * const username = Ux.valuePath(user, "teacher.son.username");
 * ```
 *
 * @memberOf module:_value
 * @param {Object} data 将要搜索的对象。
 * @param {String} path 路径必须是一个字符串，并且包含`.`格式。
 * @return {null|any} 返回最终搜索到的值，否则为 null。
 */
const valuePath = (data = {}, path) => {
    if ("string" !== typeof path) {
        console.error(data, path);
        throw new Error("[ Ux ] valuePath 要求第二个参数必须是 String 类型");
    }
    if (path.indexOf('.')) {
        const $data = Abs.immutable(data);
        const fullPath = path.split('.');
        const calculated = $data.getIn(fullPath);
        if (calculated) {
            /*
             * 拿到对象信息
             */
            if (Abs.isFunction(calculated.toJS)) {
                const value = calculated.toJS();
                if (undefined === value) {
                    return null;
                } else {
                    return value;
                }
            } else {
                return calculated;
            }
        } else {
            /*
             * 搜索到的值是undefined
             */
            return null;
        }
    } else {
        /*
         * 读取不带表达式字段的值
         */
        const value = data[path];
        if (undefined === value) {
            return null;
        } else {
            return value;
        }
    }
};


/**
 * ## 「标准」`Ux.valueOnChange`
 *
 * 行编辑器专用函数，用于编辑表格行相关信息
 *
 * @memberOf module:_value
 * @param {React.Component} reference React组件引用。
 * @param {Object} state 组件引用本身状态信息。
 * @param {String} key 状态中需要处理的字段信息`key`。
 */
const valueOnChange = (reference = {}, state, key = "source") => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, state);
        onChange(newValue[key]);
    } else {
        console.error("valueOnChange丢失了onChange方法");
    }
};

/**
 * ## 「标准」`Ux.valueTime`
 *
 * 时间转换标准函数，将字符串格式的对象转换成合法 Moment 对象，返回失败则报错。
 *
 * @memberOf module:_value
 * @param {String} value 被转换的字符串。
 * @param {String} format Moment可解析的格式信息，默认ISO。
 * @return {Moment} 返回 Moment 对象。
 */
const valueTime = (value, format = moment.ISO_8601) => {
    if (value) {
        if (!moment.isMoment(value)) {
            value = moment(value, format);
            E.fxTerminal(!moment.isMoment(value), 10028, value);
        }
        return value;
    } else {
        E.fxTerminal(true, 10028, value);
    }
};

/**
 * ## 「标准」`Ux.valueTimes`
 *
 * 时间转换专用函数，将对象中的 Object 中所有 `fields` 字段转换成时间格式。
 *
 * > 这个函数只支持 ISO 格式，批量转换对象中的字段。
 *
 * @memberOf module:_value
 * @param {Object} data 被转换的对象数据。
 * @param {String[]} fields 被转换对象的字段数组信息。
 */
const valueTimes = (data = {}, ...fields) => {
    fields.forEach(field => {
        if (data[field]) data[field] = valueTime(data[field]);
    });
};


/**
 * ## 「标准」`Ux.valueDuration`
 *
 * 根据from和to计算中间的duration差值。
 *
 * * years - y
 * * monthds -M
 * * weeks -w
 * * days - d
 * * hours - h
 * * minutes - m
 * * seconds - s
 * * milliseconds - ms
 *
 * 第三参数表格参考 moment，注意支持单数模式，默认单位为天。
 *
 * |度量值（复数）|单数|说明|
 * |---|---|:---|
 * |years|year|年|
 * |months|month|月|
 * |weeks|week|周|
 * |days|day|天|
 * |hours|hour|小时|
 * |minutes|minute|分钟|
 * |seconds|second|秒|
 * |milliseconds|millisecond|毫秒|
 *
 * @memberOf module:_value
 * @param {String|Moment} from 开始时间
 * @param {String|Moment} to 结束时间
 * @param {String} mode 计算模式
 * @return {number} 返回最终的计算数值
 */
const valueDuration = (from, to, mode = 'day') => {
    if (from && to) {
        from = valueTime(from);
        to = valueTime(to);
        return moment(to).diff(from, mode);
    } else {
        E.fxTerminal(true, 10030, from, to, "NoNeed");
    }
};


/**
 * ## 「标准」`Ux.valueEndTime`
 *
 * 根据开始时间、间隔、模式计算结束时间
 *
 * @memberOf module:_value
 * @param {String|Moment} from 开始时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Moment} 返回结束时间
 */
const valueEndTime = (from, duration, mode = 'day') => {
    if (from && duration) {
        from = valueTime(from);
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(from).add(duration, mode);
    } else {
        E.fxTerminal(true, 10030, from, "NoNeed", duration);
    }
};


/**
 * ## 「标准」`Ux.valueStartTime`
 *
 * 根据结束时间、间隔、模式计算开始时间
 *
 * @memberOf module:_value
 * @param {String|Moment} to 结束时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Moment} 返回开始时间
 */
const valueStartTime = (to, duration, mode = 'day') => {
    if (to && duration) {
        to = valueTime(to);
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(to).subtract(duration, mode);
    } else {
        E.fxTerminal(true, 10030, "NoNeed", to, duration);
    }
};
/**
 * ## 「标准」`Ux.valueNow`
 *
 * 返回当前时间，直接得到 Moment 对象。
 *
 * @memberOf module:_value
 * @param {String} pattern 可支持的时间格式。
 * @return {any} 返回合法的 Moment 对象。
 */
const valueNow = (pattern) => {
    return undefined === pattern ? moment() :
        (null === pattern ? moment().toISOString() : moment().format(pattern));
};

/**
 * ## 「标准」`Ux.valueInt`
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
 * ## 「标准」`Ux.valueFloat`
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
 * ## 「标准」`Ux.valueFactor`
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
 * ## 「标准」`Ux.valuePair`
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
        if (expr && Abs.isObject(expr)) mapping = expr;
        if (!mapping) mapping = {};
    }
    return mapping;
};


/**
 * ## 「标准」`Ux.valueLimit`
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
    Object.keys(jsx).filter(key => ![
        "fnOut",
        "reference",
        "config"
    ].includes(key)).forEach((field) => processed[field] = jsx[field]);
    return processed;
};
/**
 * ## 「标准」`Ux.valueCopy`
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
 * @return Object 最终拷贝过的属性
 */
const valueCopy = (target = {}, source = {}, field) => {
    if (field) {
        if ("string" === typeof field) {
            if (source[field]) {
                if (Abs.isObject(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else if (Abs.isArray(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else {
                    target[field] = source[field];
                }
            }
        } else if (Abs.isArray(field)) {
            field.forEach(eachField => valueCopy(target, source, eachField));
        }
    }
    return target;
};
/**
 * ## 「标准」`Ux.valueOk`
 *
 * 该函数负责将 `field` 字段中的信息从 source 拷贝到 target 中。
 *
 * 1. field 为 String：拷贝单个字段数据
 * 2. field 为 Array：拷贝多个字段数据
 * 3. 如果读取的数据为 Array 则采用深度拷贝
 *
 * @memberOf module:_value
 * @param {Object} input 拷贝源对象
 * @param {Array} config 需要拷贝的字段信息
 * @param {Object} output 拷贝目标对象
 * @return Object 最终拷贝过的属性
 */
const valueOk = (input = {}, config = [], output) => {
    const values = {};
    config.forEach(field => {
        if (0 < field.indexOf(',')) {
            // field,to
            const kv = field.split(',');
            values[kv[0]] = input[kv[1]];
        } else if (0 < field.indexOf("=")) {
            // field=to
            const kv = field.split('=');
            if ("false" === kv[1]) {
                values[kv[0]] = false;
            } else if ("true" === kv[1]) {
                values[kv[0]] = true;
            } else {
                values[kv[0]] = kv[1];
            }
        } else {
            // field
            values[field] = input[field];
        }
    });
    if (output) {
        Object.assign(output, values);
    }
    return values;
}

const _valueFlat = (field, item = {}) => {
    const result = {};
    // eslint-disable-next-line
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const value = item[key];
            const targetKey = `${field}.${key}`;
            if (Abs.isObject(value) && !Abs.isArray(value)) {
                const merged = _valueFlat(targetKey, value);
                Object.assign(result, merged);
            } else {
                result[targetKey] = value;
            }
        }
    }
    return result;
};
/**
 * ## 「标准」`Ux.valueLadder`
 *
 * 梯度处理专用函数，函数执行流程
 *
 * 1. 先全部拉平，生成带`.`属性的对象（一层结构）。
 * 2. 按照拉平的属性名进行排序（顺序处理）。
 * 3. 然后执行**结构化**，将所有的`.`操作符移除。
 *
 * 最终目的是生成`Json`树。
 *
 * ```js
 * const config = {
 *     "optionJsx.item": 12,
 *     "optionItem.label": "标签",
 *     "field": "email",
 *     "optionItem.style.color": "red",
 *     "ajax.magic.params": {
 *         "name": "Lang",
 *         "age": 13
 *     }
 * }
 * const values = Ux.valueLadder(config);
 * ```
 *
 * 上述代码执行过后，会返回下边的结果：
 *
 * ```json
 * {
 *     "ajax":{
 *         "magic":{
 *             "params":{
 *                 "name": "Lang",
 *                 "age": 13
 *             }
 *         }
 *     },
 *     "field": "email",
 *     "optionItem":{
 *         "label": "标签",
 *         "style": {
 *             "color": "red"
 *         }
 *     },
 *     "optionJsx":{
 *         "item": 12
 *     }
 * }
 * ```
 *
 * @memberOf module:_value
 * @param {Object} item 输入对象处理
 * @return {Object} 返回最终构造的对象信息
 */
const valueLadder = (item = {}) => {
    // 1. 先拉平这个对象
    const processed = {};
    // 过滤$option专用
    Abs.itObject(item, (field, value) => {
        if (Abs.isObject(value) && !Abs.isArray(value)) {
            const item = _valueFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = Abs.immutable({});
    Object.keys(processed).sort((left, right) => left.length - right.length)
        .forEach(field => {
            if (0 < field.indexOf(".")) {
                $item = $item.setIn(field.split('.'), processed[field]);
            } else {
                $item = $item.set(field, processed[field]);
            }
        });
    return $item.toJS();
};
/**
 * ## 「标准」`Ux.valueParse`
 *
 * 将字符串解析成
 *
 * ```json
 * {
 *     "type": "解析类型",
 *     "expression": "最终表达式"
 * }
 * ```
 *
 * @memberOf module:_value
 * @param {String} valueOrExpr 表达式信息
 * @returns {Object} 计算表达式的解析结果。
 */
const valueParse = (valueOrExpr) => {
    const firstIndex = valueOrExpr.indexOf(":");
    const parsed = {};
    parsed.type = valueOrExpr.substring(0, firstIndex);
    parsed.expression = valueOrExpr.substring(firstIndex + 1, valueOrExpr.length);
    return parsed;
}

/*
 * ## 时间转换器
 *
 * 定义时间格式转换类，内部调用 `moment` 库中的日期时间格式，主要用于转换输入对象
 *
 * * input：输入的对象相关信息。
 * * config：将要转换的时间配置信息。
 *
 * config 的结构如下：
 *
 * ```json
 * {
 *      "format": "时间专用 Pattern"
 * }
 * ```
 *
 * 使用方式的代码如下：
 *
 * ```js
 * const fromIn = { from:"2020-01-01", to:"2020-01-20" };
 * const fromValue = Ux.Moment.from(fromIn,{
 *     format: "YYYY-MM-DD"
 * });
 *
 * const toIn = {
 *     from: Moment("2020-01-01", "YYYY-MM-DD"),
 *     to: Moment("2020-01-20", "YYYY-MM-DD")
 * }
 * const toValue = Ux.Moment.to(toIn,{
 *     format: "YYYY-MM-DD"
 * });
 * ```
 *
 */
class _Moment {
    /**
     * ## 标准函数
     *
     * 将传入的`fields`对应属性从 `moment` 类型转换成字符串类型，用于提交到后端之前格式转换。
     *
     * @param input 输入的对象相关信息。
     * @param config 将要转换的时间配置信息。
     * @param {String[]} fields 需要转换的字段信息
     * @return {any} 返回转换过后的数据信息
     */
    static to(input, config, ...fields) {
        const $data = Abs.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => moment.isMoment(input[field]))
            .forEach(field => $data[field] = input[field].format(format));
        return $data;
    };

    /**
     * ## 标准函数
     *
     * 将传入的`fields`对应属性从字符串类型转换成合法的 `moment` 类型，主要用于从后端读取数据在 Web界面呈现时专用。
     *
     * @param input 输入的对象相关信息。
     * @param config 将要转换的时间配置信息。
     * @param {String[]} fields 需要转换的字段信息
     * @return {any} 返回转换过后的数据信息
     */
    static from(input, config, ...fields) {
        const $data = Abs.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => "string" === typeof input[field])
            .forEach(field => $data[field] = moment(input[field], format));
        return $data;
    }
}


/**
 * ## 「标准」`Ux.toJson`
 *
 * 内部直接调用`JSON.parse`解析，将字符串转换成对象，如果转换出错则直接返回`null`值。
 *
 * @memberOf module:_to
 * @param {any} input 传入的被转换对象。
 * @return {null|any} 转换出来的Json对象。
 */
const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};
/**
 * ## 「标准」`Ux.toTime`
 *
 * 设置 moment 对象中的固定时间信息（设置时、分、秒），根据 `timeStr` 进行日期格式解析。
 *
 * @memberOf module:_to
 * @param {Moment} momentValue 被转换的合法的 moment 对象。
 * @param {String} timeStr 传入的合法日期时间格式。
 * @return {Moment} 返回一个合法的 moment 对象。
 */
const toTime = (momentValue, timeStr) => {
    if (moment.isMoment(momentValue) && "string" === typeof timeStr) {
        /*
         * Time
         */
        const defaultTime = moment(timeStr, "HH:mm:ss");
        if (defaultTime.isValid()) {
            /*
             * Copy hour, min, second
             */
            momentValue.hour(defaultTime.hour());
            momentValue.minute(defaultTime.minute());
            momentValue.second(defaultTime.second());
            return momentValue;
        } else return momentValue;
    } else return momentValue;
};
/**
 * ## 「标准」`Ux.toArray`
 *
 * 将数据转换成标准的JavaScript数组：
 *
 * 1. 如果是Array则直接返回副本。
 * 2. 如果是Set类型则将Set转换成Array的副本。
 * 3. 如果是非集合类型的数据，则直接加入`[]`符号来生成新数组。
 *
 * @memberOf module:_to
 * @param {any} input
 * @return {Array}
 *
 */
const toArray = (input) => {
    let resultArr = [];
    if (Abs.isSet(input)) {
        resultArr = Array.from(input);
    } else if (Abs.isArray(input)) {
        resultArr = Abs.clone(input);
    } else {
        resultArr = [input];
    }
    return resultArr;
}

/**
 * ## 「标准」`Ux.ambArray`
 *
 * 二义性函数数组规范化
 *
 * 1. 如果 args 本身是数组，则直接返回 args，并且过滤掉 undefined 的元素。
 * 2. 如果 args 的第一个元素是数组，则直接返回第一个元素，并且过滤掉 undefined 的元素。
 * 3. 如果 args 不是数组，也不是变参数组，则直接使用 `[]` 修饰过后返回最终数组。
 *
 * 框架内部的使用代码：
 *
 * ```js
 *
 * // 支持三种输入数据格式
 * //     args 变参：("path1","path2");
 * //     args 数组：(["path1","path2"]);
 * //     args 修饰：("path1");
 * const fromPath = (reference = {}, ...args) => {
 *     let keys = Ele.ambArray.apply(this, args);
 *     const length = keys['length'];
 *     // ... 其他代码部分
 * }
 * ```
 *
 * @memberOf module:_unity
 * @param {any[]|Array} args 传入的二义性参数信息
 * @return {Array} 返回最终的数组信息
 */
const ambArray = (...args) => {
    let ref;
    if (1 === args.length && Abs.isArray(args[0])) {
        ref = args[0];
    } else {
        if (Abs.isArray(args)) {
            ref = args;
        } else {
            ref = [args];
        }
    }
    return Abs.isArray(ref) ? ref.filter(item => undefined !== item) : [];
};
const _itObject = (object = {}, fnKv) => {
    const ref = object;
    // eslint-disable-next-line
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const item = object[key];
            ref[key] = ambKv(item, fnKv);
        }
    }
    return ref;
};

const _itArray = (array = [], fnKv) => {
    const result = [];
    array.forEach((each, index) => result[index] = ambKv(each, fnKv));
    return result;
};


/**
 * ## 「标准」`Ux.ambKv`
 *
 * 二义性遍历函数
 *
 * 1. 如果输入的是 Object，则直接遍历，并且传入参数`(key, value)`给 fnKv。
 * 2. 如果输入的的 Array，则遍历每一个 Object 元素，将元素的遍历信息`(key, value)`传入 fnKv。
 *
 * @memberOf module:_unity
 * @param {Object|Array} input 输入的被遍历的源
 * @param {Function} fnKv key=value 的处理函数
 * @return {any} 返回`fnKv`的执行结果
 */
const ambKv = (input, fnKv) => {
    /*
     * 先判断 Array，因为 Array 调用 isObject 也是 true
     */
    if (Abs.isArray(input)) {
        // 如果 $config 是一个 []
        return _itArray(input, fnKv);
    } else if (Abs.isObject(input)) {
        return _itObject(input, fnKv);
    } else {
        return fnKv(input);
    }
};


/**
 * ## 「标准」`Ux.ambEvent`
 *
 * 二义性Event读取专用函数
 *
 * 1. Input触发时，直接从`event.target.value`中读取相关数据。
 * 2. 表单直接触发或Select触发，则`event`就是value，包括`onSearch`，这种情况直接将`event`作为读取值。
 *
 * @memberOf module:_unity
 * @param {Event|Object} event 传入方法和Ant Design中常用的 event 参数`event.target`存在。
 * @param {Object} config 是否启用`prevent`属性，有些特殊情况不能调用`event.preventDefault`，默认关闭。
 * @param {any} defaultValue 默认值，如果没有读取到值则使用默认值
 * @return {any} 返回最终读取到的值。
 */
const ambEvent = (event, config = {}, defaultValue) => {
    let value;
    if (event && Abs.isFunction(event.preventDefault)) {
        const {prevent = true, checked = false} = config;
        if (prevent) {
            /*
             * 特殊情况才关闭默认的 preventDefault
             */
            event.preventDefault();
        }
        if (checked) {
            value = event.target.checked;
        } else {
            value = event.target.value;
        }
    } else {
        value = event;
    }
    /** 默认值设置 **/
    if (!value && undefined !== defaultValue) {
        value = defaultValue;
    }
    return value;
};


/**
 * ## 「标准」`Ux.ambObject`
 *
 * 二义性合并专用函数
 *
 * 1. 直接从 reference 的 props 或 state 中提取属性名为 `name` 的值。
 * 2. 如果无值则直接返回 `{}`。
 *
 * 框架内部代码：
 *
 * ```js
 *
 * const yoHistory = (reference) => {
 *     const $inited = Ux.ambObject(reference, "$inited");
 *     const {activity = {}, changes = []} = $inited;
 *     // 其他处理代码……
 * }
 * ```
 *
 * @memberOf module:_unity
 * @param {ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @return {any} 返回最终的值
 */
const ambObject = (reference = {}, name) => {
    const extracted = ambValue(reference, name);
    let values = {};
    if (Abs.isObject(extracted)) {
        Object.assign(values, extracted);
    }
    return values;
};
/**
 * ## 「标准」`Ux.ambFind`
 *
 * 二义性数据提取专用函数
 *
 * 1. 传入`key`和`name`，提取属性或状态之下的"对象包含的属性"值。
 * 2. 一级提取：可能返回Object，也可能返回DataObject。
 * 3. 二级提取：任意值。
 *
 * 框架内的使用代码如：
 *
 * ```js
 * const targetKey = attrPath[0];
 * const name = attrPath[1];
 * if (targetKey && name) {
 *     return Ele.ambFind(target, `$${targetKey}`, attrPath[1]);
 * } else {
 *     console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
 * }
 * ```
 *
 * @memberOf module:_unity
 * @param {Props|State} props 传入的React组件的状态或属性对象
 * @param {String} key 待提取的属性名或状态名称，提取内容必须是一个`Object`或者`DataObject`。
 * @param {Array|String} name 待提取的二级属性名
 * @return {any} 返回最终提取的值。
 */
const ambFind = (props = {}, key, name) => {
    const dataObj = props[key];
    let value;
    if (dataObj instanceof DataObject) {
        if (dataObj && dataObj.is()) {
            value = dataObj.find(name);
        }
    } else if (Abs.isObject(dataObj)) {
        if (dataObj && !Abs.isArray(dataObj)) {
            value = elementGet(dataObj, name);
        }
    }
    return value;
};
/**
 *
 * ## 「标准」`Ux.ambValue`
 *
 * 二义性专用提取数据函数
 *
 * 1. 先从 `props` 中提取属性为 name 的值。
 * 2. 如果无法从 `props` 中提取，则直接从 `state` 中提取对应的值。
 *
 * 框架内部代码：
 *
 * ```js
 *     const $submitting = Ele.ambValue(reference, "$submitting");
 * ```
 *
 * @memberOf module:_unity
 * @param {ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @return {any} 返回变量对应的值
 */
const ambValue = (reference = {}, name) => {
    const {props = {}, state = {}} = reference;
    if (undefined !== props[name]) {
        return props[name];
    } else {
        return state[name];
    }
};
// ------------------------------- O.element.js -----------------------------


/**
 * ## 「标准」`Ux.elementIndex`
 *
 * 数组索引查找元素，查找 field = value 的索引专用
 *
 * 1）查找1：传入了 field，直接查找 field = value 的元素所在的 index
 * 2）查找2：未传入 field，直接查找值（纯数组）
 *
 * @memberOf module:_element
 * @param {Array} array 被查找的数组
 * @param {String} field 字段名
 * @param {any} value 字段值
 * @returns {Number} 找到的索引
 */
const elementIndex = (array = [], value, field) => {
    let foundIndex = -1;
    array.forEach((each, index) => {
        if (field) {
            /* 第一种查找 */
            if (value === each[field]) {
                foundIndex = index;
            }
        } else {
            /* 第二种查找 */
            if (value === each) {
                foundIndex = index;
            }
        }
    });
    return foundIndex;
}

const elementGet = (data = {}, path) => {
    if ("string" === typeof path) {
        if (0 <= path.indexOf('.')) {
            return elementGet(data, path.split('.'));
        } else {
            return data[path];
        }
    } else {
        const item = Abs.immutable(data);
        return item.getIn(path);
    }
}
/**
 * ## 「标准」`Ux.elementWrap`
 *
 * 数组元素交换元素，将两个元素交换位置专用。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Number} fromIndex 交换的开始索引
 * @param {Number} toIndex 交换的结束索引
 * @return {Array} 返回原始数组引用
 */
const elementWrap = (array = [], fromIndex, toIndex) => {
    let from = array[fromIndex];
    if (from) {
        from = Abs.clone(from);
    }
    let to = array[toIndex];
    if (to) {
        to = Abs.clone(to);
    }
    if (from && to) {
        array[fromIndex] = to;
        array[toIndex] = from;
    }
    return array;
}
/**
 * ## 「标准」`Ux.elementUp`
 *
 * 在排序中上移
 *
 * @memberOf module:_element
 * @param {Array} array 被查找的数组
 * @param {String} field 字段名
 * @param {any} value 字段值
 * @returns {Number} 找到的索引
 */
const elementUp = (array = [], value, field) => {
    const result = Abs.clone(array);
    const index2 = elementIndex(array, value, field);
    const index1 = index2 - 1;
    result[index1] = result.splice(index2, 1, result[index1])[0];
    return result;
}
/**
 * ## 「标准」`Ux.elementUp`
 *
 * 在排序中下移
 *
 * @memberOf module:_element
 * @param {Array} array 被查找的数组
 * @param {String} field 字段名
 * @param {any} value 字段值
 * @returns {Number} 找到的索引
 */
const elementDown = (array = [], value, field) => {
    const result = Abs.clone(array);
    const index1 = elementIndex(array, value, field);
    const index2 = index1 + 1;
    result[index1] = result.splice(index2, 1, result[index1])[0];
    return result;
}

const elementOrder = (data = [], keys = [], keyField = "key") => {
    const ordered = [];
    keys.forEach(key => {
        const found = elementUnique(data, keyField, key);
        if (found) {
            ordered.push(found);
        }
    });
    return Abs.clone(ordered);
}

/**
 * ## 「标准」`Ux.elementFlat`
 *
 * 数组元素拉平函数，将一个完整的树拉平成不带树结构的数据，拉平的基础是以React中的`children`属性为基础，执行反复递归拉平
 * 处理，直到最后没有任何元素为止（最终的children长度为0，forEach不执行。）
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @return {Array} 返回拉平后的数组
 */
const elementFlat = (array = []) => {
    const result = [];
    array.forEach(item => {
        const {children, ...rest} = item;
        result.push(Abs.clone(rest));
        if (children && Abs.isArray(children)) {
            const flatted = elementFlat(children);
            flatted.forEach(pending => result.push(pending));
        }
    });
    return result;
};


/**
 * ## 「标准」`Ux.elementUnique`
 *
 * 在数组中查找唯一元素
 *
 * 1. 查找条件为`field = value`。
 * 2. 目前只支持单字段查找，查找到多个则直接返回第一个。
 *
 * 框架内的调用如
 *
 * ```js
 *     const found = Ux.elementUnique(nodes, 'identifier', identifier);
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {String} field 查找的字段名。
 * @param {any} value 作为条件的字段值。
 * @param {String} targetField 目标字段。
 * @returns {Object} 返回最终查找到的唯一元素Object。
 */
const elementUnique = (array = [], field = "", value, targetField) => {
    E.fxTerminal(!Abs.isArray(array), 10071, array, "Array");
    let reference = [];
    if (Abs.isObject(field)) {
        // Filter模式
        reference = elementFind(array, field);
    } else {
        reference = array.filter(item => value === item[field]);
    }
    E.fxTerminal(1 < reference.length, 10069, reference, 1);
    const found = 0 === reference.length ? undefined : reference[0];
    if (found) {
        if (targetField) {
            return found[targetField] ? found[targetField] : null;
        } else {
            return found;
        }
    }
};
/**
 * ## 「标准」`Ux.elementFirst`
 *
 * 防御式读取数组的第一个元素，可读取某个字段值，或者查询到数组中第一个元素信息。
 *
 * 1. 读取数组中的第一个元素。
 * 2. 根据传入的field返回不同的数据。
 *      1. 如果field有值，则返回这个字段对应的值。
 *      2. 如果field无值，则返回整个元素（单参数调用方法）。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息
 * @param {String} field 读取的字段名
 * @returns {any} 返回任意值
 */
const elementFirst = (array = [], field) => {
    const target = array[0];
    if (target) {
        if (Abs.isObject(target)) {
            /*
             *
             */
            return field ? target[field] : target;
        } else {
            return target;
        }
    }
}


/**
 * ## 「标准」`Ux.elementFind`
 *
 * 针对数组的查找操作，查找符合 filters 条件的数组，内部使用该函数的代码
 *
 * ```js
 * const _g6Find = ($data = [], identifier) => {
 *      const found = Ele.elementFind($data, {identifier});
 *      if (1 === found.length) {
 *          return found[0];
 *      } else {
 *          const filter = found.filter(item => item.leaf); // 叶节点优先
 *          if (1 === filter.length) {
 *              return filter[0];
 *          }
 *      }
 * };
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} filters 过滤专用键值对。
 * @param {Boolean} fuzzy 是否开启模糊查找
 * @return {Array} 返回查找到的数组信息，最终结果也是一个`[]`。
 */
const elementFind = (array = [], filters, fuzzy = false) => {
    E.fxTerminal(!Abs.isArray(array), 10071, array, "Array");
    let reference = array;
    if (filters) {
        // eslint-disable-next-line
        for (const field in filters) {
            if (filters.hasOwnProperty(field)) {
                // 这里用双等号匹配，用于检查字符串和数值的比较
                reference = reference.filter(item => {
                    const value = filters[field];
                    if (Abs.isArray(value)) {
                        return value.includes(item[field]);
                    } else {
                        if (fuzzy) {
                            if (item.hasOwnProperty(field)) {
                                return item[field] === value;
                            } else {
                                // 直接过滤掉
                                return true;
                            }
                        } else {
                            return item[field] === value;
                        }
                    }
                });
            }
        }
    }
    return reference;
};
/**
 * ## 「标准」`Ux.elementVertical`
 *
 * 针对数组执行映射操作，将垂直映射过的值合并成一个无重复元素的集合。
 *
 * ```js
 * const user = [
 *     {name:"lang1", email":"silentbalanceyh@126.com"},
 *     {name:"lang2", type:"employee"},
 *     {name:"lang3", type:"user"},
 *     {name:"lang4", type:"user"}
 * ]
 * const mapped = Ux.elementVertical(user, "type");
 * // 最终计算的值
 * // mapped = ["user", "employee"]
 * // 映射最终结果是一个 Array（无重复记录）
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息
 * @param {String} field 执行映射的字段名
 * @return {Array} 新字段值构造的最终集合
 */
const elementVertical = (array = [], field = "") => {
    E.fxTerminal(!Abs.isArray(array), 10071, array, "Array");
    let result = [];
    array.forEach(item => {
        if (item[field]) {
            if (!result.includes(item[field])) {
                result.push(item[field]);
            }
        }
    });
    return result;
};

/**
 * ## 「标准」`Ux.elementMap`
 *
 * 针对数组执行映射拉平操作，拉平过后的数据形成一个Map结构。
 *
 * ```js
 * const user = [
 *     {name:"lang1", email":"silentbalanceyh@126.com"},
 *     {name:"lang2", type:"employee"},
 *     {name:"lang3", type:"user"},
 *     {name:"lang4", type:"user"}
 * ]
 * const mapped = Ux.elementMap(user, "name");
 * // 最终计算的值
 * // mapped = {
 * //     "lang1": {},
 * //     "lang2": {},
 * //     ...
 * // }
 * // 映射最终结果是一个 Array（无重复记录）
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息
 * @param {String} field 执行映射的字段名
 * @return {Object} 返回Map过后的最终数据
 */
const elementMap = (array = [], field = "") => {
    E.fxTerminal(!Abs.isArray(array), 10071, array, "Array");
    let resultMap = {};
    array.forEach(item => {
        if (item[field]) {
            resultMap[item[field]] = Abs.clone(item);
        }
    });
    return resultMap;
}


/**
 * ## 「标准」`Ux.elementBranch`
 *
 * Zero UI中的树函数，从当前节点查找整个节点所在的分支数组（父节点、父父节点、…… 顶层祖辈），`elementBranch` 和 `elementChild` 为互逆函数。
 *
 * 1. 每个节点的默认主键字段为`key`。
 * 2. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {any} leafValue 被检索的子节点的值。
 * @param {String} parentField 检索树的父字段信息。
 * @return {Array} 返回分支的数组。
 */
const elementBranch = (array = [], leafValue, parentField = "parent") => {
    // 查找的最终结果
    let branch = [];
    // 查找子节点
    const obj = elementUnique(array, "key", leafValue);
    if (obj) {
        const target = Abs.clone(obj);//
        branch.push(target);
        // 查找父节点
        const pid = obj[parentField];
        branch = [].concat(elementBranch(array, pid, parentField)).concat(branch);
    }
    // console.info(found.map(item => elementUnique(array, "key", item)));
    return branch;
};

/**
 * ## 「标准」`Ux.elementParent`
 *
 * 在 elementBranch 基础之上删除掉当前节点的运算。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {any} leafValue 被检索的子节点的值。
 * @param {String} parentField 检索树的父字段信息。
 * @return {Array} 返回分支的数组。
 */
const elementParent = (array = [], leafValue, parentField = "parent") => {
    const normalized = elementBranch(array, leafValue, parentField);
    if (Abs.isArray(normalized)) {
        return normalized.filter(item => item.key !== leafValue);
    } else {
        return [];
    }
}


/**
 *
 * ## 「标准」`Ux.elementGroup`
 *
 * 按照某个字段对这个数组进行分组操作。
 *
 * ```js
 *
 * const input = [
 *      {"name": "lang", type: "user"},
 *      {"name": "lang2", type: "employee"},
 *      {"name": "lang3", type: "employee"}
 * ]
 * const grouped = Ux.elementGroup(input, "type");
 * ```
 *
 * 最终计算出来的`grouped`的数据结构如下：
 *
 * ```json
 * {
 *     "user": [
 *         {"name": "lang", type: "user"}
 *     ],
 *     "employee: [
 *         {"name": "lang2", type: "employee"},
 *         {"name": "lang3", type: "employee"}
 *     ]
 * }
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组
 * @param {String} field 分组专用的字段信息
 * @return {Object} 分组过后每一个键值对为`key = Array`
 */
const elementGroup = (array = [], field) => {
    let result = {};
    if (0 < array.length) {
        let $result = Abs.immutable(array).groupBy(item => item.get(field));
        if ($result) {
            result = $result.toJS();
        }
    }
    return result;
};


/**
 *
 * ## 「标准」`Ux.elementJoin`
 *
 * 两个数组的连接函数，将两个Array按field字段进行连接，如果存在该元素，则直接执行`Object.assign`的合并，
 * 如果没有找到该元素，则添加新元素，最终的结果以`target + source`的结果为主。
 *
 * @memberOf module:_element
 * @param {Array} target 被合并的数组
 * @param {Array} source 将被合并的数组
 * @param {String} field 合并字段
 * @returns {Array} 返回最终数据
 */
const elementJoin = (target = [], source = [], field = "key") => {
    const $target = Abs.clone(target);
    // 更新
    $target.forEach(merged => {
        const found = elementUnique(source, field, merged[field]);
        if (found) {
            Object.assign(merged, found);
        }
    });
    // 增加
    source.forEach(added => {
        const found = elementUnique(target, field, added[field]);
        if (!found) {
            $target.push(Abs.clone(added));
        }
    })
    return $target;
}


/**
 * ## 「标准」`Ux.elementGrid`
 *
 * 直接将 Array 拆分成一个 Grid 结构，生成矩阵模型。
 *
 * ```js
 * const array = [
 *      "A","B","C",
 *      "D","E","F",
 *      "G"
 * ]
 * const matrix = Ux.elementGrid(array,3);
 * ```
 *
 * 执行过后的数据结构如下：
 *
 * ```js
 * [
 *      [ "A", "B", "C" ],
 *      [ "D", "E", "F" ],
 *      [ "G" ]
 * ]
 * ```
 *
 * @memberOf module:_element
 * @param {Array} source 原始数组
 * @param {Number} columns 拆分成多少列
 */
const elementGrid = (source = [], columns) => {
    columns = valueInt(columns, 0);
    if (columns) {
        const grid = [];
        let index;
        let row = [];
        for (index = 1; index <= source.length; index++) {
            row.push(source[index - 1]);
            if (0 === index % columns) {
                grid.push(Abs.clone(row));
                row = [];
            }
        }
        if (0 < row.length) {
            grid.push(Abs.clone(row));
        }
        return grid;
    } else return Abs.clone(source);
}
/**
 * ## 「标准」`Ux.elementSave`
 *
 * 不重复添加某个元素，按field的执行唯一元素的判定，默认使用`key`字段。
 *
 * @memberOf module:_element
 * @param {Array} data 数组输入源头
 * @param {Object} item 被输入的记录集
 * @param {String} idField 主键字段
 * @return {Array} 返回合并后的数组
 */
const elementSave = (data = [], item, idField = "key") => {
    if (Abs.isArray(data) && item) {
        // 元素信息处理
        const found = elementUnique(data, idField, item[idField]);
        if (found) {
            Object.assign(found, item);
        } else {
            data.push(item);
        }
    }
    return data;
}
/**
 * ## 「标准」`Ux.elementConcat`
 *
 * 不重复添加某个元素，按field的执行唯一元素的判定，默认使用`key`字段。
 *
 * @memberOf module:_element
 * @param {Array} original 数组输入源头
 * @param {Array} current 被输入的记录集
 * @param {String} field 主键字段
 * @return {Array} 返回合并后的数组
 */
const elementConcat = (original = [], current = [], field) => {
    if (field) {
        const exist = original.map(item => item[field]).filter(item => !!item)
        const start = Abs.clone(original);
        current.filter(item => !exist.includes(item[field]))
            .forEach(item => start.push(item));
        return start;
    } else {
        return original.concat(current);
    }
}
// 上层

/**
 * ## 「标准」`Ux.merge`
 *
 * 执行Array和Object的双合并方法，生成合并过后的新对象专用，注意此处的Array必须是Object对象数组，且第三参在Array中生效。
 *
 * 1. 如果传入类型是Object：
 *      1. 如果original有值，则使用`Object.assign`生成新对象，既不改变原始的，也不改变新的。
 *      2. 如果original无值，则拷贝一个newValue新对象。
 * 2. 如果传入类型是Array：
 *      1. 如果original有值并且`0 < length`，则根据第三参field来执行合并操作，内部调用elementUnique专用方法。
 *      2. 如果newValue是数组，并且original长度为零或无值，则直接拷贝newValue。
 *
 * > 这个函数没有任何副作用，既不改变原始的original，也不改变newValue，为一个无副作用函数，最终返回的数据是拷贝的副本。
 *
 * @memberOf module:_primary
 * @param {Array|Object} original 原始数据结构
 * @param {Array|Object} newValue 更新后的数据结构
 * @param {String} field 如果是数组则按field合并
 * @returns {Array|Object} 返回合并后的值
 */
const merge = (original, newValue, field = "key") => {
    if (Abs.isArray(newValue)) {
        /*
         * 数组更新
         */
        let merged = [];
        if (original && 0 < original.length) {
            original.forEach(each => {
                /*
                 * 从新数据中查找
                 */
                const hit = elementUnique(newValue, field, each[field]);
                if (hit) {
                    merged.push(Object.assign({}, each, hit));
                } else {
                    merged.push(Abs.clone(each));
                }
            });
        } else {
            merged = Abs.clone(newValue);
        }
        return merged;
    } else {
        let merged = {};
        if (original) {
            merged = Object.assign({}, original, newValue);
        } else {
            merged = Abs.clone(newValue);
        }
        return merged;
    }
}

/**
 * ## 「标准」`Ux.elementChildTree`
 *
 * Zero UI中的树函数，在数组中查找当前节点的所有子节点信息，并且构成子树，`elementBranch` 和 `elementChildren` 为互逆函数。
 *
 * 1. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 * 2. 每个节点中有两个固定值
 *      1. key 表示每个节点的主键。
 *      2. children 表示每个节点中的子节点信息`[]`。
 * 3. 在每个节点中计算出 `_level` 参数表示生成树中每个节点所在树的`层级`。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildTree = (array = [], current = {}, parentField = "parent") => {
    const parentKey = current.key;
    if (!current._level) {
        current._level = 1;
    }
    let children = array
        .filter(each => each[parentField] === parentKey)
        .sort(St.sorterAscTFn('sort'));
    if (0 < children.length) {
        children.forEach(child => {
            child._level = current._level + 1;
            child.children = elementChildTree(array, child, parentField)
        });
    }
    return children;
};
/**
 * ## 「标准」`Ux.elementChildren`
 *
 * Zero UI中的树函数，在数组中查找当前节点的所有子节点，构成子列表（不是子树）。
 *
 * 1. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 * 2. 每个节点中有两个固定值
 *      1. key 表示每个节点的主键。
 *      2. children 表示每个节点中的子节点信息`[]`。
 * 3. 在每个节点中计算出 `_level` 参数表示生成树中每个节点所在树的`层级`。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildren = (array = [], current = {}, parentField = "parent") => {
    /*
     * 构造 Children 的树
     */
    const childrenTree = elementChildTree(array, current, parentField);
    /*
     * 只查找 children，不包含当前节点
     */
    const fnChildren = (item = {}) => {
        let children = [];
        if (item.children && 0 < item.children.length) {
            children = children.concat(item.children);
            item.children.forEach(each => {
                const found = fnChildren(each);
                children = children.concat(found);
            });
        }
        return children;
    }
    const result = [];
    childrenTree.forEach(child => {
        result.push(child);
        const foundArray = fnChildren(child);
        if (foundArray && 0 < foundArray.length) {
            foundArray.forEach(eachFound => result.push(eachFound));
        }
    });
    return result;
}
// eslint-disable-next-line import/no-anonymous-default-export
/*
 * 变量名与element方法冲突
 */
//let document;
export default {
    // O.object.js
    valueAppend,
    valueValid,
    valuePath,

    // O.event.js
    valueOnChange,

    // O.pinyin.js
    valuePinyin,

    // O.date.js
    valueStartTime,
    valueDuration,
    valueEndTime,
    valueNow,
    valueTimes,
    valueTime,

    // O.single.js
    valueParse,
    valueInt,
    valueFloat,
    valueFactor,
    valuePair,
    valueLimit,
    valueCopy,
    valueOk,
    // O.tree
    valueLadder,

    // O.to
    toArray,
    toJson,
    toTime,
    Moment: (input = {}, config = {}) => ({
        to: (...fields) => _Moment.to.apply(null, [input, config].concat(fields)),
        from: (...fields) => _Moment.from.apply(null, [input, config].concat(fields))
    }),

    // O.arguments.js
    /*
     * 二义性处理，最终转换成数组
     * 1.变参第一个参数是数组，则转换成数组
     * 2.传入的参数就是数组，则直接转换成数组
     * 3.传入其他的非数组，则直接加上 [] 转换成数组
     */
    ambArray,
    /*
     * 二义性遍历，直接提取最终的 key = value
     * 1.如果是 Object，遍历每一对 key = value
     * 2.如果是 Array，先遍历每一个元素，然后 key = value（也就是每个元素中的 key = value）
     * 3.如果 Array 和 Object 相互包含，则递归
     */
    ambKv,
    /*
     * 1.如果 event 是常用的 event.preventDefault 的检查（原生事件），读取 event.target.value
     * 2.如果并不是则直接返回 event
     * 3.如果值不存在，则考虑使用 defaultValue
     */
    ambEvent,
    /*
     * 二义性路径检索
     * 1. 直接读取 props 中，或者 state 中的 key 相关数据
     * 2. 如果读取的数据是 DataObject，则调用 _(name) 读取数据
     * 3. 如果是 Object （非数组），则直接读取 obj[name] 的值
     */
    ambFind,
    /*
     * 二义性读取 对应变量信息
     * 1. 这个方法内置可调用 ambValue
     * 2. 直接提取 props / state 中的name属性
     * 3. 只有 object 类型的数据会返回，否则会返回 {}
     */
    ambObject,
    /*
     * 二义性检索 对应变量信息
     * 1. 这个方法和 ambObject 唯一不同的是，该方法可返回所有类型值
     * 2. 并且只有 undefined 不会返回
     */
    ambValue,

    /* O.element.js */
    /**
     * # 「标准」`Ux.element`
     *
     * 等价于 document.getElementById 读取HTML元素。
     *
     * @memberOf module:_primary
     * @param {String} id HTML元素的ID值
     * @returns {HTMLElement}
     */
    element: (id) => document.getElementById(id),
    elementJoin,
    elementFlat,
    elementWrap,
    elementIndex,
    elementUnique,
    elementFirst,
    elementFind,
    elementVertical,
    elementMap,
    elementGroup,
    elementGrid,
    elementUp,
    elementDown,
    elementOrder,
    elementConcat,
    elementGet,
    // 树操作
    elementBranch,
    elementParent,
    // 增删改
    elementSave,
    elementChildTree,
    elementChildren,
    // 下层升级函数
    merge
}