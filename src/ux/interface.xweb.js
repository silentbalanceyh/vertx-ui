import __Zi from 'zi';
// --------------------- Ajax 部分 -----------------------------------
/**
 * ## 「标准」`Ux.xtLazyInit`
 *
 * 延迟初始化，统一处理，在 `componentDidMount` 中调用。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} configuration 传入的 config 节点
 */
const xtLazyInit = (reference, configuration) =>
    __Zi.xtLazyInit(reference, configuration);

/**
 * ## 「标准」`Ux.xtLazyUp`
 *
 * 延迟初始化，统一处理，在 `componentDidUpdate` 中调用。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 包含了`props`和`state`的前一个状态的引用。
 * @param {Object} configuration 传入的 config 节点
 */
const xtLazyUp = (reference, virtualRef, configuration) =>
    __Zi.xtLazyUp(reference, virtualRef, configuration);
/**
 * ## 「标准」`Ux.xtLazyAjax`
 *
 * 根据 config 中的 ajax 配置，来执行参数解析，主要用于可执行 Ajax的延迟请求控件，如：
 *
 * * ListSelector
 * * AddressSelector
 * * TreeSelector
 *
 * 上述控件都是复杂的自定义控件，必须解析 ajax 配置执行延迟远程调用。
 *
 * ### 1. 配置解析流程
 *
 * config的ajax包含了远程处理的配置信息，分成两种读取数据的模式：
 *
 * 1. Qr模式：启用查询引擎：`ajax.params.criteria`
 * 2. 非Qr模式：直接查询数据：`ajax.magic`
 *
 * ### 2. 执行输入解析
 *
 * 调用`Ux.parseInput`方法解析每个参数的参数来源信息，最终生成不同来源下的数据构造请求参数。
 *
 * @memberOf module:xt/zion
 * @method xtLazyAjax
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} config Ajax配置专用配置信息。
 * @return {Object} 返回参数信息。
 */
const xtLazyAjax = (reference, config = {}) =>
    __Zi.xtLazyAjax(reference, config);
// --------------------- 其他部分 -----------------------------------
/**
 * ## 「标准」`Ux.xtChecked`
 *
 * 该函数主要用于`<Select/>`多选和`<Tree/>`的onSelect中，通过配置实现多种模式的选择。
 *
 * * 替换模式：直接使用键值集合替换原始选择。
 * * 合并模式：执行Save操作选择追加和替换两种。
 *
 * @memberOf module:xt/zion
 * @param {Set|Array} $keySet 已经选择的主键集合
 * @param {Object|ReactComponent} reference React组件引用
 * @param {Object} configuration 传入的 config
 * @returns {Array} 返回最终选择键值集合
 */
const xtChecked = ($keySet, reference, configuration) =>
    __Zi.xtChecked($keySet, reference, configuration);


/**
 * ## 「标准」`Ux.xtRowChange`
 *
 * 构造当前行的`onChange`专用函数，该API应用于column的render注入事件流程，可实现行数据变动操作，支持多字段数据。
 *
 * 1. 先使用二义性`ambEvent`读取数据信息。
 * 2. 再触发上层的`onChange`方法，自定义组件中的上层方法会直接被Ant Design注入。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件应用
 * @param {String} rowKey 行记录主键
 * @param {String} field 被操作的字段
 * @returns {Function} 返回事件函数
 */
const xtRowChange = (reference, rowKey, field) => (event) =>
    __Zi.xtRowChange(reference, rowKey, field);
/**
 * ## 「标准」`Ux.xtExprFlat`
 *
 * Object转换成Array专用，如传入：
 *
 * ```json
 * {
 *     "field": "expr1",
 *     "field": "expr2"
 * }
 * ```
 *
 * 构造带expression表达式的配置数据信息。
 *
 * @memberOf module:xt/zion
 * @param {Object} value 传入Object数据
 * @returns {Array} 执行完成后的数组
 */
const xtExprFlat = (value = {}) =>
    __Zi.xtExprFlat(value);
/**
 * ## 「标准」`Ux.xtRender`
 *
 * 检查系统状态内部是否存在`error`节点，如果存在`error`节点，则直接渲染错误信息，配置出错的统一调用流程。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @return {Jsx|boolean} 直接渲染。
 */
const xtRender = (reference, render) =>
    __Zi.xtRender(reference, render);


/**
 * ## 「标准」`Ux.xtReady`
 *
 * 由于 Zero 框架无法调用 Extension 中的`yoRender`，所以可直接使用`xtReady` 实现和 `yoRender`中
 * 同样的逻辑
 *
 * 1. 检查配置是否准备完成，如果准备完成：`$ready = true`，否则为false。
 * 2. 准备没有完成时，则不渲染。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @param {Object} LOG 日志配置。
 * @return {JSX.Element} 直接渲染。
 */
const xtReady = (reference, render, LOG = {}) =>
    __Zi.xtReady(reference, render, LOG);

/**
 * ## 「标准」`Ux.xtReset`
 *
 * 重置专用函数，内部关联 Ant Design 的 Form信息。
 *
 * @memberOf module:xt/zion
 * @method xtReset
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtReset = (reference, virtualRef = {}, callback) =>
    __Zi.xtReset(reference, virtualRef, callback);
/**
 * ## 「标准」`Ux.xtRevert`
 *
 * 自定义组件的新重置处理，用于设置表单的重置相关信息
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtRevert = (reference, virtualRef, callback = {}) =>
    __Zi.xtRevert(reference, virtualRef, callback);

/**
 * ## 「标准」`Ux.xtUnsafe`
 *
 * 新版中的`UNSAFE_componentWillReceiveProps(nextProps,context)`的内部调用，虽然不提倡使用，
 * 但在自定义组件中，该函数依然会控制内部状态变更，所以依旧采用该方法。
 *
 * @memberOf module:xt/zion
 * @deprecated
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} nextProps 下一个属性。
 */
const xtUnsafe = (reference, nextProps = {}) =>
    __Zi.xtUnsafe(reference, nextProps);
/**
 * ## 「标准」`Ux.xtGet`
 *
 * 广义读取当前组件消费的数据信息，外层表单中会用props.value传入设置的值。
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {String} field 读取字段的数据（只适用于OBJECT类型）。
 * @return {Object} 返回最终状态信息。
 */
const xtGet = (reference, field = undefined) =>
    __Zi.xtGet(reference, field);
/**
 * ## 「标准」`Ux.xtSet`
 *
 * （略）
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Array} name 读取字段的数据（只适用于OBJECT类型）。
 * @param {any} value 设置的任何值。
 * @return {Object} 返回最终状态信息。
 */
const xtSet = (reference, name, value) =>
    __Zi.xtSet(reference, name, value);


/**
 * ## 「标准」`Ux.xtInitObject`
 *
 * * 如果属性 props 中存在 `value` 变量，则返回该值。
 * * 如果属性 props 中不存在 `value` 变量，则返回 `{}`。
 *
 * @memberOf module:xt/zion
 * @param {Object} props React属性信息。
 * @return {Object} 返回初始值。
 */
const xtInitObject = (props = {}) =>
    __Zi.xtInitObject(props);


/**
 *
 * ## 「标准」`Ux.xtInitArray`
 *
 * * 如果属性 props 中存在 `value` 变量
 *      * value本身是一个 Array，直接使用该 Array 初始化（步骤2）。
 *      * value本身是一个 Object，则使用 `value.data` 执行初始化（步骤2）。
 * * 如果属性 props 中不存在 `value` 变量。
 *      * 如果允许空数组，则使用`{data:[]}`。
 *      * 如果不允许空数组，则使用`{data:[{key:"uuid"}]}`。
 *
 * 返回结构：
 *
 * ```json
 * {
 *     "empty模式": {
 *         data: []
 *     },
 *     "非empty模式": {
 *         data: [
 *             {
 *                 key: "ef78bf10-4db7-49d1-910d-96bc7eaad3c3"
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * @memberOf module:xt/zion
 * @param {Object} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Array}
 */
const xtInitArray = (props = {}, empty = false) =>
    __Zi.xtInitArray(props, empty);


/**
 * ## 「标准」`Ux.xtInitArrayMap`
 *
 * （略），直接将Array类型转换成Map类型（Object），字段值为Object的键值。
 *
 * @memberOf module:xt/zion
 * @param {Object} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Object}
 */
const xtInitArrayMap = (props = {}, empty = false) =>
    __Zi.xtInitArrayMap(props, empty);


/**
 *
 * ## 「标准」`Ux.xtInitFormat`
 *
 * 双格式处理
 *
 * ```json
 * {
 *     "Array直接格式":[],
 *     "Json格式":{}
 * }
 * ```
 *
 * @memberOf module:xt/zion
 * @param {Object} props React属性信息
 * @return {{}}
 */
const xtInitFormat = (props = {}) =>
    __Zi.xtInitFormat(props);

/**
 * ## 「标准」`Ux.xtFormat`
 *
 * TableEditor等专用格式方法，可支持多种不同格式。
 *
 * @memberOf module:xt/zion
 * @param {Array} internal 二维数据
 * @param {Object} format 格式配置数据
 * @returns {any} 返回初始化后的数据
 */
const xtFormat = (internal = [], format) =>
    __Zi.xtFormat(internal, format);
/**
 * 「标准」`Ux.xtRowAdd`
 *
 * 表格中的添加行函数（二维表结构）
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用
 * @param {Object} record 记录专用数据
 * @param {Number} index 记录索引
 * @returns {Function} 行添加事件函数
 */
const xtRowAdd = (reference, record, index) =>
    __Zi.xtRowAdd(reference, record, index);
/**
 *
 * 「标准」`Ux.xtRowDel`
 *
 * 表格中的删除行函数（二维表结构）
 *
 * @memberOf module:xt/zion
 * @param {Object|ReactComponent} reference React组件引用
 * @param {Object} record 记录专用数据
 * @param {Number} index 记录索引
 * @returns {Function} 行删除事件函数
 */
const xtRowDel = (reference, record, index) =>
    __Zi.xtRowDel(reference, record, index);
/**
 * ## 「标准」`Ux.xtTransfer`
 *
 * @memberOf module:xt/zion
 * @param reference
 * @param callback
 * @returns {Function}
 */
const xtTransfer = (reference, callback) =>
    __Zi.xtTransfer(reference, callback);

// -------------------- 文件上传专用方法（通用） -----------------------
/**
 *
 * ## 「标准」`Ux.xtUploadHandler`
 *
 * 构造上传组件专用方法（handler对象）。
 *
 * * beforeUpload，上传之前的处理方法
 * * onChange，变更专用方法
 * * onPreview，预览专用方法
 * * customRequest，自定义上传方法
 *
 * @memberOf module:xt/zion
 * @param {Object} reference React对应组件引用。
 * @param {Object} metadata 当前组中数组，本身为一棵树
 * @returns {Object} FileUpload组件专用。
 */
const xtUploadHandler = (reference, metadata = {}) =>
    __Zi.xtUploadHandler(reference, metadata);
/**
 * ## 「标准」`Ux.xtUploadInit`
 *
 * @memberOf module:xt/zion
 * @param reference
 * @param ajax
 * @param callback
 */
const xtUploadInit = (reference, ajax = {}, callback) =>
    __Zi.xtUploadInit(reference, ajax, callback);
/**
 * ## 「标准」`Ux.xtUploadMime`
 *
 * @memberOf module:xt/zion
 * @param value
 * @returns {*}
 */
const xtUploadMime = (value = []) =>
    __Zi.xtUploadMime(value);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 下载专用几个方法，合并到一起形成 handler
    xtUploadHandler,
    xtUploadInit,
    xtUploadMime,
    /* Ajax 部分由于逻辑复杂，这部分单独拉出来执行处理*/

    xtLazyUp,
    xtLazyInit,
    xtLazyAjax,

    // xtLazyData,

    xtTransfer,         // Transfer自定义组件专用
    xtChecked,          // 多选专用

    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    xtSet,
    xtFormat,

    xtInitObject,
    xtInitArray,
    xtInitArrayMap,
    xtInitFormat,

    /* render 处理 */
    xtRender,
    xtReady,
    xtReset,
    xtRevert,

    xtExprFlat,

    /* 表格 */
    xtRowChange,
    xtRowAdd,
    xtRowDel
}