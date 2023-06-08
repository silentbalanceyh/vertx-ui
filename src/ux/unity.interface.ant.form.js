import __Zo from 'zo';
import __Zs from 'zs';
import __Zn from 'zone';

/**
 * ## 「标准」`Ux.formHits`
 *
 * Ant Design中的Form表单执行值设置，直接使用values执行设置，values中如果有undefined则清空该字段。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} values 设置Form表单中的字段值
 */
const formHits = (reference, values = {}) =>
    __Zo.formHits(reference, values);
/**
 * ## 「标准」`Ux.formOut`
 *
 * @memberOf module:form/zest
 * @param reference
 * @param request
 * @returns {*}
 */
const formOut = (reference, request = {}) =>
    __Zs.formOut(reference, request);
/**
 * ## 「引擎」`Ux.valueRequest`
 *
 * Ant Design提交表单被规范化过后的数据。
 *
 * 1. 注入默认语言信息，`Cv['Language']`读取语言信息，默认`cn`。
 * 2. 如果记录中不包含`active`字段，则注入默认的 active。
 * 3. 如果包含了应用数据，则将应用的 `sigma` 注入到请求数据中。
 * 4. 移除掉所有的 undefined 节点。
 *
 * @memberOf module:value/zest
 * @param {Object} params 输入数据值。
 * @return {Object} 被处理过后的请求数据值。
 */
const valueRequest = (params = {}) =>
    __Zs.dataRequest(params);

/**
 * ## 「标准」`Ux.formClear`
 *
 * Ant Design中的表单清空专用方法，用于清空当前 Ant Design表单。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} data 需要清空的对象值。
 * @return {Object} 处理被清空的所有方法。
 */
const formClear = (reference, data) =>
    __Zo.formClear(reference, data);
/**
 *
 * ## 「标准」`Ux.formRead`
 *
 * 根据数据填充 data 变量。
 *
 * 1. 如果包含了`$record`在 props 属性中，则直接使用 $record 数据执行填充，$record 的类型是 DataObject。
 * 2. 如果不包含`$record`变量，则直接用 form 的 `getFieldsValue` 读取当前表单值来填充 data 变量。
 *
 * @memberOf module:form/zest
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} data 需要填充的对象值。
 * @return {Object} 返回最终填充的结果。
 */
const formRead = (reference, data = {}) =>
    __Zs.formRead(reference, data);
/**
 * ## 「标准」`Ux.formGet`
 *
 * 直接从 form 中按 `key` 读取表单数据值。
 *
 * 1. 如果传入了 Array 类型的 key，则读取包含了 key 中所有元素的表单对象值。
 * 2. 如果传入了 String 类型的 key，则直接读取表单字段为 `key` 的字段值。
 * 3. 如果什么都没传入，则直接返回所有表单值。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} key 字段名称，有可能是字段集合。
 * @return {Object|any} 返回读取的字段值。
 */
const formGet = (reference, key = undefined) =>
    __Zo.formGet(reference, key);
/**
 * ## 「标准」`Ux.formReset`
 *
 * 重设表单值专用方法。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} keys 字段名称，有可能是字段集合。
 * @param {Object} response 响应最终信息数据。
 */
const formReset = (reference, keys = [], response = {}) =>
    __Zo.formReset(reference, keys, response);
/**
 * ## 「标准」 `Ux.formRow`
 *
 * 针对窗口类型组件 Dialog 执行的行添加专用提交方法，通常是窗口内包含了表单内数据，其核心如数如下：
 *
 * 1. reference 中的 $mode 用于表示当前表单所做的操作类型，包括 `ADD / EDIT` 两种。
 * 2. reference 中的 $inited 用于表示当前表单的初始化基本数据。
 * 3. reference 中的 rxRow 为调用此API的核心函数，此函数必须存在，若不存在则直接抛出异常：throw new Error("rxRow")
 * 4. config 中目前使用的操作是做表单部分重置，config 中的 reset = [] 属性
 *
 * 对应数据格式如：
 * ```js
 * {
 *     "$mode": "ADD | EDIT",
 *     "$inited": {
 *         "field1": "value1",
 *         "field2": "value2",
 *         "...": "..."
 *     },
 *     "rxRow": () => ....
 * }
 * ```
 * > 此API还会有一个特性，即在添加行数据时，若出现了持续添加，则 `key` 会被重制 UUID。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} request 表单请求通过标准化处理后的数据
 * @param {Object} config 传入的属性配置
 * @returns {Promise<Object>} 异步返回Promise封装request 数据的 monad
 */
const formRow = (reference, request = {}, config) =>
    __Zo.formRow(reference, request, config);
/**
 * ## 「标准」`Ux.formHit`
 *
 * 「Ambiguity」Ant Design中的Form操作的二义性函数
 *
 * * `value`有值时直接设置`key`的表单值；
 * * `value`为undefined时则直接读取Form中的`key`对应的值
 *
 * 这个方法是一个典型的二义性方法，如果有 value 则设置字段`key`的值，如果没有value则读取`value`的值，但是它的读取不如 `formGet`，
 * `formGet`是增强版的表单读取方法，不仅仅可以读单字段的值，还可以读一个子对象（Object）。
 *
 * @memberOf module:form/zodiac
 * @param {Object|ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String} key 字段名称。
 * @param {any} value 字段值
 * @return {any} 只有在 value 不传入时使用该值。
 */
const formHit = (reference, key, value = undefined) =>
    __Zo.formHit(reference, key, value);
/**
 * ## 「标准」`Ux.formLinker`
 *
 * > 该函数主要使用在`ListSelector、TreeSelector`这种复杂的自定义组件中。
 *
 * 通过 data 来读取
 *
 * 1. data 是 Array，则按长度为 1 来处理。
 * 2. data 是 Object，则直接处理。
 *
 * @memberOf module:form/zest
 * @param {Object} data linker关联的数据信息。
 * @param {Object} config linker关联的配置信息。
 * @param {String} linkerField linker关联的字段值。
 * @return {undefined|*} 返回undefined或者最终计算的 linker 数据。
 */
const formLinker = (data, config = {}, linkerField) =>
    __Zs.formLinker(data, config, linkerField);
/**
 * ## 「标准」`Ux.valueMap`
 *
 * @memberOf module:value/zone
 * @param target
 * @param source
 * @param config
 * @return {*}
 */
const valueMap = (target, source, config = {}) =>
    __Zn.valueMap(target, source, config);
export default {
    formOut,
    // Form数据处理
    formClear,
    formRead,
    formGet,
    formReset,
    formRow,
    // Hit
    formHit,
    formHits,
    formLinker,
    /**
     * ## 「标准」`Ux.formEnd`
     * @memberOf module:form/zest
     * @param reference
     */
    formEnd: (reference) => __Zs.formEnd(reference),
    valueRequest, dataRequest: valueRequest,
    valueMap,
};
