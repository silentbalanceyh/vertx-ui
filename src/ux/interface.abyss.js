import __Zn from 'zone';
import __Zs from 'zs';
import __Zi from 'zi';
// ------------------------------- is.js -----------------------------

/**
 * ## 「标准」`Ux.isCn`
 *
 * 判断当前字符串中是否是`合法中文`，如果包含了中文则直接返回true，主要用于当前字符串中
 * 是否包含了中文信息，在Zero Ui中使用时，会针对列宽度计算执行中文宽度计算，而开发人员
 * 也可以直接调用该API进行检查。
 *
 * ```js
 * const item = "你好";
 * const isCn = Ux.isCn(item);  // 返回 true
 * ```
 *
 * @memberOf module:is/zone
 * @param {String} literal 输入的原始字符串
 * @returns {Boolean} 匹配返回true，否则返回false
 */
const isCn = (literal) => __Zn.isCn(literal);
/**
 * ##「标准」`Ux.isDateIso`
 *
 * @memberOf module:is/zone
 * @param literal
 * @returns {Boolean} 匹配返回true，否则返回false
 */
const isDateIso = (literal) => __Zn.isDateIso(literal);
/**
 * ##「标准」`Ux.isBlank`
 *
 * @memberOf module:is/zone
 * @param literal
 * @returns {boolean|boolean}
 */
const isBlank = (literal) => __Zn.isBlank(literal);
/**
 * ## 「标准」`Ux.isValid`
 *
 * 判断当前值是否可用，可用条件：
 *
 * 1. undefined 不可用
 * 2. "" 不可用（空字符串）
 * 3. null 不可用
 *
 * @memberOf module:is/zone
 * @param input
 * @returns {boolean}
 */
const isValid = (input) => __Zn.isValid(input);

// eslint-disable-next-line
// Fix: https://github.com/silentbalanceyh/vertx-zero/issues/393
/**
 * ## 「标准」`Ux.isFileName`
 *
 * 判断当前字符串是否是合法文件名。
 *
 * @memberOf module:is/zone
 * @param input
 * @returns {Boolean}
 */
const isFileName = (input) => __Zn.isFileName(input);
/**
 * ## 「标准」`Ux.isNumber`
 *
 * 判断当前字符串是否是`合法整数`，只有合法整数才会返回true。
 *
 * ```js
 * const literal = "1233";
 * const isNumber = Ux.isNumber(literal);       // 返回 true
 * ```
 *
 * @memberOf module:is/zone
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isNumber = (literal) => __Zn.isNumber(literal);


/**
 * ## 「标准」`Ux.isCurrency`
 *
 * 判断当前字符串是否是合法货币格式，合法的货币格式包含两种：
 *
 * 1. 基本浮点格式。
 * 2. 带千分位逗号的货币格式。
 *
 * ```js
 * const literal = "12.33";
 * const literal2 = "1,135.65";
 * const isDecimal = Ux.isCurrency(literal);     // 返回 true
 * const isDecimal2 = Ux.isCurrency(literal);    // 返回 true
 * ```
 *
 * @memberOf module:is/zone
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isCurrency = (literal) => __Zn.isCurrency(literal);


/**
 * ## 「标准」`Ux.isDecimal`
 *
 * 判断当前字符串是否是合法浮点数，合法浮点数是带一个小数点的小数。
 *
 * ```js
 * const literal = "12.33";
 * const isFloat = Ux.isDecimal(literal);        // 返回 true
 * ```
 *
 * @memberOf module:is/zone
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isDecimal = (literal) => __Zn.isDecimal(literal);

/**
 * ## 「标准」`Ux.isRule`
 *
 * ### 1. 基本介绍
 *
 * 检查记录record是否符合ruleConfig中的定义，该定义为前端查询引擎检查，配合解析表达式实现针对
 * 数据中条件值的检查，如果符合规则，则返回true，否则返回false。
 *
 * ### 2. 规则说明
 *
 * ruleConfig的数据结构如下：
 *
 * ```json
 * {
 *     "field1": "<RULE>",
 *     "field2": "<RULE>",
 *     "", true / false
 * }
 * ```
 *
 * 其中`<RULE>`的完整值列表如下：
 *
 * 1. `NIL`：该属性必须不为空
 * 2. `NUL`：该属性必须为空
 * 3. `GT,<N>`：该属性大于某个值
 * 4. `GE,<N>`：该属性大于等于某个值
 * 5. `LT,<N>`：该属性小于某个值
 * 6. `LE,<N>`：该属性小于等于某个值
 * 7. `EQ,<S>`：该属性等于某个值
 * 8. `NEQ,<S>`：该属性不等于某个值
 * 9. `ST,<S>`：以某个字符串开始
 * 10. `ET,<S>`：以某个字符串结束
 * 11. `CT,<S>`：包含了某个字符串
 * 12. `CF,<S>`：不包含某个字符串
 *
 * @memberOf module:is/zone
 * @param {Object} record 输入的数据记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 满足规则返回true，否则返回false
 */
const isRule = (record = {}, ruleConfig = {}) => __Zn.isRule(record, ruleConfig);

/**
 * ## 「标准」`Ux.isRuleAll`
 *
 * （略），针对Array执行每个元素的`isRule`检查，最后用And连接。
 *
 * @memberOf module:is/zone
 * @param {Array} array 输入的数组记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 全满足则返回true，数据和数据之间用AND
 */
const isRuleAll = (array = [], ruleConfig = {}) => __Zn.isRuleAll(array, ruleConfig);

/**
 * ## 「标准」`Ux.isRuleAny`
 *
 * （略），针对Array执行每个元素的`isRule`检查，最后用Or连接。
 *
 * @memberOf module:is/zone
 * @param {Array} array 输入的数组记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 满足一条则返回true，数据和数据之间用Or
 */
const isRuleAny = (array = [], ruleConfig = {}) => __Zn.isRuleAny(array, ruleConfig);

/**
 * ## 「标准」`Ux.isDiff`
 *
 * 判断两个对象是否不同，内部使用`Immutable.is` 判断，等价于 Java 语言中的
 * equals 方法:
 *
 * 1. 如果是原始JS数据类型，则直接比对二者是否不同。
 * 2. 如果是JS中的对象（Array, Object), 则比较二者的内容是否不同。
 * 3. 如果是自定义的 DataArray, DataObject, 则比较二者内容是否不同。
 *
 * 该比对方法针对内部数据结构以及内容执行真正意义上的比对流程，所以不存在`===`的引用比对流程，通过比对来判断两者数据内容是否一致。
 * 次方法的比对结果使用频率远高于`===`的比对。众所周知，JavaScript中的三等号在比较Object/Array时比较的是二者的引用地址是否
 * 一致，而不是数据内容是否相同，而真实场景中通常要针对数据内容进行比对，这个API就是为这个场景而设计的。
 *
 * @memberOf module:is/zone
 * @param {Object | DataObject | DataArray} left 比对左值
 * @param {Object | DataObject | DataArray} right 比对右值
 * @returns {boolean} 不同返回 true，相同则返回 false
 */
const isDiff = (left, right) => __Zn.isDiff(left, right);
/**
 * ## 「标准」`Ux.isSubset`
 *
 * @memberOf module:is/zone
 * @param input
 * @param source
 * @returns {*|boolean}
 */
const isSubset = (input, source) => __Zn.isSubset(input, source);

/**
 * ## 「标准」`Ux.isEmpty`
 *
 * 判断对象是否为空或 undefined，空包括 {}，以及[]。
 *
 * 1. 如果 undefined，则表示为空。
 * 2. 如果 Object，则判断它是否包含了键，无任何键则为空。
 * 3. 如果 Array，则判断长度是否为`0`，为0就表示空。
 *
 * @memberOf module:is/zone
 * @param {any} input 输入的数据内容
 * @returns {boolean} 如果为空返回 true，否则返回 false
 */
const isEmpty = (input) => __Zn.isEmpty(input);


/**
 * ## 「引擎」`Ux.isParent`
 *
 * 检查两个节点是否有父子关系，不传入 field 时，直接检查两个核心字段
 *
 * 1. 标准树专用字段：parent
 * 2. 非标准树的专用字段：parentId
 *
 * 由于是引擎函数，主键不可使用其他值，只能使用React中的通用主键`key`，为了兼容前端很多操作，Zero Ui中统一使用`key`字段
 * 作为元素、记录的唯一主键字段名，某些API可变更主键名，但大部分API（特别是引擎类）都直接使用key作主键。
 *
 * @memberOf module:is/zone
 * @param {Object} input 输入节点
 * @param {Object} parent 父节点
 * @param {String} field 固定字段检查
 * @return {boolean} 如果 input 的 parent 是 parent，那么为 true
 */
const isParent = (parent = {}, input, field) => __Zn.isParent(parent, input, field);


/**
 * ## 「标准」`Ux.isObject`
 *
 * 是否合法对象，合法对象的满足条件如下：
 *
 * 1. 如果是 undefined 则不是合法对象。
 * 2. 如果是 Object 还会排除 Array。
 *
 * 此处检查有一个和原始检查不同的点在于，检查过程中会排除Array类型，JavaScript中的Array
 * 也是一个合法的Object，排除的目的是程序过程中Array和Object的应用场景往往不同。
 *
 * @memberOf module:is/zone
 * @param {any} input 输入值
 * @returns {boolean} 如果是合法对象则为true，否则返回false
 */
const isObject = (input) => __Zn.isObject(input);

/**
 * ## 「标准」`Ux.isRange`
 *
 * 1. 范围格式：(min, max) 或 [min, max]。
 * 2. 符号：( 表示不包含边界，[ 表示包含边界。
 *
 * @memberOf module:is/zone
 * @param {Number} input 输入值
 * @param {String} literal 检查的范围
 * @returns {boolean} 如果是合法对象则为true，否则返回false
 *
 */
const isRange = (input, literal) => __Zn.isRange(input, literal);

/**
 * ## 「标准」`Ux.isFunction`
 *
 * 内部调用`underscore`，判断输入值是否是一个合法的 JavaScript 函数，原生调用为
 * Function.prototype.isPrototypeOf 的方式来判断。
 *
 * @memberOf module:is/zone
 * @param {any} input 传入值
 * @returns {boolean} 是函数返回true，不是函数返回false
 */
const isFunction = (input) => __Zn.isFunction(input);


/**
 * ## 「标准」`Ux.isArray`
 *
 * 判断输入的值是否是一个合法的JavaScript中的Array类型。
 *
 * 内部调用`underscore`，判断输入值是否是一个合法 Array 的函数，在原生的JavaScript中通常使用
 * Array.prototype.isPrototypeOf 的方式来判断一个输入是否Array，而这个封装包含了特殊值的检测
 * 目前版本看起来走`underscore`的流程是最靠谱的。
 *
 * @memberOf module:is/zone
 * @param {any} input 输入值
 * @returns {boolean} 是数组则返回true，不是则返回false
 */
const isArray = (input) => __Zn.isArray(input);
/**
 * ## 「标准」`Ux.isSet`
 *
 * 判断输入的值是否是一个合法的Set类型对象。
 *
 * 内部调用`underscore`，判断输入是否合法的 Set 的函数。
 *
 * @memberOf module:is/zone
 * @param {any} input 输入值
 * @returns {boolean} 是Set则返回true，不是则返回false
 */
const isSet = (input) => __Zn.isSet(input);

/**
 * ## 「引擎」`Ux.isQr`
 *
 * 判断输入的配置是否合法的带查询的结构，输入的 config 必须是合法的 Object
 *
 * ### 格式1
 *
 * ```json
 * {
 *     "ajax": {
 *         "magic":{
 *             "...": "< 合法可解析的查询条件模式 >"
 *         }
 *     }
 * }
 * ```
 *
 * ### 格式2
 *
 * ```json
 * {
 *     "params": {
 *          "criteria": {
 *              "...": "< 合法可解析的查询条件模式 >"
 *          }
 *     }
 * }
 * ```
 *
 * 该方法比较特殊，必须配合 Zero UI 中的查询引擎执行相关处理，主要用于判断查询参数
 * 所传入的对象必须包含以下路径下的值：
 *
 * ```shell
 * # 新格式，直接使用 ajax.magic
 * ajax.magic
 *
 * # 旧格式（最早的查询参数）直接使用 ajax.params.criteria
 * ajax.params.criteria
 * ```
 *
 * > 该API是为引擎中的查询引擎量身定制的函数，用于检查一个输入参数的配置是否符合查询引擎规范，
 * > 该检查在大部分`web`组件中会检查请求发送的参数格式，使用Adaptor的设计模式进行重新设计，如果
 * > 参数格式是 Qr 类型，那么会执行查询引擎的参数语法，如果不是 Qr 类型则直接使用原生数据类型。
 *
 * @memberOf module:is/zone
 * @param {Object} config 传入的配置信息
 * @returns {boolean} 如果合法则返回true，否则返回false
 */
const isQr = (config = {}) => __Zn.isQr(config);
/**
 * ## 「标准」`Ux.isCollection`
 *
 * 检查输入数据的类型是否一个合法的集合类型，集合类型包括：
 *
 * 1. Set：ES6中的集合类型。
 * 2. Array：标准的JavaScript中的数组Array类型。
 *
 * @memberOf module:is/zone
 * @param {any} input 传入部分的数据
 * @returns {boolean}
 */
const isCollection = (input) => __Zn.isCollection(input);
/**
 * ## 「标准」`Ux.isBefore`
 *
 * 时间比较 <
 *
 * @memberOf module:is/zone
 * @param source
 * @param compared
 * @param config
 * @returns {boolean}
 */
const isBefore = (source, compared, config = {}) => __Zn.isBefore(source, compared, config);
/**
 * ## 「标准」`Ux.isAfter`
 *
 * 时间比较 <
 *
 * @memberOf module:is/zone
 * @param source
 * @param compared
 * @param config
 * @returns {boolean}
 */
const isAfter = (source, compared, config) => __Zn.isAfter(source, compared, config);
// ------------------------------- immutable.js -----------------------------

/**
 * ## 「标准」`Ux.clone`
 *
 * 该函数是一个高频使用函数，内置使用`Immutable`的API实现对象拷贝，拷贝对象分为以下几种场景：
 *
 * 1. 普通JS对象：Object/Array，直接调用`Immutable.fromJS.toJS`的链式调用实现对象拷贝。
 * 2. DataArray/DataObject：将这两种对象的内部内容拷贝出来，生成Object或Array。
 * 3. Function：（不拷贝），直接返回原始函数，防止函数拷贝过程中的错误信息。
 * 4. NodeList：Dom对象由于挂载在HTML元素中，所以不执行拷贝，而是直接返回该Dom引用。
 * 5. Set：如果是集合，则创建一个新的集合，将元素依次追加到集合中。
 * 6. Acl数组：对存在权限控制的Array/Object而言，它会包含一个索引之外的`__acl`属性，该属性存储了Acl的权限属性。
 *      1. 对Object类型而言，会直接拷贝__acl属性。
 *      2. 对Array类型，需要独立拷贝__acl属性（Immutable不会复制非索引访问的属性）。
 *
 * > 此处的JS应用了原型链，由于Array本身是一个Object，所以除了索引以外，可直接追加属性，只是这些属性不作为标准Array元素对待。
 *
 * ```js
 * // 直接拷贝对象，拷贝过后的对象的任何更改都不会反应到原始对象
 * const before = {
 *      name: "Lang"
 * };
 * const after = Ux.clone(before);
 * after.name = "Lang2";
 * console.info(item,input);
 *
 * // before 的值依旧是：{ name: "Lang" }
 * // after 的值为修改后的值 { name: "Lang2" };
 * ```
 *
 * @memberOf module:atomic/zone
 * @param {DataObject | DataArray | Object | Array} input 传入合法对象，
 * @returns {any} 返回拷贝好的 Object
 */
const clone = (input) => __Zn.clone(input);
/**
 * ## 「标准」`Ux.assign`
 *
 * 三种模式的拷贝函数，增强原始的`Object.assign`函数。
 *
 * * mode = 0 ：直接覆盖，内部调用`Object.assign`方法。
 * * mode = 1 ：深度覆盖，不直接覆盖子对象，递归往下，发现同键数据后直接覆盖数据。
 * * mode = 2 ：深度追加，不直接覆盖子对象，递归往下，同键不存在则追加，出现重复建则直接跳过。
 *
 * ```js
 * // mode = 0（默认模式）
 * const target = {
 *     name: "mode"
 * };
 * const source = {
 *     email: "lang.yu@hpe.com"
 * };
 *
 * // 等价于 Object.assign(target,source);
 * const combine = Ux.assign(target,source);
 *
 * // mode = 1 和 mode = 2 的模式则参考实际使用。
 * ```
 *
 * > 实际上mode为1或2的场景在很多实战场景中有所使用，这两种模式不会直接覆盖子对象（包括嵌套对象），而是通过比对的方式执行**覆盖**和**追加**（同名跳过）操作，实现深度合并。
 *
 *
 * @memberOf module:atomic/zone
 * @param {Object} target 拷贝目标（副作用修改）
 * @param {Object} source 拷贝源
 * @param {Number} mode 模式参数，用于不同的模式：0 = 默认，1 = 深度覆盖，2 = 深度追加
 * @returns {Object} 合并好的JavaScript对象Object
 */
const assign = (target = {}, source = {}, mode = 0) => __Zn.assign(target, source, mode);
/**
 * ## 「标准」`Ux.prevent`
 *
 * 特殊二义性函数「Ambiguity」，该函数的输入会有两种类型，其实第一种方式应用特别多：
 *
 * * 如果传入的是HTML中的`native`本地函数，通常在`Button`的onClick中会被传入。
 * * 如果传入的是Object数据，那么直接返回该Object数据。
 *
 * 这个函数读取数据有另外的一个API来实现`ambEvent`，所以这里只是为了执行单纯的方法，它执行的核心代码为`event.preventDefault()`。
 *
 * ```js
 *      // 绑定事件
 *      const onClick = (event) => {
 *          Ux.prevent(event);
 *      }
 *      // 直接传入参数
 *      const onForm = (params = {}) => {
 *          const request = Ux.prevent(params);
 *      }
 * ```
 *
 * @memberOf module:atomic/zone
 * @method prevent
 * @param {Event|Object} event 传入事件或对象
 * @return {Object} 返回对象信息
 */
const prevent = (event) =>
    __Zn.prevent(event);
/**
 * ## 「标准」`Ux.remove`
 *
 * 从 item 对象删除某些 keys 值
 *
 * @memberOf module:atomic/zone
 * @method remove
 * @param {Object} item 输入对象
 * @param {String|Array} keys 二义性Array
 */
const remove = (item, ...keys) =>
    __Zn.remove.apply(this, [item].concat(keys))
// ------------------------------- it.js -----------------------------

/**
 * ## 「标准」`Ux.itMatrix`
 *
 * 遍历二维数组
 *
 * 1. 如果元素是 Array，则 eachFun 作用于每一个 Object 类型的元素。
 * 2. 如果元素是 Object，则 eachFun 直接作用于这个 Object。
 * 3. 会一直递归调用到最下层。
 *
 * ```js
 * const matrix = [
 *      [
 *          { name: "name1", age: "age1" },
 *          { name: "name2", age: "age2" }
 *      ],
 *      { name: "name3", age: "age3" }
 * ]
 *
 * Ux.itMatrix(matrix, (item) => {
 *      console.info(item.name);
 * });
 * // 上述代码会依次打印：name1, name2, name3
 * ```
 *
 * @memberOf module:it/zone
 * @param {Array<Array<T>|Object>} matrix 二维表矩阵数据
 * @param {Function} eachFun 作用于每一个元素的单子函数
 * @return {Array<T>} 返回 matrix 本身
 */
const itMatrix = (matrix = [], eachFun) =>
    __Zn.itMatrix(matrix, eachFun);


/**
 * ## 「标准」`Ux.itObject`
 *
 * 对象遍历函数，直接遍历 Object 对象，生成 `key = value` 的执行函数专用。
 *
 * ```js
 * const user = {
 *     username: "Lang",
 *     email: "lang.yu@hpe.com"
 * }
 * Ut.itObject(user, (key, value) => {
 *
 *     // 此处的 key, value 对应
 *     // 1. username = Lang
 *     // 2. email = lang.yu@hpe.com
 * });
 * ```
 *
 * @memberOf module:it/zone
 * @param {Object} data 将会被遍历的 Object 对象
 * @param {Function} executor 作用于 `key, value` 的执行函数
 * @param {boolean} invalid `value`非法的时候是否执行`executor`函数
 */
const itObject = (data = {}, executor = () => {
}, invalid = false) =>
    __Zn.itObject(data, executor, invalid);
/**
 * ## 「引擎」`Ux.itUi`
 *
 * 表单 form 中的配置 `ui` 的专用遍历函数，会生成带坐标的二维矩阵。
 *
 * 该函数主要用于表单解析中，解析 `ui` 的专用函数，这里不提供示例代码，主要解析结构，如配置项为：
 *
 * ```json
 * {
 *     "_form": {
 *         "ui": [
 *             [
 *                 "name,用户名"
 *             ],
 *             [
 *                 "email,邮箱",
 *                 {
 *                     "field": "age",
 *                     "optionItem.label": "年龄"
 *                 }
 *             ]
 *         ]
 *     }
 * }
 * ```
 *
 * 解析过后的最终数据结构如：
 *
 * ```shell
 * name 字段，位于：      ui[0][0]。
 * email 字段，位于：     ui[1][0]。
 * age 字段，位于：       ui[1][1]。
 * ```
 *
 * `ui[rowIndex][columnIndex]` 中的两个参数如下：
 *
 * * row：行索引，从`0`开始。
 * * column：列索引，从`0`开始。
 *
 * @memberOf module:it/zone
 * @param {Array<Array<T>|String>} ui 矩阵配置，Grid布局中的表单单元格。
 * @param {Function} eachFun 单个组件专用处理函数，处理
 *        `<Form.Item>{children}</Form.Item>` 标签内的 `children` 专用。
 * @param {Function} itemFun 单个组件中的 Item 处理函数，处理
 *        `<Form.Item {...attrs}>` 中的 `attrs` 专用。
 * @return {Array<Array<T>>} 返回矩阵相关配置，`ui[rowIndex][columnIndex]` 格式
 */
const itUi = (ui = [], eachFun, itemFun = item => item) =>
    __Zs.itUi(ui, eachFun, itemFun);
/**
 * ## 「引擎」`Ut.itRow`
 *
 * 1. 如果输入是 Array，则直接返回 Array。
 * 2. 如果输入的是 Object，则直接返回 object.items 数据，前提是 items 必须是 Array。
 *
 * @memberOf module:it/zone
 * @param {Array|Object} row 被遍历的行
 * @return {Array} 规范化过后的行相关信息
 */
const itRow = (row) =>
    __Zn.itRow(row);


/**
 * ## 「标准」`Ux.itElement`
 *
 * 1. 该函数会一直递归，直接执行一层 Array 中的遍历，并且递归替换处理结果。
 * 2. 命中字段中的元素会在处理过后执行原始替换。
 *
 * ```js
 * const array = [
 *      { "name": "Lang", "email": "lang.yu@hpe.com" },
 *      [
 *          { name: "Lang1" },
 *          { name: "Lang2" }
 *      ]
 * ]
 * Ux.itElement(array, "name", (value, item) => {
 *      // value：该字段的值
 *      // item：被遍历的对象本身，它包含了 name 的值
 *     return "Hi " + name;
 * });
 * ```
 *
 * 最终生成的数据格式已经被改动过了，该函数是具有修改副作用的，最终格式中所有的`name`字段中的数据都发生了改变：
 *
 * ```json
 * {
 *     { "name" : "Hi Lang", "email": "lang.yu@hpe.com" },
 *     [
 *         { "name": "Hi Lang1" },
 *         { "name": "Hi Lang2" }
 *     ]
 * }
 * ```
 *
 * ### 参数函数 itemFun
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | value | String | 被遍历的字段值 |
 * | item | Object | 被遍历到的包含了该字段的对象 |
 *
 * @memberOf module:it/zone
 * @param {Array<Object>} data 被遍历的数组（一般是对象数组）
 * @param {String} field 需要提取的对象对应的字段信息
 * @param {Function} itemFun 每一个元素的遍历专用处理
 * @throws 10071 异常（console.error）
 */
const itElement = (data = [], field = "", itemFun = () => {
}) => __Zn.itElement(data, field, itemFun);

/**
 *
 * ## 「引擎」`Ux.itFull`
 *
 * `data` 中的每一个元素和 items 中的 `key = value` 构成一个条目，每个条目包含了三元操作数：
 * ( element, key, value ），执行前提是 key 和 value 都合法才执行。
 *
 * > 排除的 key, value 值包括 undefined、null、0 等所有无法通过JS判断的内容
 *
 * 特定场景代码参考下边片段：
 *
 * ```js
 const predicate = Abs.isFunction(fnPredicate) ? fnPredicate : () => true;
 Abs.itFull(array, object, (item = {}, key, value) => {
    if (predicate(value)) {
        fnExecute(item, key, value);
    }
});
 * ```
 *
 * ## 参数函数 fieldFun
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | item | Object | 首参：数组中的元素内容 |
 * | key | String | 第二参：传入对象 items 的键值对中的键 |
 * | value | Unknown | 第二参：传入对象 items 的键值对中的值 |
 *
 * @memberOf module:it/zone
 * @param {Array} data 输入的数组数据
 * @param {Object} items 输入的需要验证的 items 数据
 * @param {Function} fieldFun 最终执行的特殊函数
 */
const itFull = (data = [], items = {}, fieldFun = () => {
}) => __Zn.itFull(data, items, fieldFun);


/**
 * ## 「标准」`Ux.itValue`
 *
 * 多迭代模式下的迭代专用操作
 *
 * 1. 遍历 object 中的的每一个字段 field。
 * 2. 拿到 field 对应的值，判断该值 valueRef 是否是一个合法的 Object。
 * 3. 如果合法，则执行 `transformer` 函数（同步函数）得到对应的返回值 processed。
 * 4. 根据 key 进行分离合并操作
 *      1. 如果没有传入 key，则直接将转换过的数据合并到 valueRef 变量中。
 *      2. 如果传入了 key
 *          1. 如果 valueRef 中包含了 key 键的值，则直接合并`（valueRef[key], processed）`。
 *          2. 如果 valueRef 中不包含 key 键的值，则设置：`valueRef[key] = processed`。
 *
 * 在框架内部使用该函数的代码如下：
 *
 * ```js
 *
 * const parsePlugin = (buttons = {}, options = {}) => {
 *     Ux.itValue(buttons, (button = {}) => {
 *         const {plugin = {}} = button;
 *         const configuration = {};
 *         if (plugin.tooltip) {
 *             configuration.tooltip = true;
 *         }
 *         if (plugin.confirm) {
 *             configuration.confirm = options[plugin.confirm];
 *         }
 *         if (plugin.prompt) {
 *             configuration.prompt = options[plugin.prompt];
 *         }
 *         if (plugin.connect) {
 *             configuration.connect = options[plugin.connect];
 *         }
 *         if (plugin.message) {
 *             configuration.message = options[plugin.message];
 *         }
 *         return configuration;
 *     }, 'plugin');
 *     return buttons;
 * };
 *
 * ```
 *
 * > 该函数一般在特殊场景中使用，不会用于单一的场景，特殊场景遍历复杂，会统一消费。
 *
 * ### 参数函数 transformer
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | valueRef | Object | 遍历到的默认的 Object 对象 |
 *
 * @memberOf module:it/zone
 * @param {Object} object 被迭代的JS的Object对象
 * @param {Function} transformer 执行转换的函数
 * @param {String} [key] 可选的传入键
 */
const itValue = (object = {}, transformer, key) =>
    __Zn.itValue(object, transformer, key);


/**
 *
 * ## 「标准」`Ut.itTree`
 *
 * 遍历树形数组，数组中的每个元素可能包含 `children` 属性，传入数据属于已经构造好的 treeArray，该函数
 * 会递归执行每一个元素，元素包含两种：
 *
 * 1. 顶层 Array 中的每一个元素 element。
 * 2. 没个元素若包含了 Array 类型的 `children` 则表示它包含子节点，直接执行每一个子节点。
 * 3. executor 为每个元素的处理函数（副作用函数）。
 *
 * 框架内部在注入 `_level` 字段时候会使用该函数
 *
 * ```js
 *
 * Ux.itTree(treeData, (item) => {
 *      if (item.hasOwnProperty("_level")) {
 *          item.selectable = item._level <= selectable;
 *      }
 * });
 * ```
 *
 * @memberOf module:it/zone
 * @param {Array} treeArray 传入的数组对象。
 * @param {Function} executor 执行每个元素的函数。
 */
const itTree = (treeArray = [], executor) =>
    __Zn.itTree(treeArray, executor);


/**
 * ## 「标准」`Ux.itAmb`
 *
 * ### 基本介绍
 *
 * 「Ambiguity」二义性函数，consumer 负责每一个元素的生成
 *
 * 1. 如果输入是 `Array` 则返回 `Array`。
 * 2. 如果输入是 `Object` 则返回 `Object`。
 *
 * 该方法会遍历Object或Array针对每一个键值对和元素执行`consumer`方法，并且返回执行结果，执行过程中会实现二义性双遍历，只是需要注意的点：
 *
 * - consumer 函数是一个 object -> object 的函数，此处是 JavaScript 中的 Object 对象
 * - 此函数只针对 `[{}]` 类型的对象数组生效（数组每个元素都是对象），或直接作用于 `{}`
 * - 一旦函数被封装就会导致此处出现双遍历，也是「二义性」的来源。
 *
 * ### 示例
 *
 * ```js
 *
 // 此处 room 可能是Array也可能是Object
 const calcRoomCheckIn = (reference, order = {}, room) => Ux.itAmb(room, (amb => {
    const {schedules = []} = order;
    const orders = [order];
    let $room = Ux.clone(amb);
    $room.leaving = true;
    $room.arriving = true;
    mountColor(reference, $room);
    mountOrder(orders, schedules, $room);
    mountOp(reference, $room);
    return $room;
}))
 * ```
 *
 * @memberOf module:it/zone
 * @param {Object/Array} input 二义性专用方法
 * @param {Function} consumer 执行函数
 * @return {Object/Array} 返回任意值
 */
const itAmb = (input, consumer) =>
    __Zn.itAmb(input, consumer);
/**
 *
 * ## 「标准」`Ux.itRepeat`
 *
 * 重复执行多次的专用函数，第一参数为循环和迭代的次数。
 *
 * @memberOf module:it/zone
 * @param {Number} loop 循环的次数
 * @param {Function} consumer 每次循环执行的函数
 * @returns {Array} 返回每一次的返回值
 */
const itRepeat = (loop = 0, consumer) =>
    __Zn.itRepeat(loop, consumer);
// ------------------------------- functions.js -----------------------------
const bind = (reference, inherit = {}, names = []) =>
    __Zn.bind(reference, inherit, names);


/**
 * ## 「标准」`Ux.immutable`
 *
 * 直接调用 `immutable` 包中的 Immutable.fromJS 函数，生成 Immutable 对象，该对象包含了很多新的API，如常用的：
 *
 * * `getIn`：可直接使用`getIn(["field1","field11"])`读取嵌套属性。
 * * `setIn`：可使用`setIn(["field1","field11"])`设置嵌套属性。
 * * `contains`：高频使用方法，特别是Array模式，当然也可以直接使用ES6中的`Set.has`来判断。
 *
 * ```
 * const item = ["key", "key1"];
 * const $item = Ux.immutable(item);
 *
 * console.info($item.contains("key"));
 * ```
 *
 * @memberOf module:atomic/zone
 * @param {Object | Array} input 输入对象，可以是任意 JavaScript 对象
 * @return {Map | List} Immutable库中需要使用的专用对象
 */
const immutable = (input) => __Zn.immutable(input);
// eslint-disable-next-line

/**
 * ## 「标准」`Ux.isTimeSame`
 *
 * @memberOf module:is/zone
 * @param leftMom
 * @param rightMom
 * @returns {boolean|*}
 */
const isTimeSame = (leftMom, rightMom) => __Zn.isTimeSame(leftMom, rightMom);

const fn = (reference) => __Zn.fn(reference);
/**
 ## 「标准」`Ux.of`

 * {@link _Of}
 *
 * @memberOf module:hoc/zone
 * @method of
 * @param reference
 * @returns {_Of}
 */
const of = (reference) => __Zn.of(reference);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // atomic.async
    /**
     *
     * ## 「标准」`Ux.promise`
     *
     * 多义性方法，用于返回不同结果的 Promise，多用于函数链中，该方法只对 1,2,3 的长度有效，
     * 不在这个长度范围内时会直接返回 `Promise.reject` 的异常信息。
     *
     * 1. 长度为`1`，直接返回`new Promise`，将传入对象封装成 Promise 返回，同步转异步。
     * 2. 长度为`2`，使用 Supplier 和第二参直接生成 Promise 返回（延迟异步，同步转异步）。
     * 3. 长度为`3`，一般用于 Monad 函数链，通常在状态迁移中处理。
     *
     * ### 长度1
     *
     * ```js
     * const user = {
     *     username: "Lang Yu"
     * };
     * const promise = Ux.promise(user);
     * ```
     *
     * ### 长度2
     *
     * ```js
     * const supplier = (params = {}) => {
     *
     *      // 构造新的 Promise
     *      return Ux.ajaxGet("/api/test/:key", params);
     * };
     * const promise = Ux.promise(supplier, {key:"user.id"});
     * ```
     *
     * ### 长度3
     *
     * > 【巧】技巧代码
     *
     * #### 旧代码
     *
     * ```js
     *
     * const state = {};
     * Ux.ajaxGet("/api/test").then(response => {
     *     state.$data = response;
     *     return Ux.promise(state);
     * })
     * ```
     *
     * #### 新代码
     *
     * ```js
     * const state = {};
     * Ux.ajaxGet("/api/test")
     *      .then(response => Ux.promise(state, "$data", response));
     * ```
     *
     * #### 使用场景分析
     *
     * 该API提供的方法在整个Promise链中为高频使用方法，他的使用场景有很多，主要是用于修正代码编写风格，使用场景如下：
     *
     * 1. 直接将一个对象Object/Array等转换成带有异步Promise的数据结构，可直接调用`.then`的API。
     * 2. 长度2的使用场景主要用于切面AOP的编程，通常在很多场景中需要执行多维度构造，特别是中间维度的Promise的构造过程。
     * 3. 长度3的使用场景则通常用于`componentDidMount`的生命周期中，用于实现挂载流程，如`response -> state[key] = response`的结构。
     *
     * 该方法存在的意义在于封装了ES6中出现的Promise流程，方便整体调用，Zero Ui的理念是封装第三方，那么第三方的内容封装越多，开发人
     * 员对本身框架的操作程度会越过，其实第一种应用是最常用的，其次是配置化流程中通常使用第二和第三种流程。
     *
     * @memberOf module:atomic/zone
     * @method promise
     * @async
     * @param {arguments} [arguments] 可变长度参数
     * @returns {Promise<T>} 返回最终的 Promise
     */
    promise: __Zn.promise,
    /**
     *
     * ## 「标准」`Ux.parallel`
     *
     * 并行 Promise 专用函数，每个 Promise 会同时执行最终合并结果，直接构造并行运行结果
     *
     * 1. 如果不传第二参数，keys 长度为 0，则直接返回 `[x]` 的 promises 直接结果
     * 2. 如果传入第二参，keys 长度 > 0，则会返回 `{}` 的 promises 直接结果
     *
     * ### 直接并行 []
     *
     * ```js
     * const promiseArray = [
     *      promise1,       // 假设返回 {name:"Lang"}
     *      promise2,       // 假设返回 [1,2]
     *      promise3        // 假设返回 "3 Promise"
     * ];
     * Ux.parallel(promiseArray).then(response => {
     *      // response 数据结构：
     *      // [
     *      //      {name, "Lang"},
     *      //      [1,2],
     *      //      "3 Promise"
     *      // ]
     * });
     * ```
     *
     * ### 异构并行 {}
     *
     * ```js
     * const promiseArray = [
     *      promise1,       // 假设返回 {name:"Lang"}
     *      promise2,       // 假设返回 [1,2]
     *      promise3        // 假设返回 "3 Promise"
     * ];
     * Ux.parallel(promiseArray, "user", "number").then(response => {
     *      // response 数据结构：
     *      // {
     *      //      "user": {name, "Lang"},
     *      //      "number": [1,2],
     *      //      "2": "3 Promise"
     *      // }
     * });
     * ```
     *
     * @memberOf module:atomic/zone
     * @async
     * @method parallel
     * @param {Array} promises 一个 Promise 的数组。
     * @param {String[]} keys 一个包含键的数组，用于处理最终返回值专用。
     * @returns {Promise<T>} 返回最终的 Promise
     */
    parallel: __Zn.parallel,

    /**
     * ## 「标准」`Ux.pass`
     *
     * ### 基本介绍
     * 函数异步返回安全处理，直接执行 executor 函数，根据其返回值做选择：
     *
     * - 如果 `executor` 不是一个函数，则直接返回 promise(response) 封装
     * - 如果 `executor` 是一个执行函数，则直接计算此函数，并根据返回值判断
     *      - 若返回值是一个 Promise，则直接返回
     *      - 若返回值不是一个 Promise，则返回 promise(response)
     *
     * @memberOf module:atomic/zone
     * @method pass
     * @async
     * @param {Function} executor 传入的函数执行器
     * @param {Any} response 默认返回值
     * @returns {Promise<Any>}
     */
    pass: __Zn.pass,
    /**
     *
     * ## 「标准」`Ux.passion`
     *
     * 顺序链接 Promise 专用函数（串行Promise），最终构造成 Monad 链
     *
     * ```shell
     * input -> Monad1 -> out1,
     * out1 ->  Monad2 -> out2,
     * out2 ->  Monad3 -> out3,
     * ....
     *
     * # 最终构造链式结构
     * Monad1 -> Monad2 -> Monad3 -> ... -> Monadn
     * ```
     *
     * 执行步骤如下：
     *
     * 1. 数组中的每一个元素都必须是一个**函数生成器**（generator），每调用一次会生成这个节点的 Promise
     * 2. 使用 generator 的目的是保证每个 Promise 都是延迟生成。
     * 3. 按照流程，第一个 generator 生成了 Promise 过后，会使用 then 的方式继续往下直到最后一个执行完成。
     *
     * @memberOf module:atomic/zone
     * @method passion
     * @async
     * @param {Array} generator 构造每一个节点的 Promise 的专用函数
     * @param {any} input 第一个节点的 Promise 的输入参数
     * @returns {Promise<T>} 返回最终的 Promise 信息
     */
    passion: __Zn.passion,
    /**
     * ## 「引擎」`Ux.pipe`
     *
     * 输入可变长度参数相关信息，暂时支持：
     *
     * 1. 长度为1：必须输入 `reference`（React中的Component）
     *
     * 该方法主要位于 `then` 的函数链执行，执行过后会更新 React 组件中的状态，该方法有一定的副作用，因为它会执行一次`setState`，
     * 所以真正使用这个函数时通常放在整个链式结构的尾部，而尾部执行操作可让系统处于最终的**加载完成**的状态。
     *
     * >【巧】技巧代码
     *
     *
     *
     * ### 旧代码
     *
     * ```js
     *
     * const reference = "从外置传入的 reference ";
     * Ux.ajaxGet("/api/pipe").then(state => {
     *     reference.setState(state);
     *     return Ux.promise(state);
     * });
     *
     * ```
     *
     * ### 新代码
     *
     * ```js
     *
     * // 使用 pipe 过后的改动代码
     * const reference = "从外置传入的 reference ";
     * Ux.ajaxGet("/api/pipe").then(Ux.pipe(reference));
     *
     * ```
     *
     * @memberOf module:atomic/zone
     * @method pipe
     * @param {arguments} [arguments] 可变长度参数
     */
    pipe: __Zn.pipe,
    /**
     * ## 「引擎」`Ux.pipeOr`
     *
     * @memberOf module:atomic/zone
     * @method pipeOr
     * @params {ReactComponent} reference
     */
    pipeOr: __Zn.pipeOr,
    /**
     * ## 「引擎」`Ux.ready`
     *
     * 在 Zero Extension 中，内置了配置准备状态，state 中的 $ready，当界面 componentDidMount 执行完成后
     * 会将 $ready 设置成 true，该函数几乎是整个Zero Ui的核心，主要用于设置生命周期的完整。
     *
     * 1. $ready = false：等待配置完成。
     * 2. $ready = true：配置执行完成，执行过程可以是异步
     *
     * ### 旧代码
     *
     * ```js
     * const key = "1";
     *
     * Ux.ajaxGet("/api/user",key).then(state => {
     *      state.$ready = true;
     *      return Ux.promise(state);
     * });
     * ```
     *
     * ### 新代码
     *
     * ```js
     * // 使用 ready 过后的改动代码
     * const key = "1";
     *
     * Ux.ajaxGet("/api/user",key).then(Ux.ready);
     * ```
     *
     * 该方法只能作为`Monad`的中间节点，不可用于尾部节点或开始节点，只能处于函数链的中间环节，Zero中常用的一段代码如：
     *
     * ```js
     * // 下边代码是常用代码，可设置 $ready = true 来实现准备完成
     * <Promise>.then(Ux.ready).then(Ux.pipe(this));
     * ```
     *
     * > 在React组件的生命周期中，componentDidMount会执行Ajax的异步操作，到最后设置`$ready=true`的标识来表示回调
     * > 完成，而这种回调完成刚好可应用于当前组件，也就是说当`$ready=true`时，状态加载彻底完成。
     *
     * @memberOf module:atomic/zone
     * @method ready
     * @async
     * @param state 处理之前的原始状态信息，函数链上的 Monad
     * @returns {Promise<T>} 返回一个新的 Promise
     */
    ready: __Zn.ready,
    // atomic.foundation
    clone,
    immutable,
    remove,
    assign,
    // is.decision
    isSubset,
    isEmpty,
    isBlank,
    /**
     * ## 「标准」`Ux.isNotEmpty`
     *
     * （略）`isEmpty`函数的逆函数，判断结果和`isEmpty`相反。
     *
     * @memberOf module:is/zone
     * @param {any} input 输入的数据内容
     * @returns {boolean} 如果为空返回 false，否则返回 true
     */
    isNotEmpty: (input) => __Zn.isNotEmpty(input),
    isFunction, /* underscore 连接 */
    isArray,
    isSet,
    isObject,   /* 验证合法的对象 */
    isCollection,
    /**
     * ## 「标准」 `Ux.isTEntity`
     *
     * @memberOf module:is/zone
     * @param input
     * @returns {boolean|*}
     */
    isTEntity: (input) => __Zn.isTEntity(input),
    /**
     * ## 「标准」 `Ux.isTObject`
     *
     * @memberOf module:is/zone
     * @param input
     * @returns {boolean}
     */
    isTObject: (input) => __Zn.isTObject(input),
    // is.rule
    /* 规则判断 */
    isRule,
    isRuleAll,
    isRuleAny,
    // is.business
    isValid,
    /* REG正则判断 */
    isDateIso,  /* REG: ISO合法格式 */
    isCn,       /* REG: 中文 */
    isNumber,   /* REG: 合法整数 */
    isDecimal,  /* REG: 合法浮点数 */
    isCurrency, /* REG: 合法货币 */
    isFileName,
    /**
     * ## 「标准」`Ux.isFunctionName`
     *
     * 判断传入的函数名是否一个 Zero Ui 中的合法函数名，Zero中的三种核心函数名如下：
     *
     * 1. `rx`开头：专用的交互专用标准化函数，rx全称：Reactive Execute。
     * 2. `on`开头：HTML专用的原生态的专用函数
     * 3. `fn`开头：普通函数
     *
     * 其实还有一类函数以 `_` 打头，这种函数是内置函数（不公开）。
     *
     * @memberOf module:is/zone
     * @param {String} name 传入的函数名
     * @returns {Boolean}
     */
    isFunctionName: (name) => __Zn.isFunctionName(name),

    isBefore,
    isAfter,
    isTimeSame,

    /* 复杂判断 */
    isRange,    /* 验证范围 */
    isDiff,
    /**
     * ## 「标准」`Ux.isSame`
     *
     * （略）`isDiff`函数的逆函数，判断结果和`isDiff`相反。
     *
     * @memberOf module:is/zone
     * @param {Object | DataObject | DataArray} left 比对左值
     * @param {Object | DataObject | DataArray} right 比对右值
     * @returns {boolean} 不同返回 false，相同则返回 true
     */
    isSame: (left, right) => __Zn.isSame(left, right),
    /**
     * ## 「标准」`Ux.isMoment`
     *
     * @memberOf module:is/zone
     * @param input
     * @returns {Boolean}
     */
    isMoment: (input) => __Zn.isMoment(input),
    isParent,   /* 判断输入节点是否当前节点父节点 */

    /* 配置是否查询引擎配置 */
    isQr,
    /**
     * ## 「标准」`Ux.isQrArg`
     *
     * @memberOf module:is/zone
     * @param query
     * @returns {boolean|*}
     */
    isQrArg: (query) => __Zn.isQrArg(query),

    // o.silver.bullet
    /**
     * ## 「标准」`Ux.fn`
     *
     * Ux.fn(reference).xxx 方式调用函数，使用reference 构造对应的函数信息，需要注意的是：
     * 除了`onChange/onSelect`以外，其他所有函数都是以`rx`开始，`rx`在Zero Ui中的全称是：`Reactive X`，最初设计这种函数名的目的是区分
     * 不同的函数前缀，其中包括：
     *
     * |前缀|说明|
     * |---:|:---|
     * |on|HTML和Ant Design原生事件函数。|
     * |rx|自定义函数，Reactive X定义，Zero Ui专用函数。|
     * |fn|自定义纯函数，JavaScript Function对应的定义。|
     * |ix|「保留」内置专用函数，Internal X定义，Zero Ui保留的专用函数。|
     *
     * ### 1. 函数检索规则
     *
     * 1. 先从reference的state中读取对应函数，状态中的函数优先，和数据相反，状态中的函数有可能是在`componentDidMount`中定义的。
     * 2. 再从reference的props中读取函数。
     * 3. 如果都无法读取时则报错，该函数最终会返回函数引用。
     *
     * ### 2. 函数支持表
     *
     * |函数名|说明|
     * |---:|:---|
     * |onChange|原生HTML（包括AntD）常用的onChange方法。|
     * |onSelect|原生HTML（包括AntD）常用的onSelect方法。|
     * |rxSource|读取数据源的专用方法，组件中特定数据源的读取。|
     * |rxSubmit|提交函数。|
     * |rxClose|关闭函数。|
     * |rxViewQ|过滤函数。|
     * |rxSelect|选择函数。|
     * |rxTree|树操作函数。|
     * |rxChild|绑定子组件专用函数。|
     * |rxCheck|选择函数，Checkbox专用。|
     * |rxClean|清除函数，清除选中状态专用。|
     * |rxDropOver|拖拽时触发的悬停覆盖函数。|
     * |rxBack|返回函数。|
     * |rxJumpPage|跳页函数。|
     * |rxNext|下一步函数。|
     * |rxNextPage|下一页函数。|
     * |rxPrev|上一步函数。|
     * |rxPrevPage|上一页函数。|
     * |rxFirst|第一步函数。|
     * |rxFirstPage|第一页函数。|
     * |rxLast|最后一步函数。|
     * |rxLastPage|最后一页函数。|
     * |rxAdd|添加函数。|
     * |rxEdit|编辑函数。|
     * |rxDelete|删除函数。|
     * |rxRefresh|更新函数。|
     * |rxItemAdd|子项添加函数。|
     * |rxItemEdit|子项编辑函数。|
     * |rxItemDelete|子项删除函数。|
     *
     * ### 3. 编辑器函数支持表
     *
     * |函数名|说明|
     * |---:|:---|
     * |rxRowAdd|行添加函数。|
     * |rxRowDel|行删除函数。|
     * |rxRowFill|行扩展函数。|
     * |rxRowCompress|行压缩函数。|
     * |rxRowWrap|行交换函数。|
     * |rxRowConfig|行配置函数，写入顶层raft。|
     * |rxCellAdd|单元格添加函数。|
     * |rxCellMerge|单元格合并函数。|
     * |rxCellDel|单元格删除函数。|
     * |rxCellSplit|单元格拆分函数。|
     * |rxCellFill|单元格填充函数。|
     * |rxCellWrap|单元格交换函数。|
     * |rxCellConfig|单元格配置函数。|
     * |rxCellRefresh|单元格刷新函数。|
     *
     * > `rx`系列函数是Zero Ui中的最终标准！！！
     *
     * * {@link _Fn}
     *
     * @memberOf module:hoc/zone
     * @method fn
     * @param reference
     * @returns {_Fn}
     */
    fn,
    of,
    bind,
    // -------------------------------------- Not in Zone
    prevent,
    // 合并对象

    /* 遍历专用 */
    itRepeat,
    itAmb,
    itMatrix,
    itObject,
    itValue,
    itUi,
    itRow,
    itFull,
    itElement,
    itTree,
    // Future Loading
    future: __Zi.future,
}