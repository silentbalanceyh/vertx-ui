// 特殊排序法则
import __Zo from 'zo';
import __Zn from 'zone';
import __Zi from 'zi';

/**
 *
 * ## 「标准」`Ux.valueArray`
 *
 * 对数据进行规范化解析，确保转换过后的一定是 Array 。
 * 1. 如果 input = undefined，返回 []
 * 2. 如果 input = Array，直接返回
 * 3. 如果 input = Object，则检查 list 节点（必须是Array）
 *
 * @memberOf module:value/zone
 * @param {any} input 输入的数据
 * @returns {Array} 返回转换好的Array
 */
const valueArray = (input) => __Zn.valueArray(input);
/**
 *
 * ## 「标准」`Ux.valuePinyin`
 *
 * 将汉字转换成拼音，在某些场景中，中文字转换成拼音后可根据拼音的字典序进行排列，这是业务场景所必须的，这种转换
 * 也是有必要的，而系统中主要使用了`js-pinyin`模块实现直接转换，封装了第三方库。
 *
 * 示例：
 * ```js
 * const name = "虞浪";
 * const pinyin = Ux.valuePinyin(name);
 * ```
 * 返回结果：
 * ```js
 * pinyin => "yulang"
 * ```
 *
 * @memberOf module:value/zone
 * @param {String} input 输入的数据
 * @returns {String} 返回转换好的拼音信息
 */
const valuePinyin = (input) => __Zn.valuePinyin(input);
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
 *
 * 除了顶层Object以外它的子对象也会实现合并追加流程，而`Ux.valueAppend`是单纯的值追加过程，只在当前传入对象中追加
 *
 * 是否包含了field的情况。
 *
 * 示例：
 * ```js
 * const item = {
 *     "name": "emma",
 *     "phone": "13550878787"
 * }
 * Ux.valueAppend(item, "age", 18);
 * ```
 * 上述代码执行过后
 * ```js
 * item = {
 *     "name": "emma",
 *     "phone": "13550878787",
 *     "age": 18
 * }
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} item 被追加字段的对象引用
 * @param {String} field 将要追加的字段名
 * @param {any} value 将要追加的字段值
 */
const valueAppend = (item = {}, field = "", value) =>
    __Zn.valueAppend(item, field, value);

/**
 * ## 「标准」`Ux.valueValid`
 *
 * 将输入数据处理成合法对象，两种模式处理对象Object，由于后端无法识别某些值，所以执行下边处理
 *
 * 1. 宽模式，0, null, undefined，false 都会被移除，包括 ""。
 * 2. 严格模式，仅移除 undefined，其他的保留。
 *
 * ```js
 * const data = {
 *      "username": "Lang",
 *      "email": null,
 *      "age": 0,
 *      "active": false,
 *      "address": undefined
 * }
 * // 宽模式
 * const data1 = Ux.valueValid(data, true);
 * // 严模式
 * const data2 = Ux.valueValid(data);
 * ```
 * 最终结果
 * ```js
 * data1 = {
 *       "username": "Lang"
 *  }
 * data2 = {
 *       "username": "Lang",
 *       "email": null,
 *       "age": 0,
 *       "active": false
 *  }
 *
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} data 输入的Object对象。
 * @param {boolean} wild 是否使用宽模式。
 * @returns {Object} 返回处理好的数据。
 */
const valueValid = (data = {}, wild) => __Zn.valueValid(data, wild);
/**
 * ## 「标准」`Ux.valuePath`
 *
 * 对象树检索专用函数，可根据 path 检索对象树
 *
 * 示例：
 * ```js
 * const user = {
 *     "teacher":{
 *         "son":{
 *             "username": "Lang"
 *         }
 *     }
 * }
 * const teacher = Ux.valuePath(user, "teacher");
 * const son = Ux.valuePath(user, "teacher.son");
 * const username = Ux.valuePath(user, "teacher.son.username");
 * ```
 * 返回结果：
 * ```js
 * teacher = { "son":{ "username": "Lang" } }
 * son = { "username": "Lang"}
 * username = "Lang"
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} data 将要搜索的对象。
 * @param {String} path 路径必须是一个字符串，并且包含`.`格式。
 * @return {null|any} 返回最终搜索到的值，否则为 null。
 */
const valuePath = (data = {}, path) => __Zn.valuePath(data, path);

/**
 * ## 「标准」`Ux.valueDatetime`
 *
 * 时间转换标准函数，将字符串格式的对象转换成合法 Dayjs 对象，返回失败则报错。
 *
 * 示例写法：
 * ```js
 * const now = Ux.valueDatetime(Ux.valueNow("HH:mm:ss"), "HH:mm:ss");
 * ```
 *
 * 可支持的 format 格式信息详见 Ux.valueNow 。
 *
 * @memberOf module:value/zone
 * @param {String} value 被转换的字符串。
 * @param {String} format Dayjs可解析的格式信息，默认ISO。
 * @return {Dayjs} 返回转换后的 Dayjs 对象。
 */
const valueDatetime = (value, format) => __Zn.valueDatetime(value, format);

/**
 * ## 「标准」`Ux.valueJDatetime`
 *
 * 时间转换专用函数，将对象中的 Object 中所有 `fields` 字段转换成时间格式。
 *
 * > 这个函数只支持 ISO 格式，批量转换对象中的字段。
 *
 * 示例：
 * ```js
 * const value = {
 *     cretedAt: "xxx",
 *     updatedAt: "xxx"
 * }
 * // 下列代码会将 value 对象中的 cretedAt 和 updatedAt 字段信息均转换为 ISO 的时间格式。
 * const value2 = Ux.valueJDatetime(value, "cretedAt", "updatedAt");
 * // 等价于
 * const value2 = Ux.valueJDatetime(value, ["cretedAt", "updatedAt"]);
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} data 被转换的对象数据。
 * @param {String[]} fields 被转换对象的字段数组信息。
 * @return {Object} 被转换后的对象数据
 */
const valueJDatetime = (data = {}, ...fields) => __Zn.valueJDatetime.apply(this, [data].concat(fields));


/**
 * ## 「标准」`Ux.valueDuration`
 *
 * 根据from和to计算中间的duration差值。
 *
 * 支持8种计算模式，如下表所示：(各个传入的模式对大小写不敏感，支持缩写和复数。）
 * |模式|缩写|复数|描述|
 * |---|---|---|:---|
 * |date|D|dates|日期|
 * |day|d|days|星期(星期日0，星期六6)|
 * |month|M|months|月份(0-11)|
 * |year|y|years|年|
 * |hour|h|hours|小时|
 * |minute|m|minutes|分钟|
 * |second|s|seconds|秒|
 * |millisecond|ms|milliseconds|毫秒|
 *
 * 示例：
 * ```js
 * const startDate = "2022-06-05";
 * const mode = "month";
 * const endDate = "2023-01-25";
 * const duration = Ux.valueDuration(startDate, endDate, mode);
 * ```
 * 返回结果：
 * ```js
 * duration => 7
 * ```
 *
 * @memberOf module:value/zone
 * @param {String|Dayjs} from 开始时间
 * @param {String|Dayjs} to 结束时间
 * @param {String} mode 计算模式
 * @return {number} 返回最终的计算数值
 */
const valueDuration = (from, to, mode = 'day') =>
    __Zn.valueDuration(from, to, mode);


/**
 * ## 「标准」`Ux.valueEndTime`
 *
 * 根据开始时间、间隔、模式计算结束时间
 *
 * 支持8种模式，如下表所示：(各个传入的模式对大小写不敏感，支持缩写和复数。）
 * |模式|缩写|复数|描述|
 * |---|---|---|:---|
 * |date|D|dates|日期|
 * |day|d|days|星期(星期日0，星期六6)|
 * |month|M|months|月份(0-11)|
 * |year|y|years|年|
 * |hour|h|hours|小时|
 * |minute|m|minutes|分钟|
 * |second|s|seconds|秒|
 * |millisecond|ms|milliseconds|毫秒|
 *
 * 示例：
 * ```js
 * const startDate = "2023-06-04 19:06:55";
 * const mode1 = "year";
 * const endDate1 = Ux.valueEndTime(startDate, 7, mode1);
 * const mode2 = "hour";
 * const endDate2 = Ux.valueEndTime(startDate, 7, mode2);
 * ```
 * 返回结果：
 * ```js
 * endDate1 => "2024-01-04 19:06:55"
 * endDate2 => "2023-06-05 02:06:55"
 * ```
 *
 * @memberOf module:value/zone
 * @param {String|Dayjs} from 开始时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Dayjs} 返回结束时间
 */
const valueEndTime = (from, duration, mode = 'day') =>
    __Zn.valueEndTime(from, duration, mode);


/**
 * ## 「标准」`Ux.valueStartTime`
 *
 * 根据结束时间、间隔、模式计算开始时间
 *
 * 支持8种模式，如下表所示：(各个传入的模式对大小写不敏感，支持缩写和复数。）
 * |模式|缩写|复数|描述|
 * |---|---|---|:---|
 * |date|D|dates|日期|
 * |day|d|days|星期(星期日0，星期六6)|
 * |month|M|months|月份(0-11)|
 * |year|y|years|年|
 * |hour|h|hours|小时|
 * |minute|m|minutes|分钟|
 * |second|s|seconds|秒|
 * |millisecond|ms|milliseconds|毫秒|
 *
 * 示例：
 * ```js
 * const endDate = "2023-06-04 19:06:55";
 * const mode1 = "year";
 * const startDate1 = Ux.valueStartTime(endDate, 7, mode1);
 * const mode2 = "hour";
 * const startDate2 = Ux.valueStartTime(endDate, 7, mode2);
 * ```
 * 返回结果：
 * ```js
 * startDate1 => "2022-11-04 19:06:55"
 * startDate2 => "2023-06-04 12:06:55"
 * ```
 *
 * @memberOf module:value/zone
 * @param {String|Dayjs} to 结束时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Dayjs} 返回开始时间
 */
const valueStartTime = (to, duration, mode = 'day') =>
    __Zn.valueStartTime(to, duration, mode);
/**
 * ## 「标准」`Ux.valueNow`
 *
 * 返回当前时间，直接得到 Dayjs 对象。
 *
 * 如果没有传 pattern 参数，则默认返回 ISO 8601 字符串。
 *
 * 示例（假设当前时间为2019-01-25 00:00:00)
 * ```js
 * const dateNow = Ux.valueNow();
 * // 执行上述代码之后，dateNow = '2019-01-25T02:00:00.000Z'
 * ```
 *
 * 可支持的格式化占位符列表如下：
 * |标识|示例|描述|
 * |---|---|:---|
 * |YY|18|年，两位数|
 * |YYYY|2018|年，四位数|
 * |M|1-12|月，从1开始|
 * |MM|01-12|月，两位数|
 * |MMM|Jan-Dec|月，英文缩写|
 * |MMMM|January-December|月，英文全称|
 * |D|1-31|日|
 * |DD|01-31|日，两位数|
 * |d|0-6|一周中的一天，星期天是0|
 * |dd|Su-Sa|最简写的星期几|
 * |ddd|Sun-Sat|简写的星期几|
 * |dddd|Sunday-Saturday|星期几，英文全称|
 * |H|0-23|小时|
 * |HH|00-23|小时，两位数|
 * |h|1-12|小时，12小时制|
 * |hh|01-12|小时，12小时制，两位数|
 * |m|0-59|分钟|
 * |mm|00-59|分钟，两位数|
 * |s|0-59|秒|
 * |ss|00-59|秒，两位数|
 * |S|0-9|毫秒（十），一位数|
 * |SS|00-99|毫秒（百），两位数|
 * |SSS|000-999|毫秒，三位数|
 * |Z|-05:00|UTC的偏移量，±HH:mm|
 * |ZZ|-0500|UTC的偏移量，±HHmm|
 * |A|AM/PM|上/下午，大写|
 * |a|am/pm|上/下午，小写|
 * |Do|1st...31st|月份的日期与序号|
 * |...|...|其他格式（依赖 AdvancedFormat 插件 )|
 *
 * @memberOf module:value/zone
 * @param {String} pattern 可支持的时间格式。
 * @return {Dayjs} 返回合法的 Dayjs 对象。
 */
const valueNow = (pattern) => __Zn.valueNow(pattern);

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
 * @memberOf module:value/zone
 * @param {String} literal 被转换的字符串
 * @param {Number} dft 转换失败的默认值
 * @return {Number} 返回转换后的数值
 */
const valueInt = (literal = "", dft = 0) => __Zn.valueInt(literal, dft)
/**
 * ## 「标准」`Ux.valueFloat`
 *
 * 将一个字符串转换成合法浮点数，保证转换成功，如果出现转换失败，取默认值。
 *
 * 示例：
 * ```js
 * const valid = "12.1";
 * const okValue = Ux.valueFloat(valid, 0.0, 1);
 *
 * const invalid = null;
 * const koValue = Ux.valueFloat(invalid, 0.00);
 *
 * // 最终结果
 * // okValue 的值为 12.1
 * // koValue 的值为 0.00
 * ```
 *
 * @memberOf module:value/zone
 * @param {String} literal 被转换的字符串
 * @param {Number} dft 转换失败的默认值
 * @param {Number} digest 小数点之后的位数
 * @return {Number} 返回最终浮点数
 */
const valueFloat = (literal, dft = 0.0, digest = 2) => __Zn.valueFloat(literal, dft, digest);
/**
 * ## 「标准」`Ux.valueBoolean`
 *
 * 将输入的数据转换为 boolean 类型。
 *
 * 示例：
 * ```js
 * const value1 = "true";
 * const output1 = Ux.valueBoolean(value1);
 *
 * const value2 = "123";
 * const output2 = Ux.valueBoolean(value2);
 *
 * // 最终结果
 * // output1 的值为 true
 * // output2 的值为 false
 * ```
 *
 * @memberOf module:value/zone
 * @param {any} literal 待转换的输入数据
 * @returns {boolean} 转换后的 boolean 值
 */
const valueBoolean = (literal) => __Zn.valueBoolean(literal);
/**
 * ## 「标准」`Ux.valueFactor`
 *
 * 因子计算函数，将一个带 `%` 号的字符串转换成浮点数，转换不成功则返回 undefined 。
 *
 * 示例：
 * ```js
 * const item = "62.5%";
 * const value = Ux.valueFactor(item);
 *
 * // value 的值为 0.625
 * ```
 *
 * @memberOf module:value/zone
 * @param {String} literal 将要被转换的字符串
 * @return {Number} 返回最终转换后的浮点数
 */
const valueFactor = (literal = "") => __Zn.valueFactor(literal);


/**
 * ## 「标准」`Ux.valuePair`
 *
 * 表达式解析成对象的专用函数
 *
 * 1. 如果 expr 是 String 则执行解析。
 * 2. 如果 expr 是 Object类型，则直接返回 expr 这个对象。
 *
 * 注意：如果值里面本身包含了逗号，则需要用markdown专用的语法对逗号进行转换。
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
 * @memberOf module:value/zone
 * @param {String} expr 表达式信息，可能包含键值对：`name1=value1,name2=value2`。
 * @return {Object} 返回转换好的对象
 */
const valuePair = (expr) => __Zn.valuePair(expr);


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
 *      <Input.Group {...$attrs} className={"ux_table-transfer"}>
 *          <Table {...fromTable} dataSource={from}/>
 *          <Filter config={config} reference={this}/>
 *          <Table {...toTable} dataSource={to}/>
 *      </Input.Group>
 * );
 * ```
 *
 * @memberOf module:value/zodiac
 * @param {Object} jsx 处理React中的jsx继承属性专用
 * @return {Object} 返回最终将要继承的属性信息
 */
const valueLimit = (jsx = {}) => __Zo.yoLimit(jsx);
/**
 * ## 「标准」`Ux.valueCopy`
 *
 * 该函数负责将 `field` 字段中的信息从 source 拷贝到 target 中。
 *
 * 1. field 为 String：拷贝单个字段数据
 * 2. field 为 Array：拷贝多个字段数据
 * 3. 如果读取的数据为 Object / Array 则采用深度拷贝
 *
 * 示例：
 * ```js
 * const params1 = {
 *     "orderId": "239975a7-f164-43b3-a9d1-4516f98c1948",
 *     "amount": 120,
 *     "signMobile": "18604409876",
 *     "indent": "NUM.PAYBILL",
 *     "language": "cn",
 *     "level": 2,
 *     "name": "ox.rbac.role"
 * }
 * const params2 = {
 *     "language": "en",
 *     "level": 3,
 *     "name": "ox.rbac.role"
 * }
 * const value = Ux.valueCopy(params1, [
 *         "orderId",
 *         "amount",
 *         "signMobile",
 *         "indent"
 *     ], params2);
 * ```
 * 执行上述代码之后的结果：
 * ```js
 * value = {
 *     "orderId": "239975a7-f164-43b3-a9d1-4516f98c1948",
 *     "amount": 120,
 *     "signMobile": "18604409876",
 *     "indent": "NUM.PAYBILL",
 *     "language": "en",
 *     "level": 3,
 *     "name": "ox.rbac.role"
 * }
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} target 拷贝目标对象
 * @param {Object} source 拷贝源对象
 * @param {String |Array} field 需要拷贝的字段信息
 * @return {Object} 最终拷贝过后的对象
 */
const valueCopy = (target = {}, source = {}, field) =>
    __Zn.valueCopy(target, source, field);
/**
 * ## 「引擎」`Ux.valueOk`
 *
 * 该函数负责将 `field` 字段中的信息从 source 拷贝到 target 中。
 *
 * 1. field 为 String：拷贝单个字段数据
 * 2. field 为 Array：拷贝多个字段数据
 * 3. 如果读取的数据为 Array 则采用深度拷贝
 *
 * 示例：
 * ```js
 * const params1 = {
 *     "orderId": "239975a7-f164-43b3-a9d1-4516f98c1948",
 *     "amount": 120,
 *     "signMobile": "18604409876",
 *     "indent": "NUM.PAYBILL",
 *     "language": "cn",
 *     "level": 2,
 *     "name": "ox.rbac.role"
 * }
 * const params2 = {
 *     "language": "en",
 *     "level": 3,
 *     "name": "ox.rbac.role"
 * }
 * const value = Ux.valueOk(params1, [
 *         "relatedId,orderId",
 *         "amount",
 *         "signMobile",
 *         "indent=NUM.SETTLEMENT"
 *     ], params2);
 * ```
 * 执行上述代码之后的结果：
 * ```js
 * value = {
 *     "relatedId": "239975a7-f164-43b3-a9d1-4516f98c1948",
 *     "amount": 120,
 *     "signMobile": "18604409876",
 *     "indent": "NUM.SETTLEMENT",
 *     "language": "en",
 *     "level": 3,
 *     "name": "ox.rbac.role"
 * }
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} input 拷贝源对象
 * @param {Array|String} config 需要拷贝的字段信息
 * @param {Object} output 拷贝目标对象（可选）
 * @return {Object} 最终拷贝过后的对象
 */
const valueOk = (input = {}, config = [], output) =>
    __Zn.valueOk(input, config, output);
/**
 * ## 「标准」`Ux.valueLink`
 *
 * ### vConn = true
 *
 * ```js
 * M1 = {
 *     "k1": "v1",
 *     "k2": "v2"
 * },
 *
 * M2 = {
 *     "v1": "value1",
 *     "v2": "value2"
 * }
 *
 * R = {
 *     "k1": "value1",
 *     "k2": "value2"
 * }
 * ```
 *
 * ### vConn = false
 *
 * ```js
 * M1 = {
 *     "k1": "v1",
 *     "k2": "v2"
 * },
 *
 * M2 = {
 *     "k1": "value1",
 *     "k2": "value2"
 * }
 *
 * R = {
 *     "v1": "value1",
 *     "v2": "value2"
 * }
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} from 拷贝源对象
 * @param {Object} to 拷贝目标对象
 * @param {Boolean} vConn 选择操作模式
 * @return {Object} 最终拷贝过后的对象
 */
const valueLink = (from = {}, to = {}, vConn = false) =>
    __Zn.valueLink(from, to, vConn);
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
 * @memberOf module:value/zone
 * @param {Object} item 输入对象处理
 * @return {Object} 返回最终构造的对象信息
 */
const valueLadder = (item = {}) => __Zn.valueLadder(item);
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
 * 示例：
 * ```js
 * const value = "PROP:app.mHotel.key";
 * const outValue = Ux.valueParse(value);
 * ```
 * 最终解析成：
 * ```json
 * {
 *     "type": "PROP",
 *     "expression": "app.mHotel.key"
 * }
 * ```
 *
 * @memberOf module:value/zone
 * @param {String} valueOrExpr 表达式信息
 * @returns {Object} 计算表达式的解析结果。
 */
const valueParse = (valueOrExpr) => __Zn.valueParse(valueOrExpr);


/**
 * ## 「标准」`Ux.toJson`
 *
 * 内部直接调用`JSON.parse`解析，将字符串转换成对象，如果转换出错则直接返回`null`值。
 *
 * @memberOf module:to/zone
 * @param {any} input 传入的被转换对象。
 * @return {null|any} 转换出来的Json对象。
 */
const toJson = (input) => __Zn.toJson(input);
/**
 * ## 「标准」`Ux.toColor`
 *
 * @memberOf module:to/zone
 * @param current
 * @param mode
 * @returns {*}
 */
const toColor = (current, mode = "KFC_8") => __Zn.toColor(current, mode);
/**
 * ## 「标准」`Ux.toTime`
 *
 * 设置 moment 对象中的固定时间信息（设置时、分、秒），根据 `timeStr` 进行日期格式解析。
 *
 * @memberOf module:to/zone
 * @param {Dayjs} momentValue 被转换的合法的 moment 对象。
 * @param {String | Dayjs} timeStr 传入的合法日期时间格式。
 * @return {Dayjs} 返回一个合法的 moment 对象。
 */
const toTime = (momentValue, timeStr) =>
    __Zn.toTime(momentValue, timeStr);
/**
 * ## 「标准」`Ux.toKV`
 *
 * Object -> key, value 只有一组
 *
 * @memberOf module:to/zone
 * @param {Object} input
 */
const toKV = (input) => __Zn.toKV(input);
/**
 * ## 「标准」`Ux.toArray`
 *
 * 将数据转换成标准的JavaScript数组：
 *
 * 1. 如果是Array则直接返回副本。
 * 2. 如果是Set类型则将Set转换成Array的副本。
 * 3. 如果是非集合类型的数据，则直接加入`[]`符号来生成新数组。
 *
 * @memberOf module:to/zone
 * @param {any} input
 * @param {Number} column
 * @return {Array}
 *
 */
const toArray = (input, column) => __Zn.toArray(input, column);
/**
 * ## 「标准」`Ux.toUri`
 *
 * @memberOf module:to/zion
 * @param uri
 * @param $app
 * @returns {String}
 */
const toUri = (uri, $app) => __Zi.toUri(uri, $app);

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
 * @memberOf module:amb/zone
 * @method ambArray
 * @param {any[]|Array} args 传入的二义性参数信息
 * @return {Array} 返回最终的数组信息
 */
const ambArray = __Zn.ambArray;

/**
 * ## 「标准」`Ux.ambKv`
 *
 * 二义性遍历函数
 *
 * 1. 如果输入的是 Object，则直接遍历，并且传入参数`(key, value)`给 fnKv。
 * 2. 如果输入的的 Array，则遍历每一个 Object 元素，将元素的遍历信息`(key, value)`传入 fnKv。
 *
 * @memberOf module:amb/zone
 * @param {Object|Array} input 输入的被遍历的源
 * @param {Function} fnKv key=value 的处理函数
 * @return {any} 返回`fnKv`的执行结果
 */
const ambKv = (input, fnKv) => __Zn.ambKv(input, fnKv);


/**
 * ## 「标准」`Ux.ambEvent`
 *
 * 二义性Event读取专用函数
 *
 * 1. Input触发时，直接从`event.target.value`中读取相关数据。
 * 2. 表单直接触发或Select触发，则`event`就是value，包括`onSearch`，这种情况直接将`event`作为读取值。
 *
 * @memberOf module:amb/zone
 * @param {Event|Object} event 传入方法和Ant Design中常用的 event 参数`event.target`存在。
 * @param {Object} config 是否启用`prevent`属性，有些特殊情况不能调用`event.preventDefault`，默认关闭。
 * @param {any} defaultValue 默认值，如果没有读取到值则使用默认值
 * @return {any} 返回最终读取到的值。
 */
const ambEvent = (event, config = {}, defaultValue) =>
    __Zn.ambEvent(event, config, defaultValue);

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
 * @memberOf module:amb/zone
 * @param {Props|State} props 传入的React组件的状态或属性对象
 * @param {String} key 待提取的属性名或状态名称，提取内容必须是一个`Object`或者`DataObject`。
 * @param {Array|String} name 待提取的二级属性名
 * @return {any} 返回最终提取的值。
 */
const ambFind = (props = {}, key, name) => __Zn.ambFind(props, key, name);
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
 * @memberOf module:amb/zone
 * @param {Object|ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @param {Boolean} propFirst 判断优先级，默认优先级 props
 * @return {any} 返回变量对应的值
 */
const ambValue = (reference = {}, name, propFirst = true) =>
    __Zn.ambValue(reference, name, propFirst);
/**
 * ## 「标准」`Ux.ambDatetime`
 *
 * @memberOf module:amb/zone
 * @param input
 * @param fields
 * @param source
 */
const ambDatetime = (input, fields = [], source) =>
    __Zn.ambDatetime(input, fields, source);
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
 * 该方法可确保函数永远返回一个合法的Object，而不受其他数据干扰，最终应用于一些常用的默认值为`{}`的场景。
 *
 * @memberOf module:amb/zone
 * @param {Object|ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @param {Boolean} propFirst 判断优先级，默认优先级 props
 * @return {Object} 返回最终的值
 */
const ambObject = (reference = {}, name, propFirst = true) =>
    __Zn.ambObject(reference, name, propFirst);
/**
 * ## 「标准」`Ux.ambAnnex`
 *
 * 该方法是一个合并方法，替换原始方法中的`Ux.pass`函数，主要逻辑如下：
 * 1. 在`props`和`state`中提取Object类型的变量，并执行合并
 * 2. 如果 propFirst = true，则属性中的Object类型变量优先，最终结果使用 props -> state 的合并
 * 3. 如果 propFirst = false, 则状态中的Object类型变量优先，最终结果则使用 state -> props 的合并
 *
 * 注意 props 中的内容是不可变更的，这种情况下，此处需要拷贝新对象返回，最终形成合并结果，
 * 如果其中一方没有值，则两个值会同态合并，无影响
 *
 * @memberOf module:amb/zone
 * @param {Object|ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名
 * @param {Boolean} propFirst 属性优先还是状态优先
 * @return {Object} 返回最终的值
 *
 */
const ambAnnex = (reference = {}, name, propFirst = true) =>
    __Zn.ambAnnex(reference, name, propFirst);
/**
 * ## 「标准」`Ux.ambWide`
 *
 * @memberOf module:amb/zodiac
 * @param reference
 * @param name
 * @param propFirst
 * @returns {*}
 */
const ambWide = (reference = {}, name, propFirst = true) =>
    __Zo.ambWide(reference, name, propFirst);
// ------------------------------- O.abstract.element.js -----------------------------


/**
 * ## 「标准」`Ux.elementIndex`
 *
 * 数组索引查找元素，查找 field = value 的索引专用
 *
 * 1）查找1：传入了 field，直接查找 field = value 的元素所在的 index
 * 2）查找2：未传入 field，直接查找值（纯数组）
 *
 * @memberOf module:element/zone
 * @param {Array} array 被查找的数组
 * @param {String} field 字段名
 * @param {any} value 字段值
 * @returns {Number} 找到的索引
 */
const elementIndex = (array = [], value, field) => __Zn.elementIndex(array, value, field);
/**
 * ## 「标准」 `Ux.elementGet`
 *
 * @memberOf module:element/zone
 * @param data
 * @param path
 * @returns {*}
 */
const elementGet = (data = {}, path) => __Zn.elementGet(data, path);
/**
 * ## 「标准」`Ux.elementWrap`
 *
 * 数组元素交换元素，将两个元素交换位置专用。
 *
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {Number} fromIndex 交换的开始索引
 * @param {Number} toIndex 交换的结束索引
 * @return {Array} 返回原始数组引用
 */
const elementWrap = (array = [], fromIndex, toIndex) =>
    __Zn.elementWrap(array, fromIndex, toIndex);
/**
 * ## 「标准」`Ux.elementUp`
 *
 * 在排序中上移
 *
 * @memberOf module:element/zone
 * @param {Array} array 被查找的数组
 * @param {any} value 字段值
 * @param {String} field 字段名
 * @returns {Number} 找到的索引
 */
const elementUp = (array = [], value, field) =>
    __Zn.elementUp(array, value, field);
/**
 * ## 「标准」`Ux.elementUp`
 *
 * 在排序中下移
 *
 * @memberOf module:element/zone
 * @param {Array} array 被查找的数组
 * @param {any} value 字段值
 * @param {String} field 字段名
 * @returns {Number} 找到的索引
 */
const elementDown = (array = [], value, field) =>
    __Zn.elementDown(array, value, field);
/**
 * ## 「标准」 `Ux.elementOrder`
 *
 * @memberOf module:element/zone
 * @param data
 * @param keys
 * @param keyField
 * @returns {*}
 */
const elementOrder = (data = [], keys = [], keyField = "key") =>
    __Zn.elementOrder(data, keys, keyField);

/**
 * ## 「标准」`Ux.elementFlat`
 *
 * 数组元素拉平函数，将一个完整的树拉平成不带树结构的数据，拉平的基础是以React中的`children`属性为基础，执行反复递归拉平
 * 处理，直到最后没有任何元素为止（最终的children长度为0，forEach不执行。）
 *
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @return {Array} 返回拉平后的数组
 */
const elementFlat = (array = []) =>
    __Zn.elementFlat(array);
/**
 * ## 「标准」`Ux.elementFlip`
 *
 * 执行数组的提取
 * - input = Array，直接
 * - input = Object, 将所有 value = Array 的值连接返回
 *
 * @memberOf module:element/zone
 * @param {Any} input 输入的信息数据。
 * @return {Array} 返回拉平后的数组
 */
const elementFlip = (input) =>
    __Zn.elementFlip(input);


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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {String} field 查找的字段名。
 * @param {any} value 作为条件的字段值。
 * @param {String} targetField 目标字段。
 * @returns {Object} 返回最终查找到的唯一元素Object。
 */
const elementUnique = (array = [], field = "", value, targetField) =>
    __Zn.elementUnique(array, field, value, targetField);
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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息
 * @param {String} field 读取的字段名
 * @returns {any} 返回任意值
 */
const elementFirst = (array = [], field) => __Zn.elementFirst(array, field);


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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {Object} filters 过滤专用键值对。
 * @param {Boolean} fuzzy 是否开启模糊查找
 * @return {Array} 返回查找到的数组信息，最终结果也是一个`[]`。
 */
const elementFind = (array = [], filters, fuzzy = false) =>
    __Zn.elementFind(array, filters, fuzzy);
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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息
 * @param {String} field 执行映射的字段名
 * @return {Array} 新字段值构造的最终集合
 */
const elementVertical = (array = [], field = "") =>
    __Zn.elementVertical(array, field);

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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息
 * @param {String} field 执行映射的字段名
 * @param {String} fieldTo 执行映射的字段名
 * @return {Object} 返回Map过后的最终数据
 */
const elementMap = (array = [], field = "", fieldTo) =>
    __Zn.elementMap(array, field, fieldTo);


/**
 * ## 「标准」`Ux.elementBranch`
 *
 * Zero UI中的树函数，从当前节点查找整个节点所在的分支数组（父节点、父父节点、…… 顶层祖辈），`elementBranch` 和 `elementChild` 为互逆函数。
 *
 * 1. 每个节点的默认主键字段为`key`。
 * 2. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 *
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {any} leafValue 被检索的子节点的值。
 * @param {String} parentField 检索树的父字段信息。
 * @return {Array} 返回分支的数组。
 */
const elementBranch = (array = [], leafValue, parentField = "parent") =>
    __Zn.elementBranch(array, leafValue, parentField);

/**
 * ## 「标准」`Ux.elementParent`
 *
 * 在 elementBranch 基础之上删除掉当前节点的运算。
 *
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {any} leafValue 被检索的子节点的值。
 * @param {String} parentField 检索树的父字段信息。
 * @return {Array} 返回分支的数组。
 */
const elementParent = (array = [], leafValue, parentField = "parent") =>
    __Zn.elementParent(array, leafValue, parentField);


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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组
 * @param {String} field 分组专用的字段信息
 * @return {Object} 分组过后每一个键值对为`key = Array`
 */
const elementGroup = (array = [], field) =>
    __Zn.elementGroup(array, field);


/**
 *
 * ## 「标准」`Ux.elementJoin`
 *
 * 两个数组的连接函数，将两个Array按field字段进行连接，如果存在该元素，则直接执行`Object.assign`的合并，
 * 如果没有找到该元素，则添加新元素，最终的结果以`target + source`的结果为主。
 *
 * @memberOf module:element/zone
 * @param {Array} target 被合并的数组
 * @param {Array} source 将被合并的数组
 * @param {String} field 合并字段
 * @returns {Array} 返回最终数据
 */
const elementJoin = (target = [], source = [], field = "key") =>
    __Zn.elementJoin(target, source, field);

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
 * @memberOf module:element/zone
 * @param {Array} source 原始数组
 * @param {Number} columns 拆分成多少列
 */
const elementGrid = (source = [], columns) =>
    __Zn.elementGrid(source, columns);
/**
 * ## 「标准」`Ux.elementSave`
 *
 * 不重复添加某个元素，按field的执行唯一元素的判定，默认使用`key`字段。
 *
 * @memberOf module:element/zone
 * @param {Array} data 数组输入源头
 * @param {Object} item 被输入的记录集
 * @param {String} idField 主键字段
 * @return {Array} 返回合并后的数组
 */
const elementSave = (data = [], item, idField = "key") =>
    __Zn.elementSave(data, item, idField);
/**
 * ## 「标准」`Ux.elementConcat`
 *
 * 不重复添加某个元素，按field的执行唯一元素的判定，默认使用`key`字段。
 *
 * @memberOf module:element/zone
 * @param {Array} original 数组输入源头
 * @param {Array} current 被输入的记录集
 * @param {String} field 主键字段
 * @return {Array} 返回合并后的数组
 */
const elementConcat = (original = [], current = [], field) =>
    __Zn.elementConcat(original, current, field);

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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildTree = (array = [], current = {}, parentField = "parent") =>
    __Zn.elementChildTree(array, current, parentField);
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
 * @memberOf module:element/zone
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildren = (array = [], current = {}, parentField = "parent") =>
    __Zn.elementChildTree(array, current, parentField);

/**
 ## 「标准」`Ux.valueT`
 *
 * 将传入的数据转换为指定的类型（类型保障），类型支持的值如下：
 *
 * - `BOOLEAN, B`: 布尔值
 * - `INTEGER, I`：整数
 * - `DECIMAL, D`：浮点数
 *
 * 注意：
 *
 * 1、在执行转换之前，会进行判断，当传入的值为 undefined 时，不进行转换。
 * 2、当传入的类型不为上述类型，则默认转换为 String。
 * 3、类型转换的解析模式为 客户端 模式，即用 JavaScript 的方式。
 *
 * 传入的类型可以为简写值，示例如下：
 * ```js
 * const value = "true";
 * const data = Ux.valueT(value, "BOOLEAN");
 * // 等价于
 * const data = Ux.valueT(value, "B");
 * ```
 *
 * @memberOf module:value/zone
 * @param {any} value 传入的值
 * @param {String} type 传入的类型
 * @return {Boolean|integer|Float|String} 最终类型化后的值
 */
const valueT = (value, type = "STRING") => __Zn.valueT(value, type);
/**
 * ## 「标准」`Ux.valueSTDN`
 *
 * 此API功能与 valueT 相似，均为类型保障，区别在于 valueT 是单值处理，而 valueSTDN 为全值处理。
 *
 * 类型支持的值如下：
 *
 * - `BOOLEAN`: 布尔值
 * - `INTEGER`：整数
 * - `DECIMAL`：浮点数
 * - `STRING`：字符串
 * - `TIME`：时间
 * - `DATETIME`：日期时间
 * - `DATE`：日期
 *
 * 虽然目前服务端和客户端支持的类型一致，但有些细节有区别，比如客户端的时间是 HH:mm 格式，而服务端为 HH:mm:ss 格式。
 *
 * 简单示例如下：
 *
 * ```js
 * const value = {
 *     "active": "true",
 *     "__metadata":{
 *         "active": "BOOLEAN"
 *     }
 * }
 * // 使用客户端解析模式，根据 __metadata 的设置，将 active 的值类型转换为 BOOLEAN。
 * const data1 = Ux.valueSTDN(value);
 * // 使用服务端解析模式，根据 __metadata 的设置，将 active 的值类型转换为 BOOLEAN。
 * const data2 = Ux.valueSTDN(value, true);
 * ```
 *
 * @memberOf module:value/zone
 * @param {Object} value 传入的值
 * @param {Boolean} server 是否使用服务端解析模式
 * @return {Object} 最终类型化后的值
 */
const valueSTDN = (value = {}, server = false) => __Zn.valueSTDN(value, server);
/*
 * 变量名与element方法冲突
 */
//let document;
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 工作流专用值解析函数
    // O.valueNormalize
    valueT,
    valueSTDN,


    // O.object.js
    valueAppend,
    valueValid,
    valuePath,
    valueLink,

    // engine.interface.fn.on.event.js
    // valueOnChange,

    // O.pinyin.js
    valuePinyin,

    // O.date.js
    valueStartTime,
    valueDuration,
    valueEndTime,
    valueNow,
    valueJDatetime,
    valueDatetime,

    // O.single.js
    valueParse,
    valueInt,
    valueBoolean,
    valueFloat,
    valueFactor,
    valuePair,
    valueLimit,
    valueCopy,
    valueOk,
    // O.tree
    valueLadder,
    valueArray,
    /**
     * ## 「标准」`Ux.valueSubset`
     *
     * 将传入的 input 数据根据 fields 取子集。
     *
     * 示例如下：
     *
     * ```js
     * const input = {
     *     "name": "lang",
     *     "age": 18,
     *     "email": "email@xx.com",
     *     "active": undefined
     * }
     *
     * // 对 input 取子集，只取字段 "name","age","active"，生成新的子集并返回。
     * const value = Ux.valueSubset(input, ["name","age","active"]);
     * // 等价于
     * const value = Ux.valueSubset(input, "name", "age", "active");
     * ```
     * 最终执行过后，返回的value值为：
     * ```js
     * {
     *      "name": "lang",
     *      "age": 18
     * }
     * ```
     *
     * 注意：如果值为 undefined ，则不会被取出，示例中字段 active 就没有被取出。
     *
     * @memberOf module:value/zone
     * @method valueSubset
     * @param {Object|Array} input 传入的值
     * @param {String[]} fields 取子集的字段数组信息
     * @return {Object|Array} 最终取的子集
     */
    valueSubset: __Zn.valueSubset,

    // O.to
    toArray,
    toJson,
    toTime,
    toKV,
    toUri,
    toColor,

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
    ambValue,
    ambDatetime,
    ambAnnex,
    ambWide,

    /* O.abstract.element.js */
    /**
     * # 「标准」`Ux.element`
     *
     * 等价于 document.getElementById 读取HTML元素。
     *
     * @memberOf module:atomic/zone
     * @param {String} id HTML元素的ID值
     * @returns {HTMLElement}
     */
    element: (id) => __Zn.element(id),
    elementJoin,
    elementFlat,
    elementFlip,
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
    elementChildTree,
    elementChildren,
    // 增删改
    elementSave,
    // 数组判断
    /**
     * ##「标准」`Ux.elementInAll`
     *
     * @memberOf module:element/zone
     * @param ele
     * @param source
     * @returns {boolean}
     */
    elementInAll: (ele = [], source = []) => __Zn.elementInAll(ele, source),
    /**
     * ##「标准」`Ux.elementInAny`
     *
     * @memberOf module:element/zone
     * @param ele
     * @param source
     * @returns {boolean}
     */
    elementInAny: (ele = [], source = []) => __Zn.elementInAny(ele, source),
}