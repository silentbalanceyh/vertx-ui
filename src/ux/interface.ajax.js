// I.before.js
// import T from './unity';
// 开发专用
import __Zi from 'zi';
import __Zo from 'zo';

/**
 * ## 「标准」`Ux.ajaxResource`
 *
 * **非安全方法**，直接从当前站点读取资源相关信息
 *
 * > 这种模式只处理当前站点的 uri 路径，不结合 ENDPOINT 的路径执行远程请求
 *
 * @memberOf module:remote/zodiac
 * @method ajaxResource
 * @async
 * @param {String} uri 资源路径
 * @return {Promise<T>} 返回最终的 Promise
 */
const ajaxResource = (uri) => __Zo.ajaxResource(uri);
/**
 * ## 「标准」`Ux.ajaxUpload`
 *
 * **安全方法**（带token），上传专用的 Ajax 函数，文件上传专用的 Ajax 函数。
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {FormData} file 文件内容相关信息（Html中的数据）
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxUpload = (uri, file, options = {}) =>
    __Zo.ajaxUpload(uri, file, options);

/**
 * ## 「标准」`Ux.ajaxDownload`
 *
 * **安全方法**（带token），`GET`下载专用方法，下载内容会返回二进制数据
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {Object} params 下载文件的专用参数
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxDownload = (uri, params, options) =>
    __Zo.ajaxDownload(uri, params, options);

/**
 * ## 「标准」`Ux.ajaxPull`
 *
 * **安全方法**（带token）， `POST`下载专用方法，下载内容会返回二进制数据
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {Object} params 下载文件的专用参数，这种模式下一般存储于 Http 请求体 Body 中
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxPull = (uri, params, options) =>
    __Zo.ajaxPull(uri, params, options);

const Ajax = {
    ajaxResource,
    ajaxUpload,     // 上传
    ajaxPull,       // 下载（POST）
    ajaxDownload,   // 下载（GET）


    /**
     * ## 「标准」`Ux.ajaxFetch`
     *
     * **非安全方法**，GET开放性方法，从远程地址中直接读取远程请求数据的方法。
     *
     * @method ajaxFetch
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxFetch: (uri, params = {}, options) =>
        __Zo.ajaxFetch(uri, params, options),


    /**
     * ## 「标准」`Ux.microFetch`
     *
     * **非安全方法**，GET开放性方法，微服务模式下读取远程请求数据的方法。
     *
     * @method microFetch
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microFetch: (service, uri, params = {}, options) =>
        __Zo.microFetch(service, uri, params, options),

    /**
     *
     * ## 「标准」`Ux.ajaxPush`
     *
     * **非安全方法**，POST开放性方法，往远程地址推送数据的专用方法。
     *
     * @method ajaxPush
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPush: (uri, params = {}, options) =>
        __Zo.ajaxPush(uri, params, options),


    /**
     *
     * ## 「标准」`Ux.microPush`
     *
     * **非安全方法**，POST开放性方法，微服务模式下推送数据的专用方法。
     *
     * @method microPush
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPush: (service, uri, params, options) =>
        __Zo.microFetch(service, uri, params, options),


    /**
     * ## 「标准」`Ux.ajaxGet`
     *
     * **安全方法**（带token），GET开放性方法。
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxGet: (uri, params = {}, options) =>
        __Zo.ajaxGet(uri, params, options),


    /**
     * ## 「标准」`Ux.microGet`
     *
     * **安全方法**（带token），GET开放性方法。
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microGet: (service, uri, params, options) =>
        __Zo.microGet(service, uri, params, options),


    /**
     * ## 「标准」`Ux.ajaxPost`
     *
     * **安全方法**（带token），POST开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPost: (uri, params = {}, options) =>
        __Zo.ajaxPost(uri, params, options),

    /**
     * ## 「标准」`Ux.microPost`
     *
     * **安全方法**（带token），POST开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPost: (service, uri, params, options) =>
        __Zo.microPost(service, uri, params, options),


    /**
     * ## 「标准」`Ux.ajaxPut`
     *
     * **安全方法**（带token），PUT开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPut: (uri, params = {}, options) =>
        __Zo.ajaxPut(uri, params, options),


    /**
     * ## 「标准」`Ux.microPut`
     *
     * **安全方法**（带token），PUT开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPut: (service, uri, params, options) =>
        __Zo.microPut(service, uri, params, options),


    /**
     * ## 「标准」`Ux.ajaxDelete`
     *
     * **安全方法**（带token），DELETE开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxDelete: (uri, params = {}, options) =>
        __Zo.ajaxDelete(uri, params, options),

    /**
     * ## 「标准」`Ux.microDelete`
     *
     * **安全方法**（带token），DELETE开放性方法
     *
     * @async
     * @memberOf module:remote/zodiac
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microDelete: (service, uri, params, options) =>
        __Zo.microDelete(service, uri, params, options),
};

/**
 * ## 「标准」`Ux.messageSuccess`
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.success`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.success` 节点中的消息（旧代码兼容）。
 *
 * @memberOf module:message/zodiac
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageSuccess = (content = "", duration = 1.628) =>
    __Zo.messageSuccess(content, duration);

/**
 * ## 「标准」`Ux.messageFailure`
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.error`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.failure` 节点中的消息（旧代码兼容）。
 *
 *
 * @memberOf module:message/zodiac
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageFailure = (content = "", duration = 1.628) =>
    __Zo.messageFailure(content, duration);

/**
 * ## 「标准」`Ux.messageCatch`
 *
 * 和 Zero 框架中的数据规范配合的异常处理函数，Zero中的异常规范如下，code 为 Zero 的内部错误代码：
 *
 * ```json
 * {
 *     "code": -100017,
 *     "message": "异常系统消息",
 *     "info": "可读的界面交互信息"
 * }
 * ```
 *
 * @memberOf module:message/zodiac
 * @param {Object} error Zero中的异常对象。
 * @param {Function} callback 异常信息处理过后的回调函数。
 */
const messageCatch = (error = {}, callback) =>
    __Zo.messageCatch(error, callback);
/**
 * ## 「标准」`Ux.messageConfirm`
 *
 * @memberOf module:message/zodiac
 * @param content
 * @param onOk
 * @param width
 */
const messageConfirm = (content, onOk, width = 600) =>
    __Zo.messageConfirm(content, onOk, width);


/**
 * ## 「标准」`Ux.ajaxError`
 *
 * 错误信息专用函数，注，这里的 Component 的引用必须是绑定了`cab/cn/`中的资源文件的组件，
 * 资源文件中会自动包含 _dialog 的窗口键值，error的数据结构如：
 *
 * ```json
 * {
 *     "code": "错误代码，整数",
 *     "message": "错误信息",
 *     "info": "前端可读信息"
 * }
 * ```
 *
 * 处理最终的响应数据时候还需要考虑 redux 参数
 *
 * 1. redux = true，启用 redux 流程
 * 2. redux = false，不启用 redux 流程，仅使用当前组件流程，React 中的 state 状态流程
 *
 * @memberOf module:remote/zodiac
 * @param {React.Component} reference React组件引用
 * @param {Object} error Zero 的核心错误响应信息
 * @param {boolean} redux 是否启用了 redux 流程写 redux 的树形数据
 */
const ajaxError = (reference, error = {}, redux = false) =>
    __Zo.ajaxError(reference, error, redux);


/**
 *
 * ## 「标准2阶」`Ux.ajax2Dialog`
 *
 * 直接封装 ajaxDialog 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:remote/zodiac
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Dialog = (reference, key, redux = false) =>
    __Zo.ajax2Dialog(reference, key, redux);

/**
 * ## 「标准」`Ux.ajaxDialog`
 *
 * 弹出窗口专用函数，调用 Ant Design 中的 `Modal` 的弹出框处理，success, error, confirm 专用处理函数。
 * 在传入的 reference 引用中，props 属性中必须包含 `config` 对象（窗口配置信息），它的结构如下：
 *
 * ### 1. key 为 String
 *
 * 如果传入的 `key` 是字符串，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 *
 * ```json
 * {
 *     "dialog": {
 *         "modal": "模式信息",
 *         "title": {
 *              "success": "信息",
 *              "failure": "警告",
 *              "error": "错误",
 *              "confirm": "提示"
 *         }
 *     }
 * }
 * ```
 *
 * 执行了计算过后，会处理以下步骤
 *
 * 1. 根据 mode 计算窗口标题，从 `dialog`中的三种窗口中去读。
 * 2. 根据 pattern 数据计算最终的格式，Modal需要的。
 *
 * 计算的最终配置格式如：
 *
 * ```json
 * {
 *     "mode": "success | confirm | error",
 *     "title": "标题文本",
 *     "content": "内容使用 pattern 计算，执行 formatExpr 的格式化",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 2. key 为 Object
 *
 * 这是第二种配置模式，传入的 key 转换成 configuration 过后的数据格式如：
 *
 * ```json
 * {
 *     "title": "标题信息",
 *     "pattern": "未解析的模式",
 *     "content": "二选一，是否执行 formatExpr 的格式化操作",
 *     "model": "success | confirm | error",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 3. 最终格式
 *
 * 不论 key 的传入类型是哪种，最终的处理格式如"
 *
 * ```json
 * {
 *     "title": "",
 *     "content": "",
 *     "mode": ""
 *     "redux": ""
 * }
 * ```
 *
 * @memberOf module:remote/zodiac
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxDialog = (reference, {
    data, key, redux = false
}) => __Zo.ajaxDialog(reference, {data, key, redux});

/**
 * ## 「标准2阶」`Ux.ajax2Message`
 *
 * 直接封装 ajaxMessage 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:remote/zodiac
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Message = (reference, key, redux = false) =>
    __Zo.ajax2Message(reference, key, redux);
/**
 * ## 「标准」`Ux.ajaxMessage`
 *
 * 该函数只支持一种格式，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 * 但由于是 message 所以只考虑最终的 pattern 配置，并且使用 data 来执行 formatExpr 得到最终
 * 的 content 相关数据，消息只执行两种模式
 *
 * * success：成功相关信息
 * * <any>：其他模式，直接执行 failure 的错误消息提示
 *
 * @memberOf module:remote/zodiac
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxMessage = (reference, {
    data, key,
}) => __Zo.ajaxMessage(reference, {data, key});


/**
 * ## 「标准2阶」`Ux.ajax2True`
 *
 * 当前 ajax 比较特殊，ajax 请求只会响应 true 或 false，根据最终结果执行相关操作
 *
 * @memberOf module:remote/zodiac
 * @param {Function} consumer 执行的核心函数，在响应数据为 true 时执行该函数
 * @param {String} content 消息中呈现的消息内容
 * @return {Function} 返回一个函数消费 true | false 的相关结果
 */
const ajax2True = (consumer, content) => __Zo.ajax2True(consumer, content);

/**
 * ## 「引擎」`Ux.ajaxEager`
 *
 * 异步表格列渲染专用预处理函数。在表格渲染中，如果使用了字典如：
 *
 * ### 字典配置
 *
 * ```json
 * [
 *      {
 *          "key": "9db923a3-e13b-4e4f-b468-8f026c9aa1ab",
 *          "name": "测试标签"
 *      },
 *      {
 *          "key": "72180b29-8c33-4419-a312-405d66a67521",
 *          "name": "正式标签"
 *      },
 *      {
 *          "key": "1dd8ff65-b570-483d-a98d-fe987fd25c03",
 *          "name": "特殊标签"
 *      }
 * ]
 * ```
 *
 * 上述结构中，表格列里存储的数据是 key，而不是 name，但在表格呈现时需要呈现 name字段的信息，这种情况下需要执行 ajaxEager
 * 进行预处理。如配置和数据分别如下：
 *
 * ### config 配置
 *
 * ```json
 * [
 *      {
 *          "dataIndex": "labelKey",
 *          "title": "标签",
 *          "$render": "USER",
 *          "$config": {
 *              "uri": "异步专用Ajax",
 *              "expr": "呈现专用表达式",
 *              "field": "name，读取数据中需要解析的字段"
 *          }
 *      }
 * ]
 * ```
 *
 * ### data 数据
 *
 * ```json
 * [
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录1" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录2" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录3" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录4" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录5" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录6" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录7" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录8" }
 * ]
 * ```
 *
 * ### 核心分析
 *
 * 上述数据中，只有两类`labelKey`出现，如果表格的每个单元格都调用 Ajax 异步处理数据，那么上述数据会执行`8`次异步访问记录
 * 而 `ajaxEager` 函数就是为这种情况量身打造的异步渲染函数，如果调用`ajaxEager`则只会访问两次，通过这种方式在一页呈现数据
 * 量大的时候会大规模减少和服务端的交互，为了性能考虑，可以使用这个函数来实现，上述例子中最终函数会返回如下数据格式。
 *
 * ```json
 * {
 *      "9db923a3-e13b-4e4f-b468-8f026c9aa1ab": "测试标签",
 *      "72180b29-8c33-4419-a312-405d66a67521": "正式标签"
 * }
 * ```
 *
 * 上述结构是当前页的数据中的数据，`特殊标签`由于在本页数据中没使用，所以不会读取到，ajaxEager函数主要的实现考虑有两点：
 *
 * * 减少和服务端交互的次数，根据本页数据直接分页构造分组型请求。
 * * 减少所需数据量，只读取合法字典中的数据。
 *
 * @async
 * @memberOf module:remote/zion
 * @param {Object} reference 【保留】React组件引用
 * @param {Array} columns 表格配置中的 `columns` 属性
 * @param {Array} data 表格已经加载好的二维数据信息
 * @return {Promise<T>} 特殊结构处理表格渲染专用
 */
const ajaxEager = (reference, columns = [], data = []) =>
    __Zi.ajaxEager(reference, columns, data);


/**
 * ## 「标准」`Ux.asyncTrue`
 *
 * 异步验证专用函数，不返回 Promise，直接使用 `callback`模式，主要在 `validator` 中使用，几个参数的格式如下：
 *
 * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### callback 格式
 *
 * ```json
 * {
 *     success: "成功的回调函数",
 *     failure: "失败的回调函数"
 * }
 * ```
 *
 * 如果 callback 返回值是 true，则执行 success；如果 callback 返回值是 false，则执行 failure，二选一的 callback 执行，
 * 而这里其实不分 `success / failure`，仅根据成功响应过后的 `true/false`选择不同函数执行。
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {Object} callback 回调函数结构
 * @param {JObject} mock 模拟数据格式信息
 */
const asyncTrue = (config = {}, params = {}, callback = {}, mock = {}) =>
    __Zo.asyncTrue(config, params, callback, mock);


/**
 * ## 「标准」`Ux.asyncData`
 *
 * 异步读取专用函数
 *
 *  * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### callback 格式
 *
 * 回调函数，如果成功响应，则直接执行 callback 函数，将响应信息作为回调函数的参数。
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @memberOf module:remote/zodiac
 * @async
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {Function} callback 回调函数结构，仅在成功时调用 callback，不执行失败处理
 * @param {JObject} mock 模拟数据格式信息
 */
const asyncData = (config = {}, params = {}, callback = () => {
}, mock = {}) => __Zo.asyncData(config, params, callback, mock);


/**
 * ## 「标准」`Ux.asyncPromise`
 *
 * 无回调函数的直接执行，该函数和`asyncData`类似，只是是非回调模式，而是直接返回 Promise。
 *
 *
 *  * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {JObject} mock 模拟数据格式信息
 * @return {Promise<T>} 返回异步构造好的 Promise
 */
const asyncPromise = (config = {}, params = {}, mock = {}) =>
    __Zo.asyncPromise(config, params, mock);
/**
 * ## 「标准」`Ux.asyncValidate`
 *
 * 标准函数，用于执行 `async-validator` 的验证，config的数据结构如下
 *
 * ```json
 * {
 *     "field1": [
 *         "rule1",
 *         "rule2"
 *     ],
 *     "field2": [
 *         "rule1",
 *         "rule2"
 *     ]
 * }
 * ```
 *
 * 返回的数据结构：
 *
 * 1. 如果成功：直接返回 params 相关信息
 * 2. 如果失败：调用 Promise.reject 方式返回
 *
 * 失败返回的数据结构：
 *
 * {
 *     "errors": [
 *         {
 *             "message": "xxxx",
 *             "field": ""
 *         }
 *     ],
 *     "failure": false,
 *     "data": "errors[1].message消息值"
 * }
 *
 * @async
 * @memberOf module:remote/zion
 * @param {Object} config 验证专用配置
 * @param {Object} params 待验证的数据信息
 * @param {reference} reference 传入部分的数据
 * @return {Promise<T>} 返回异步专用的 Promise
 */
const asyncValidate = (config = {}, params = {}, reference) =>
    __Zi.asyncValidate(config, params, reference);
/**
 * ## 「标准」`Ux.asyncImage`
 *
 * 二进制数据在加载图片时专用方法，构造异步Promise，item 的数据结构：
 *
 * ```json
 * {
 *     "type": "文件的MIME类型，如image/jpeg",
 *     "thumbUrl": "被更改的图片专用Url，该方法需修改此内容"
 * }
 * ```
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param item {Object} 图片文件对象
 * @param blob {Blob} 二进制对象流
 * @return {Promise<T>} 返回异步构造好的 Promise
 */
const asyncImage = (item = {}, blob) => __Zo.asyncImage(item, blob)
/**
 * ## 「标准」`Ux.asyncWrap`
 *
 * 专用异步回调，可处理 catch 部分的详细错误信息
 *
 * @async
 * @memberOf module:remote/zodiac
 * @param reference {Object} React组件引用
 * @param message {Object} 二进制对象流
 * @param rxRunner {Function} 构造 Promise 专用的函数
 * @return {Promise<T>} 返回异步构造好的 Promise
 */
const asyncWrap = (reference, message = {}, rxRunner) =>
    __Zo.asyncWrap(reference, message, rxRunner);

/**
 * ## 「标准」`Ux.rxEdict`
 *
 * 基于 Observable 的 Redux 函数，和 Ajax 相关的响应式函数，框架内的使用代码如下：
 *
 * ```js
 * export default {
 *     // 读取 tabular 的专用 redux 类型的响应式 Ajax 处理
 *     epicTabular: Ux.rxEdict(Types.epicTabular, I.tabular, data => Ux.rxDatum(data))
 * }
 * ```
 *
 * EmptyActionCreator 的原始创建代码如下：
 *
 * ```js
 * import createAction from 'redux-act';
 * const action = createAction("REDUX//ACTION//NAME");
 * ```
 *
 * @memberOf module:rx/zion
 * @async
 * @param {EmptyActionCreator} type 创建好的 Redux 中的 Action，和 `redux-act` 绑定
 * @param {Promise<T>} promise 构造的Ajax类型的异步Promise
 * @param {Function} responser 响应处理器，默认使用 `data => data` 不执行任何处理，需要转换则直接执行转换。
 * @return {any} 返回 redux 和 rxjs 中的核心监听对象，用于执行最终输出
 */
const rxEdict = (type, promise, responser = data => data) =>
    __Zi.rxEdict(type, promise, responser);
/**
 * ## 「标准」`Ux.sockOn`
 *
 * @memberOf module:remote/zodiac
 * @param address
 * @param callback
 */
const sockOn = (address, callback) => __Zo.sockOn(address, callback)
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    sockOn,
    // Web Socket
    rxEdict,
    // 不更改Ajax部分
    ...Ajax,
    // 特殊
    ajaxEager,

    // 异步处理
    asyncTrue,
    asyncData,
    asyncPromise,
    asyncImage,
    asyncWrap,
    asyncValidate,

    // 回调
    ajaxError,
    ajaxDialog,
    ajaxMessage,

    ajax2Dialog,    // 2阶
    ajax2Message,   // 2阶
    ajax2True,      // 2阶
    // message.js
    messageSuccess,
    messageFailure,
    messageCatch,
    messageConfirm,
}