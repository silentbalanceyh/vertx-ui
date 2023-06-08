import __Zi from 'zi';

/**
 * ## 「标准」`Ux.qrForm`
 *
 * 针对查询专用表单的条件数据收集处理，构造查询$filters变量专用，收集表单中的条件数据构造查询条件信息，
 *
 * 1. connector有两个值：`AND | OR`，用于设置条件和条件之间的条件连接符。
 * 2. 如果条件中遇到值：`__DELETE__`的值，则将该条件删除掉。
 * 3. 系统会搜索同名属性，和`op`组合成最新条件，完成搜索表单的提交操作。
 *
 * > 最终生成的查询条件可在日志中查看。
 *
 * @memberOf module:qr/zion
 * @method qrForm
 * @param {Object} input 输入的字段信息。
 * @param {String} connector 查询条件。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终查询条件，写入$filters变量。
 */
const qrForm = (input, connector = "AND", reference) =>
    __Zi.qrForm(input, connector, reference);
/**
 * ## 「标准」`Ux.qrNorm`
 *
 * @memberOf module:qr/zion
 * @param condition
 * @param configuration
 */
const qrNorm = (condition = {}, configuration = {}) =>
    __Zi.qrNorm(condition, configuration);
/**
 * ## 「标准」`Ux.qrTerms`
 *
 * 收集列中的`$filter`过滤配置数据，生成最终的 $terms 变量。
 *
 * @memberOf module:qr/zion
 * @param {Array} columns 列过滤中的所有列配置数据
 * @returns {Object} 返回列配置构造的数据
 */
const qrTerms = (columns = []) =>
    __Zi.qrTerms(columns);


/**
 * ## 「标准」`Ux.qrInput`
 *
 * 单独输入框的搜索条件构造专用函数，如果清除则值设为`__DELETE__`。
 *
 * @memberOf module:qr/zion
 * @param {Array} cond 查询条件字段信息。
 * @param {any} value 值信息，如果无值则清除条件。
 */
const qrInput = (cond = [], value) =>
    __Zi.qrInput(cond, value);
/**
 *
 * ## 「标准」`Ux.qrCombine`
 *
 * 查询引擎专用的合并函数，深度计算，内部使用了`QQuery`对象。
 *
 * 1. 以`query`参数为基础查询引擎数据，构造模式`(query,reference)`。
 * 2. 两个参数构造`QQuery`对象，然后将condition用AND方式追加到查询条件中。
 *
 * > 注，最终条件会移除掉`__DELETE__`值的条件。
 *
 * @memberOf module:qr/zion
 * @method qrCombine
 * @param {Object} query 查询条件。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String[]} condition 查询条件处理。
 * @returns {any} 返回最终的 query 结构。
 */
const qrCombine = (query = {}, reference, ...condition) =>
    __Zi.qrCombine.apply(this, [query, reference].concat(condition));

/**
 * ## 「标准」`Ux.qrCommon`
 *
 * 复杂内容核心操作，用于设置默认的 $query 信息
 *
 * ### 优先级选取
 *
 * 1. props 中的 $query 优先
 * 2. config 中的 query 第一级，直接合并 config.query （全合并）
 * 3. config 中的 ajax.magic 合并（需解析，只合并 criteria）
 *
 *
 * @memberOf module:qr/zion
 * @method qrCommon
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} config 查询配置
 * @returns {Object} 返回最终的 query 结构。
 */
const qrCommon = (reference, config) =>
    __Zi.qrCommon(reference, config);

/**
 * ## 「标准」`Ux.qrComplex`
 *
 * 复杂模式的处理流程，三合一的查询条件处理，处理不同情况的查询条件，执行合并。
 *
 * 1. `$condition`：当前环境的基础条件，该基础条件受`列过滤`的影响，触发了列过滤后该变量会受到影响。
 * 2. `$terms`：该变量是计算基础，保存了列中定义了`filter`的列配置，换算过后的定义结果会保存在 $terms 变量中。
 * 3. `$filters`：该变量保存的是高级搜索表单存储的最终查询条件。
 *
 * 需要说明查询条件来自于几个源头：
 *
 * 1. props属性中的$query条件，同时包含config配置中的条件，最终计算存储在state中，生成$query新变量（状态中）。
 * 2. 如果是列过滤功能，则直接修改$condition变量的值。
 * 3. 如果是基础搜索和高级搜索，则直接修改$filters变量的值。
 *
 * > 所以最终查询条件的计算是：reference.state中的`$query + $condition + $filters`三者合一，借用`QQuery`实现查询条件的复杂运算。
 *
 * @memberOf module:qr/zion
 * @method qrComplex
 * @param {Object} query 查询条件专用结构。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终的 query 结构。
 */
const qrComplex = (query = {}, reference) =>
    __Zi.qrComplex(query, reference);

/**
 * ## 「标准」`Ux.qrInherit`
 *
 * 计算Qr需要的继承变量，用于继承查询条件专用。
 *
 * 1. 先从props中读取$query变量。
 * 2. 如果未传递props属性中的$query，则从state中读取：`state.query`信息（ListComplex中使用）
 *      * ExListComplex
 *      * ExListQuery
 *      * ExListOpen
 *
 * 以上三个组件为目前使用query继承的组件。
 *
 * @memberOf module:qr/zion
 * @method qrInherit
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终的 query 结构。
 */
const qrInherit = (reference) =>
    __Zi.qrInherit(reference);
/**
 * ## 「标准」`Ux.qrMessage`
 *
 * @memberOf module:qr/zion
 * @param data
 * @param config
 * @param form
 * @returns {*}
 */
const qrMessage = (data = {}, config = {}, form = {}) =>
    __Zi.qrMessage(data, config, form);
// ------------------ New Api for Qr Engine ( Support Updating )
/**
 * ## 「标准」`Ux.qrNil`
 *
 * @memberOf module:qr/zion
 * @param condition
 * @returns {*}
 */
const qrNil = (condition) => __Zi.qrNil(condition);
/**
 * ## 「标准」`Ux.qrOne`
 *
 * @memberOf module:qr/zion
 * @param condition
 * @returns {*}
 */
const qrOne = (condition) => __Zi.qrOne(condition);
/**
 * ## 「标准」`Ux.qrOp`
 *
 * @memberOf module:qr/zion
 * @param condition
 * @returns {*}
 */
const qrOp = (condition) => __Zi.qrOp(condition);
// reference will provide the parameters for syntax parsing here.
/**
 ## 「标准」`Ux.qrAndH`
 *
 * @memberOf module:qr/zion
 * @param reference
 * @param criteria
 * @param field
 * @param value
 * @returns {*}
 */
const qrAndH = (reference = {}, criteria, field, value) =>
    __Zi.qrAndH(reference, criteria, field, value);
/**
 * ## 「标准」`Ux.qrAndH`
 *
 * @memberOf module:qr/zion
 * @param reference
 * @param query
 * @param field
 * @param value
 * @returns {*}
 */
const qrAndQH = (reference, query, field, value) =>
    __Zi.qrAndQH(reference, query, field, value);
export default {
    qrNil,
    qrOne,
    qrOp,
    /*
     * 对应后端
     * Ux.irAndH
     * Ux.irAndQH
     */
    qrAndH,
    qrAndQH,
    /*
     * 三层组件：
     * -- Component Parent -> $condition
     * -- Component -> Search $condition
     * -- Component -> $query ( 默认条件 )
     */

    qrComplex,
    qrCombine,
    qrCommon,
    qrInherit,
    /*
     * 列筛选中配置了 $filter，需要根据 $filter 生成配置
     * 1）$filter 的类型信息
     * 2）$filter 列的数据类型（后端查询需要使用）
     */
    qrTerms,
    /*
     * 清除当前 $condition 的条件
     * 清除当前 $searchText
     */
    // qrClear,
    /*
     * 提取参数专用方法
     * 1）qrInput：单字段多值 Or 连接（主要针对单独输入框）
     * 2）qrForm：完整表单（针对Form提交的核心数据）
     */
    qrInput,
    qrForm,
    qrNorm,
    qrMessage,
    // Internal Qr API
    /**
     * ## 「标准」`Ux.irData`
     *
     * @memberOf module:qr/zion
     * @param reference
     * @returns {*}
     */
    irData: (reference) => __Zi.irData(reference),
    /**
     * ## 「2阶标准」`Ux.irSubmit`
     *
     * 来源：`zion/query.fn.ir.syntax.calculate.js`
     *
     * ### 基本介绍
     *
     * 核心查询引擎专用方法 `irSubmit`，转入到 `Ex` 库之后通常会使用 `rxQrSubmit` 函数构造，用于直接处理查询条件专用
     *
     * ```js
     *     // utter/channel.grid.fn.yo.list.segment.js 中
     *     attrs.qrFilter = Ux.irSubmit(reference);
     * ```
     *
     * 此API会生成一个函数，生成函数基本签名如：`(state, addOn)`，其中：
     *
     * - state：当前组件的状态信息。
     * - addOn：附加属性通常用于配置处理，附加属性的意义在于可以直接覆盖当前组件的状态信息，最终执行
     *
     *     ```js
     *     Object.assign(response, addOn);
     *     ```
     * - 函数返回值为一个 `Promise`，内部内容为更新之后的状态基本信息
     *
     * > 注意区分此处的 reference.state 和 state 不是同一个东西，它们通常会通过父子级结构来完成整体构造
     * >
     * > - 父组件：reference，所以 reference.state 是父组件状态
     * > - 子组件：state，此处 state 是子组件状态，通常是内置组件状态
     *
     * > 此处生成函数可以理解成一个 **闭包**，而且是闭包的典型调用。
     *
     * ### 内部执行流程
     *
     * 1. 先拷贝外层对象状态中的 `$queryView` 属性和 `$terms` 属性
     *      - $queryView 负责当前默认视图变量（初始查询条件）
     *      - $terms 则是列过滤专用变量，触发列过滤的条件
     * 2. 使用默认查询条件副本构造查询对象 `QQuery`
     * 3. 根据表单中的输入构造状态中的核心变量，此处提取 `reference.state` 中的 `$terms` 属性，不直接使用是为了兼容其他调用端入口
     *
     *      ```js
     *      {
     *          "$condition": {
     *              "field1": [],
     *              "field2": []
     *          },
     *          "$qr": {
     *
     *          },
     *          $keyword: {
     *              "field1":
     *          }
     *      }
     *      ```
     * 4. 上述构造的三个条件参数如下：
     *      - $condition：构造的条件变量，此变量专用于列渲染，和 AntD 中 `<Column/>` 的 `filters` 对应，主结构为 Object，键值对是 `key = []`，每一个元素数组中就是查询条件包含的值。
     *      - $keyword：关键字条件变量，列表中 `<Column/>` 是受控元素，所以如果是搜索类输入框 `SEARCH` 类型，则必须将关键字文字填充到文本搜索框中以实现状态的统一和同步，才能保证列过滤中提交和重置动作生效。
     *      - $qr：当前环境中运行专用的条件语法，此处是核心查询引擎条件树，且执行过从 Server -> Client 的转换（主要是将 `""` 连接符转换成 `connector` 连接符），转换主要解决 AntD 中表单字段名不能为 `""` 的问题。
     * 5. 然后触发查询条件的标准化，查询引擎中的条件可设置输入数据值的源头，如：
     *      - `PROP` 前缀表示从属性中取数，`STATE` 前缀表示从状态中取数，等等。
     *      - 如果值遇到了 `__DELETE__` 则表示此查询条件会直接从变量中移除，不会进入到查询条件中。
     *      - 值解析过程默认使用 `strict = true` 的严格模式，会检查数据类型，并且生成严格数据类型（非文本类型可能不使用字符串）。
     * 6. 将构造好的查询条件追加到 `QQuery` 中，直接使用 `and` 连接符。
     *
     * > 注：内部流程会直接调用状态更新的 `setState` 方法以保证外层状态会被直接更新，最终返回的是 `Promise`。
     *
     * ### 调用端
     *
     * 1. 正常模式下父组件会构造合法的 `rxQrSubmit` 函数给子组件，调用时可使用快速模式：
     *
     *      ```ts
     *      qrFilter(qr: any = undefined, addOn = {}) {
     *          const state: any = {};
     *          state.$qr = qr;
     *          return this._fn.rxFilter(state, addOn);
     *      }
     *      ```
     *
     * 2. 当然您也可以直接通过从属性中提取的方式进行调用：
     *
     *      ```js
     *      // 此处引用是当前引用
     *      const { rxFilter } = reference.props;
     *      if(Ux.isFunction(rxFilter)){
     *          rxFilter(state, addOn);
     *      }
     *      ```
     * 3. 或者使用高阶对象调用
     *
     *      ```js
     *      // 只要是在属性表中支持的方法都可以使用这种方式调用
     *      // 1. props 第一优先级
     *      // 2. state 第二优先级
     *      Ux.fn(reference).rxFilter(state, addOn);
     *      ```
     *
     * ### 示例：`ExSearch` 中
     *
     * * 来源：`unfold/aero-extension/ExSearch/QView.Op.js`
     *
     * ```js
     * // 关闭当前窗口
     * import Ux from "ux";
     *
     * const updatedQr = __qrCalc(reference, $qrUp);
     * Ux.of(reference)._.qrFilter(updatedQr, {
     *     $spinning: true, $loading: true,
     * }).then(() => {
     *
     *     Ux.of(reference).submitted().in({$visibleQ: false}).done();
     * })
     * ```
     *
     * 上述调用中，由于 `QView` 是内层组件，所以在执行完成之后会直接更新主界面上层组件中的状态，且此处还不是单纯的一二阶关系. `ExListComplex / ExSearch / QrCriteria` 的整体结构，此处就是 `ExSearch` 调用上层传入的 `rxQrSubmit` 函数来构造主组件中的核心查询条件以实现外层列表的查询条件定义。
     *
     * @memberOf module:qr/zion
     * @async
     * @param {ReactComponent} reference React对应组件引用（此处 reference 是外层引用，构造一阶函数时的组件）
     * @returns {Promise} 返回最终构造好的状态数据的 Promise。
     */
    irSubmit: (reference) => __Zi.irSubmit(reference),
    /**
     * ## 「标准」`Ux.irSwitcher`
     *
     * @memberOf module:qr/zion
     * @param reference
     * @returns {*}
     */
    irSwitcher: (reference) => __Zi.irSwitcher(reference)
}