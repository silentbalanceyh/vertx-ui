import __Zro from 'zero';

/**
 * ## 「引擎」`Ux.sexBatch`
 *
 * 批量专用函数，用于处理批量按钮的特殊配置提取（同时从 props 属性和 state 状态中提取数据），内部调用代码如：
 *
 * ```js
 *
 * // 专用的批量处理按钮设置器。
 * const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
 *      const {options = {}} = reference.state;
 *      const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
 *      return Ux.ajaxPut(uri, params);
 * }, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
 * ```
 *
 * @memberOf module:sex/zero
 * @method sexBatch
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Function} callback 回调函数处理。
 * @param {Object} config 传入的配置数据。
 */
const sexBatch = (reference, callback, config = {}) =>
    __Zro.sexBatch(reference, callback, config);

/**
 * ##「引擎」`Ux.sexCab`
 *
 * 配置增强读取的多义性函数。
 *
 * 1. 如果 key 传入为 undefined，则直接从 `props`中读取 `config` 变量，默认：`{}`。
 * 2. 如果 key 是字符串不带 `.` 操作符，则直接读取资源文件中的 `_<key`，内部调用 `fromHoc`（高频方式）。
 * 3. 如果 key 是字符串带 `.` 操作符，则直接将该值如：`key.xt` 转换成 `["key","xt"]`，对应 `_key -> xt` 节点。
 * 4. 如果 key 是Array，则执行 `fromPath` 方法。
 *
 * 该方法保证最终得到的值是合法的。
 *
 * @memberOf module:sex/zero
 * @param {Object|ReactComponent} reference React组件引用
 * @param {String} key 将要读取的配置的 key 值信息
 * @return {any} 返回读取到的最终信息
 */
const sexCab = (reference = {}, key) =>
    __Zro.sexCab(reference, key);


/**
 * ## 「引擎」`Ux.sexOp`
 *
 * 1. events 会根据 op 节点的 key 值执行绑定，绑定时会调用一次
 *
 *      `events[op.key](reference)，所以必须是一个二阶函数`
 * 2. op 的数据结构参考下表
 *
 * ```json
 *
 * "_op": [
 *     {
            "key": "$opSave",
            "text": "保存",
            "icon": "save",
            "type": "primary"
 *     }
 * ]
 * ```
 *
 * @memberOf module:sex/zero
 * @method sexOp
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Object} events 绑定的事件信息
 * @return {Array} 生成最终的 操作集合
 */
const sexOp = (reference, events = {}, key = "op") =>
    __Zro.sexOp(reference, events, key);


/**
 * ## 「引擎」`Ux.sexModal`
 *
 * 内部使用组件`DialogButton`用于渲染带窗口操作按钮，`fnRender`渲染部分位于窗口内部。
 * 从 `key` 中提取资源文件配置，如果配置中包含了 `dialog` 和 `button` 则满足渲染条件，
 * 这种情况下，执行窗口配置，包括配置 onOk, onCancel 等函数和关闭函数，最终生成合法的配置
 * 传入到`DialogButton`组件中，形成带窗口的事件按钮。
 *
 * 最终计算的配置结构如：
 *
 * ```json
 * {
 *     "$mode": "窗口类型",
 *     "$dialog": "<窗口配置>",
 *     "$button": "<按钮操作>",
 *     "$loading": "<加载状态>"
 * }
 * ```
 *
 *
 * @memberOf module:sex/zero
 * @method sexModal
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} key 读取配置专用的 Key，内部调用 `sexCab` 方法确认配置可读取。
 * @param fnRender 渲染函数。
 * @return {Jsx} 返回最终渲染的Jsx。
 */
const sexModal = (reference, key, fnRender) =>
    __Zro.sexModal(reference, key, fnRender);
/**
 * ## 「引擎」`Ux.sexIdentifier`
 *
 * 前端标识规则选择器
 *
 * 根据配置执行标识规则选择，配置数据格式如：
 *
 * ```json
 * {
 *     "dataKey": "<抓取含有标识规则的字典>",
 *     "parentField": "<标识规则的父字段字段名>"
 * }
 * ```
 *
 * 选择规则：
 *
 * 1. 第一选择：直接选择`props`中的 `$identifier` 属性值作为第一选择标识规则。
 * 2. 第二选择：从 `dataKey` 中读取 Assist 数据，然后执行 treeShared 来执行选择。
 *
 * > 当前选择是选择 $options 相关的树中查找到的节点的 identifier 数据。
 *
 * @memberOf module:sex/zero
 * @method sexIdentifier
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} config 标识规则选择配置。
 * @return {any} 返回的 identifier。
 */
const sexIdentifier = (reference, config = {}) =>
    __Zro.sexIdentifier(reference, config);

/**
 * ## 「引擎」`Ux.sexTable`
 *
 * 内部调用 `sexCab` 读取表格配置，一般 `key` 取 `table`，该配置可直接被
 * Ant Design中的`<Table/>`组件直接消费。
 *
 * @memberOf module:sex/zero
 * @method sexTable
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key 配置键值。
 * @return {any} 返回表格专用数据。
 */
const sexTable = (reference, key) =>
    __Zro.sexTable(reference, key);


/**
 * ## 「引擎」`Ux.sexDialog`
 *
 * 弹出窗口专用函数，高频使用，直接捕捉窗口对象，内部使用代码如：
 *
 * ```js
 *      return Ux.ajaxPost(`/api/relation/definition`, request)
 *
 *          // 响应处理
 *          .then(() => Ux.sexDialog(reference, "submitted",
 *
 *              // 设置最终的提交为 false
 *              () => reference.setState({$submitting: false})))
 * ```
 *
 * 窗口专用配置结构如下，该函数第二参数传入的是下边结构中的`key1, key2, key3`，而窗口种类直接放到
 * 对应的子节点之下即可，系统会自动检测：
 *
 * ```json
 * {
 *     "_modal":{
 *         "success":{
 *             "key1": "message1"
 *         },
 *         "error":{
 *             "key2": "message2"
 *         },
 *         "confirm":{
 *             "key3": "message3"
 *         }
 *     }
 * }
 * ```
 *
 *
 * @memberOf module:sex/zero
 * @method sexDialog
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Function} callback 当前窗口专用回调函数，用户窗口点击按钮的回调。
 */
const sexDialog = (reference, key = "", callback) =>
    __Zro.sexDialog(reference, key, callback);


/**
 * ## 「引擎」`Ux.sexMessage`
 *
 * 该函数和模态框的窗口配置没太大的，区别，核心结构如下，唯一的区别是响应过后不使用模态框，直接使用`message`消息框。
 *
 * ```json
 * {
 *     "_modal":{
 *         "success":{
 *             "key1": "message1"
 *         },
 *         "error":{
 *             "key2": "message2"
 *         },
 *         "confirm":{
 *             "key3": "message3"
 *         }
 *     }
 * }
 * ```
 *
 *
 * @memberOf module:sex/zero
 * @method sexMessage
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Number} duration 消息停留的时间。
 */
const sexMessage = (reference, key = "", duration = 1.2) =>
    __Zro.sexMessage(reference, key, duration);

export default {
    /*
     * 读取配置骚操作
     * 1. key = string，直接调 Ux.fromHoc(reference, key)
     * 2. key = Array 或 key包含了 . 数据，直接调 Ux.fromPath(reference, key)
     * 3. key = object, 直接返回 key
     * 4. key = undefined，不传，返回 props 的 config
     */
    sexCab,
    sexOp,

    /*
     * {
     *     "dialog": "",
     *     "button": ""
     * }
     */
    sexModal,
    sexIdentifier,

    sexTable,
    sexDialog,

    sexBatch,
    sexMessage,
}