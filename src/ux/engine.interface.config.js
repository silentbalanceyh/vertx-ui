import __Zs from 'zs';

/**
 * ## 「引擎」`Ux.configScroll`
 *
 * 计算表格中的 `scroll` 列自适应性的专用函数，不同的渲染器计算列宽度方法不同。
 *
 * @memberOf module:config/zest
 * @method configScroll
 * @param {Object} $table 传入的表格配置信息。
 * @param {Array} data 传入的表格数据信息。
 * @param {Object|ReactComponent} reference React对应组件引用。
 */
const configScroll = ($table = {}, data = [], reference) =>
    __Zs.configScroll($table, data, reference);
// ------------------ O.dialog.js
/**
 * ## 「引擎」`Ux.configDialog`
 *
 * 「标准配置」Dialog 专用的配置信息。
 *
 * 1. 先调用`aiExprWindow`解析`window`元素。
 * 2. 执行`onOk`的锚点连接函数
 * 3. 执行`onCancel`流程
 * 4. 执行防重复提交流程
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} config 窗口配置专用数据。
 * @return {Object} 返回处理好的窗口配置。
 */
const configDialog = (reference, config = {}) =>
    __Zs.configDialog(reference, config);
/**
 *
 * ## 「引擎」`Ux.configAnchor`
 *
 * 锚点专用函数信息
 *
 * Array类型
 *
 * ```js
 * [
 *    id1, id2
 * ]
 * ```
 *
 * Object
 *
 * ```js
 * {
 *    key1 = id1,
 *    key2 = id2
 * }
 * ```
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Array|Object} op 锚点按钮配置生成器。
 * @param {Function} callback 按钮执行函数，可以从callback中执行该函数。
 * @return {Array} 配置的最终锚点。
 */
const configAnchor = (reference, op, callback) =>
    __Zs.configAnchor(reference, op, callback);
/**
 *
 * ## 「引擎」`Ux.configIcon`
 *
 * 配置专用基础Icon
 *
 * Object
 *
 * ```js
 * {
 *     "item": {
 *         "icon": "xxx",
 *         "iconSize": 14,
 *         "color": "color"
 *     }
 * }
 * ```
 *
 * @memberOf module:config/zest
 * @param {Object} config 解析metadata专用。
 * @return {Object} 转换最终icon。
 */
const configIcon = (config = {}) =>
    __Zs.configIcon(config);
/**
 * ## 「引擎」`Ux.cabQuery`
 *
 * 返回绑定资源文件中的`_grid`专用列表配置信息，然后生成 query 执行的最终结果，读取位置：
 *
 * 1. `_grid.query`节点的数据读取
 * 2. qrCombine函数执行完成整体解析过程。
 *
 * ```json
 * {
 *     "_grid":{
 *         "query":{
 *             "criteria":{},
 *             "sorter": [],
 *             "pager":{
 *                 "page":1,
 *                 "size":10
 *             },
 *             "projection": []
 *         }
 *     }
 * }
 * ```
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabQuery = (reference, key = "grid") =>
    __Zs.cabQuery(reference, key);
// ---------------- O.table.js

/**
 * ## 「引擎」`Ux.configColumn`
 *
 * 「标准配置」Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 *
 * 配置信息如下：
 *
 * 1. 先使用`aiExprColumn`解析原始配置。
 * 2. 计算 $render 的不同模式
 * 3. 封装操作，底层调用 columnWrapper 专用封装函数（内置的）
 * 4. 追加 $filter 列过滤配置。
 * 5. 计算排序配置 sorter = true 时。
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Array} columns 当前Table组件的columns配置。
 * @param {Object} ops 当前列是否可操作列：如列中包含了编辑、删除按钮，如果出现扩展则执行扩展替换。
 * @return {Array} 返回处理过后的表格列信息。
 */
const configColumn = (reference, columns = [], ops = {}) =>
    __Zs.configColumn(reference, columns, ops);
/**
 * ## 「引擎」`Ux.configTable`
 *
 * 「标准配置」Table 专用的配置信息。
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} table 表格配置数据相关信息。
 * @param {Object} ops 外置处理的 executor 专用信息。
 * @return {Object} 返回处理好的配置信息。
 */
const configTable = (reference, table = {}, ops = {}) =>
    __Zs.configTable(reference, table, ops);
/**
 * ## 「引擎」`Ux.configExecutor`
 *
 * ### 统一执行 executor
 *
 * 函数格式：
 *
 * ```js
 * const fun = (reference) => (id, record) => {}
 * ```
 *
 * 1. reference：当前组件，如 ExTable
 * 2. id：记录的ID
 * 3. record：记录数据全部
 *
 * ### 合并 executor 的方式：
 *
 * 1. 来源于 reference.props 中的 $executor 变量
 * 2. 标准函数：
 *      * fnEdit：打开编辑Tab页专用
 *      * fnDelete：删除一行记录专用
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} executors 待绑定的事件专用信息。
 * @return {Object} 返回处理过后的 executors 信息。
 */
const configExecutor = (reference, executors) =>
    __Zs.configExecutor(reference, executors);
/**
 * ## 「引擎」`Ux.configExecutors`
 *
 * 「2阶」（略）该操作主要是编程过程中使用。
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} executors 待绑定的事件专用信息。
 * @return {Object} 返回处理过后的 executors 信息。
 */
const configExecutors = (reference, executors) =>
    __Zs.configExecutors(reference, executors);
// ---------------- O.form.js

/*
 * ## 引擎函数
 *
 * 配置专用方法，处理当前Form中的input控件专用信息，该配置方法为**上层方法**，直接从
 * 绑定的资源文件`Cab.json`引用的配置中读取相关配置。
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabForm = (reference = {}, key = "form") =>
    __Zs.cabForm(reference, key);
/**
 *
 * ## 「引擎」`Ux.capForm`
 *
 * 配置专用方法，该方法为**下层方法**，直接使用Object作为配置输入。
 *
 * cab: Cab.json 中读取的 form 配置
 *
 * ```json
 * {
 *     form:{
 *          className: "表单对应的CSS",
 *          window: 布局选择,
 *          columns: 使用 grid 时表单支持的布局
 *          ui: 布局信息
 *          hidden: 隐藏字段专用信息
 *          actions: {
 *              op: {
 *                  "Button的id": "SAction的 code"
 *          }
 *     },
 *     control: {
 *          id: "动态创建时的 control id",
 *          magic: {
 *              Ajax专用参数信息
 *          },
 *          uri: "默认远程的 uri",
 *          method: "调用远程的 uri对应的 Ajax 方法，默认 GET"
 *     }
 * }
 * ```
 *
 * program：通过编程方式传入的配置
 *
 * ```json
 * {
 *     key: "form",     // 默认使用 form
 *     jsx: {
 *         "字段名": (reference, jsx) => xxx，渲染函数
 *     },
 *     dynamic:{
 *         renders: {},
 *         extensions: {},
 *     },
 *     columns: （优先）使用 grid 时表单支持的布局,
 *     supplier: （优先）构造 magic 专用的 supplier，和上边的配置结合使用
 * }
 * ```
 *
 * capForm 主要用于设置 addOn 附加信息，最终返回数据结构
 *
 * ```json
 * {
 *     form: {
 *         window,
 *         className,
 *         ui,
 *         hidden,
 *         actions:{
 *             op: {}
 *         }
 *     },
 *     addOn: {
 *         columns:
 *         renders:
 *         dynamic:{
 *             renders: {},
 *             extensions: {}
 *         }
 *     },
 * }
 * ```
 *
 * supplier 响应格式（参考form）
 *
 * ```json
 * {
 *     className: "表单对应的CSS",
 *     window: 布局选择,
 *     columns: 使用 grid 时表单支持的布局
 *     ui: 布局信息
 *     hidden: 隐藏字段专用信息
 *     actions: {
 *     op: {
 *          "Button的id": "SAction的 code"
 *     }
 * }
 * ```
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} config 基本输入的配置信息。
 * @param {Object} program 编程传入的配置信息。
 * @return {Promise<T>} 返回异步的 Promise。
 */
const capForm = async (reference = {}, config = {}, program = {}) =>
    __Zs.capForm(reference, config, program);
/**
 * ## 「引擎」`Ux.configForm`
 *
 * 「标准配置」表单配置的标准处理方法，和 React 隔离的独立配置函数，处理 form 配置专用。
 *
 * @memberOf module:config/zest
 * @param {Object} form 传入的特殊Form配置，Object类型。
 * @param {Object} addOn 编程专用的Object类型。
 * @return {Object} 配置规范化完成后的Form数据。
 */
const configForm = (form, addOn = {}) =>
    __Zs.configForm(form, addOn);

/**
 * ## 「引擎」`Ux.configTab`
 *
 * 「标准配置」Tabs 专用的配置信息。
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} config 传入的配置数据信息。
 * @return {Object} 处理完成的配置数据。
 */
const configTab = (reference, config = {}) =>
    __Zs.configTab(reference, config);
/**
 * ## 「引擎」`Ux.cabTab`
 *
 * @memberOf module:config/zest
 * @param reference
 * @param key
 * @returns {*}
 */
const cabTab = (reference = {}, key = "tabs") =>
    __Zs.cabTab(reference, key);
/**
 * ## 「引擎」`Ux.cabTab`
 *
 * （异步）Tabs 页签专用函数，用于处理页签级别的配置信息，通常是 _tabs 节点
 *
 * @memberOf module:config/zest
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @param {Object} state 专用的状态，会被直接更改，追加 $tabs 变量。
 * @return {any}
 */
const capTab = (reference = {}, key = "tabs", state = {}) =>
    __Zs.capTab(reference, key, state);
export default {
    /**
     * ## 「引擎」`Ux.raftForm`
     *
     * 新函数，两种情况
     *
     * 1. 长度为1
     * 2. 长度为2
     *
     * 该函数只在内部调用。
     *
     * @memberOf module:config/zest
     * @method raftForm
     * @return {Promise<T>} 返回最终的 Promise。
     */
    raftForm: __Zs.raftForm,       // Legacy遗留系统
    cabForm,
    capForm,        // 异步处理（基本配置）
    configForm,     // 执行 raft 处理

    cabQuery,
    capTab,         // 异步配置
    cabTab,
    configTab,

    configScroll,
    configDialog,

    configAnchor,
    configIcon,     // 执行 config -> item 解析

    configColumn,
    configTable,
    configExecutor,
    configExecutors,
    /**
     * ## 「引擎」`Ux.widthWord`
     *
     * @memberOf module:width/zest
     * @param input
     * @param isPadding
     * @returns {number|number}
     */
    widthWord: (input, isPadding = true) => __Zs.widthWord(input, isPadding),
}