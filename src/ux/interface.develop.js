import __Zn from 'zone';
import {_Debugger, _Logger} from 'zo';

/**
 * ## 「开发」`Ux.dgRouter`
 *
 * UI组件的日志记录器，记录所有的UI组件，打印当前系统中所有存在的路由组件
 * 该方法通常只在react-router的入口文件中使用，开发模式可知道生成代码生成的路由组件做统计。
 *
 * @memberOf module:development/zone
 * @param {Ux} Ux Utility X工具包。
 * @param {Object} container 布局容器组件。
 * @param {Object} component 页面核心组件。
 */
const dgRouter = (Ux, container, component) =>
    __Zn.dgRouter(Ux, container, component);


/**
 * ## 「开发」`Ux.dgDebug`
 *
 * （高频函数）通用 DEBUG 调试函数，直接调用即可，用于打印特定数据，第三参数可设置日志的颜色，
 * 如果不设置则使用`#eb2f96`作为默认色彩。
 *
 * ```js
 * import Ux from 'ux';
 * const user = { username:"Lang Yu" };
 * Ux.dgDebug(user, "用户信息");  // 使用默认色彩
 * ```
 *
 * @memberOf module:development/zone
 * @param {any} data 推荐使用输入的 Object。
 * @param {Object} prefix 消息前缀。
 * @param {WebColor} color 色彩值。
 * @return {any} 传入什么内容就打印什么内容（方便Fluent调用）。
 */
const dgDebug = (data = {}, prefix, color = {}) =>
    __Zn.dgDebug(data, prefix, color);
/**
 * ## 「开发」`Ux.dgQr`
 *
 * @memberOf module:development/zone
 * @param data
 * @param prefix
 * @returns {*}
 */
const dgQr = (data = {}, prefix) =>
    __Zn.dgQr(data, prefix);

/**
 * ## 「开发」`Ux.dgAdmit`
 *
 * @memberOf module:development/zone
 * @param input
 * @param name
 * @param isProp
 * @param config
 */
const dgAdmit = (input = {}, name, isProp = true, config = {}) =>
    __Zn.dgAdmit(input, name, isProp, config);

/**
 * ## 「开发」`Ux.dgAjax`
 *
 * （高频函数）通用 DEBUG 调试函数，主要调试 Ajax 请求响应专用，在开发模式以及`Z_DEV_MOCK`打开时候使用
 * 主要用于监控Ajax远程请求的数据信息，此处`prefix`为标识，主要用于鉴别在什么位置执行ajax调试专用。
 *
 * @memberOf module:development/zone
 * @param {any} data 输入的需要调试的数据信息。
 * @param {any} prefix 消息的前缀。
 * @return {any} 输入什么内容就返回什么内容（方便Fluent调用）。
 */
const dgAjax = (data, prefix) => __Zn.dgAjax(data, prefix);


/**
 * ## 「开发」`Ux.dgFileJson`
 *
 * （高频函数）通用 DEBUG 抓取数据格式的专用函数，该函数会抓取数据并且生成 Json 文件存储起来
 *
 * @memberOf module:development/zone
 * @deprecated
 * @param {any} data 输入的需要调试的数据信息。
 * @param {String} ext 扩展名，不设置则使用 `.json`。
 * @param {String} filename 下载的文件名，如果不设置则使用 `<uuid>.<ext>` 的格式。
 */
const dgFileJson = (data, filename, ext = "json") =>
    __Zn.dgFile(data, filename, ext);
/**
 * ## 「开发」`Ux.dgFile`
 *
 * （高频函数）通用 DEBUG 抓取数据格式的专用函数，该函数会抓取数据并且生成 Json 文件存储起来
 * @memberOf module:development/zone
 * @param {any} data 输入的需要调试的数据信息。
 * @param {String} ext 扩展名，不设置则使用 `.json`。
 * @param {String} filename 下载的文件名，如果不设置则使用 `<uuid>.<ext>` 的格式。
 */
const dgFile = (data, filename, ext = "json") =>
    __Zn.dgFile(data, filename, ext);

/**
 * ## 「开发」`Ux.dgQuery`
 *
 * 打印 React 组件中的特殊查询条件信息，从 `reference.state` 中提取
 *
 * * $terms：列过滤配置，用于存储列过滤的字段和类型。
 * * $filters：表单提交的查询条件配置，主要用于 ExForm 中的过滤提交设置。
 * * $condition：列过滤最终生成的条件信息。
 * * $query：状态中合并的起点查询条件，标配的 Query 结构。
 *
 * 下边是示例结构：
 *
 * ```json
 * {
 *     "pager": {
 *         "page": 1,
 *         "size": 10
 *     },
 *     "sorter": [
 *         "field,DESC"
 *     ],
 *     "criteria": {
 *     },
 *     "projection": []
 * }
 * ```
 *
 * @memberOf module:development/zone
 * @param {React.Component} reference React组件引用专用信息
 * @param {String} name 当前条件分析器日志名称
 */
const dgQuery = (reference = {}, name) =>
    __Zn.dgQuery(reference, name);


/**
 * ## 「开发」`Ux.dgGraphic`
 *
 * 打印图相关配置和数据信息，内部调用 `dgDebug` 函数，该函数目前只在 GEvent 内部使用，主要用于打印图专用的数据结构，
 * 和 dgDebug 不同的是颜色上会有区别，图日志的默认颜色为`#1A91FF`。
 *
 * @memberOf module:development/zone
 * @param {Object} input 输入的核心数据信息。
 * @param {String} message 打印的消息信息，会追加 GEvent 日志前缀。
 * @param {WebColor} color 色差专用字符串，Web色彩。
 */
const dgGraphic = (input, message, color = "#1A91FF") =>
    __Zn.dgGraphic(input, message, color);


/**
 * ## 「开发」`Ux.dgDiff`
 *
 * 打印两个对象的深度比对结果，打印差异性（比较两个对象专用）。
 *
 * @memberOf module:development/zone
 * @param {any} left 对比左值
 * @param {any} right 对比右值
 */
const dgDiff = (left, right) =>
    __Zn.dgDiff(left, right)


/**
 * ## 「开发」`Ux.dgTodo`
 *
 * 打印任务标签，颜色会有区别，内部调用dgDebug。
 *
 * @memberOf module:development/zone
 * @param {any} input 输入的数据对象
 * @param {String} message 输入信息
 */
const dgTodo = (input, message) =>
    __Zn.dgTodo(input, message)
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    Logger: _Logger,     // 专用日志器
    DevTool: _Debugger,    // 专用调试器
    dgTodo,
    dgRouter,
    dgDiff,
    dgDebug,
    dgQuery,
    dgAjax,
    dgFileJson,
    dgFile,
    dgGraphic,
    dgQr,

    // 新函数，标准化日志输出
    /**
     * ## 「开发」`Ux.dgJs`
     *
     * @memberOf module:development/zone
     * @param input
     * @param message
     * @param color
     * @returns {*}
     */
    dgJs: (input, message, color = "#FA7EBC") => __Zn.dgJs(input, message, color),
    dgAdmit,
    // 开发用参数集合
    /**
     * ## 「开发」`Ux.dgSkip`
     *
     * @memberOf module:development/zone
     * @param value
     * @param vDefault
     * @returns {*|boolean|boolean}
     */
    dgSkip: (value, vDefault = true) => __Zn.dgSkip(value, vDefault),

    // ComplexList 专用
    /**
     * ## 「开发」`Ux.dglQrV`
     *
     * @memberOf module:development/zone
     * @method dglQrV
     * @param reference
     * @param qr
     * @param query
     * @param server
     */
    dglQrV: __Zn.dglQrV,
    /**
     * ## 「开发」`Ux.dglQrC`
     *
     * @memberOf module:development/zone
     * @method dglQrC
     * @param reference
     * @param major
     */
    dglQrC: __Zn.dglQrC,

    /**
     * ## 「开发」`Ux.dglVColumn`
     *
     * @memberOf module:development/zone
     * @method dglVColumn
     * @param reference
     */
    dglVColumn: __Zn.dglVColumn,

    /**
     * ## 「开发」`Ux.dglVCriteria`
     *
     * @memberOf module:development/zone
     * @method dglVCriteria
     * @param reference
     */
    dglVCriteria: __Zn.dglVCriteria,

    /**
     * ## 「开发」`Ux.dglList`
     *
     * @memberOf module:development/zone
     * @method dglList
     * @param reference
     */
    dglList: __Zn.dglList,
    /**
     * ## 「开发」`Ux.dglApi`
     *
     * @memberOf module:development/zone
     * @method dglApi
     * @param reference
     * @param response
     */
    dglApi: __Zn.dglApi,
    /**
     * ## 「开发」`Ux.dglQrFilter`
     *
     * @memberOf module:development/zone
     * @method dglQrFilter
     * @param reference
     */
    dglQrFilter: __Zn.dglQrFilter,
    /**
     * ## 「开发」`Ux.dglQrSearch`
     *
     * @memberOf module:development/zone
     * @method dglQrSearch
     * @param reference
     */
    dglQrSearch: __Zn.dglQrSearch,
    /**
     * ## 「开发」`Ux.dglQrAdvanced`
     *
     * @memberOf module:development/zone
     * @method dglQrAdvanced
     * @param reference
     */
    dglQrAdvance: __Zn.dglQrAdvance,
    /**
     * ## 「开发」`Ux.dglViewUp`
     *
     * @memberOf module:development/zone
     * @method dglQrViewUp
     * @param reference
     */
    dglViewUp: __Zn.dglViewUp,
    /**
     * ## 「开发」`Ux.dglViewAt`
     *
     * @memberOf module:development/zone
     * @method dglViewAt
     * @param reference
     */
    dglViewAt: __Zn.dglViewAt,
}