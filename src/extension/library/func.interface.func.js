import Ux from "ux";
import __Zu from 'zet';
import __Zp from 'zep';
// =====================================================
// on 前缀
// =====================================================

/**
 *
 * ## 「标准」`Ex.onRelationIdentifiers`
 *
 * ### 1.基本介绍
 *
 * 计算关系的 identifier 专用函数，返回的数据结构如：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * * up: 上游关系数据。
 * * down: 下游关系数据。
 *
 * ### 2.函数代码流程
 *
 * 1. 先从`X_CATEGORY`分类表中（每一个分类对应一个identifier）提取和传入模型标识符匹配的分类数据。
 * 2. 读取当前模型标识符的所有父类（包括祖辈）直到根节点。
 * 3. 在`展开树`中检索和当前模型标识符匹配的节点（二次计算）。
 * 4. 计算相关的所有上游下游数据信息。
 *
 * ### 3.关系结构
 *
 * 整体的关系结构如：
 *
 * ```
 *     A     -------   B
 *    / \             / \
 *   A1  A2          B1  B2
 * ```
 *
 * 如上图结构中
 *
 * 1. 若计算`A2`到`B`
 *      1. A2到B
 *      2. A到B
 * 2. 若计算`A2`到`B1`
 *      1. A2到B
 *      2. A2到B1
 *      3. A到B1
 *      4. A到B
 *
 * 计算两个节点之间关系时，实际上是两颗树之间任意节点的关联计算（两两计算，只要有定义就计算）。
 *
 *
 * @memberOf module:on/utter
 * @method onRelationIdentifiers
 * @param {String} identifier 统一标识符
 * @param {Array} source 关系数据源
 * @param {Array} definition 关系定义数据源
 * @returns {Object} 返回关系数据对象
 */
const onRelationIdentifiers = (identifier, source = [], definition = []) =>
    __Zu.onRelationIdentifiers(identifier, source, definition);
/**
 *
 * ## 「标准」`Ex.onRelationType`
 *
 * ### 1.基本介绍
 *
 * 计算关系类型专用函数，根据关系定义计算当前关系的类型。
 *
 * ### 2.类型表
 *
 * CMDB系统定义的关系类型如：
 *
 * |类型值|类型名|
 * |:---|:---|
 * |containment|包含|
 * |deployed|运行于|
 * |connection|连接|
 * |dependency|依赖|
 *
 * @memberOf module:on/utter
 * @method onRelationType
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} record 当前数据记录
 * @returns {undefined|Object} 返回唯一关系值
 */
const onRelationType = (reference, record = {}) =>
    __Zu.onRelationType(reference, record);
/**
 * ## 「标准」`Ex.onRelation`
 *
 * ### 1.基本介绍
 *
 * 计算关系专用函数，该函数可计算两种关系：
 *
 * * 传入`$defineMap`：执行关系定义的计算，对应`M_RELATION`表。
 * * 未传入`$defineMap`：执行关系数据的计算（实际关系），在目前CMDB中则是`RL_DEVICE_RELATION`表。
 *
 * ### 2.字段说明
 *
 * 在CMDB的关系计算中，关系主要分为两部分（上游和下游）
 *
 * * `up`：上游关系
 * * `down`：下游关系
 *
 * 此处的`config`中的`up`和`down`存储了上下游关系计算时的基础配置数据（元数据）。
 *
 * @memberOf module:on/utter
 * @param {Object} current 当前节点的关系处理
 * @param {Object} config 上下游专用配置处理
 * @param {Object} $defineMap 定义的关系关联数据
 * @returns {Object} 分组过后的关系信息
 */
const onRelation = (current = {}, config = {}, $defineMap) =>
    __Zu.onRelation(current, config, $defineMap);
/**
 * ## 「标准」`Ex.onApp`
 *
 * ### 1.基本介绍
 *
 * 使用应用数据初始化，自动加载应用配置数据
 *
 * ```js
 *      let $inited = {};
 *      $inited.type = "ENTITY";
 *      const form = Ex.yoForm(this, null, Ex.onApp($inited));
 * ```
 *
 * 本函数追加的核心字段
 *
 * |字段名|含义|
 * |:---|:---|
 * |appName|应用程序名称，直接从`Ux.isInit()`获取的数据中读取。|
 * |namespace|当前应用名空间，暂时使用`cn.originx.`前缀，调用`toNamespace`方法（后期会修正和更改）。|
 * |active|是否激活当前记录，如果不包含`active`则默认为true。|
 *
 * ### 2.核心点
 *
 * 此处最重要的一点就是`namespace`的计算，该名空间的计算目前使用固定值`cn.originx.`前缀，后期考虑使用环境变量或者其他手段进行计算和配置。
 *
 * > 在Ox平台开第二个应用时候，名空间的计算会纳入到开发计划中，主要牵涉`I_API/I_JOB/I_SERVICE`三张表的数据读取。
 *
 * @memberOf module:on/utter
 * @param {Object} $inited 初始化应用数据
 * @returns {Object} 返回最终数据
 */
const onApp = ($inited = {}) =>
    __Zu.onApp($inited);
/**
 * ## 「标准」`Ex.onTree`
 *
 * ### 1.基本介绍
 *
 * 树形菜单专用处理函数
 *
 * ```js
 *      const calculated = Ex.onTree(selected, data, {
 *          mode: $selection.mode,
 *          tree: config.tree,
 *      });
 * ```
 *
 * ### 2.基础结构
 *
 * #### 2.1.树结构
 *
 * 参考`Ux.toTreeArray`文档。
 *
 * #### 2.2.树选择
 *
 * 选择模式参考`Ux.Tree`文档。
 *
 * @memberOf module:on/utter
 * @param {Array} keys 配置数据信息
 * @param {Array} data 树相关数据源
 * @param {Object} config 树相关配置
 * @returns {Array} 返回最终树信息
 */
const onTree = (keys = [], data = [], config = {}) =>
    __Zu.onTree(keys, data, config);
// =====================================================
// up前缀
// =====================================================

/**
 * ## 「标准」`Ex.upValue`
 *
 * 检查输入的 `key` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:up/utter
 * @method upValue
 * @param {Object} state 当前状态
 * @param {Object} prevState 之前状态
 * @param {String} key 状态值
 * @returns {{current, original}}
 */
const upValue = (state = {}, prevState = {}, key = "") =>
    __Zu.upValue(state, prevState, key);
/**
 * ## 「标准」`Ex.upCondition`
 *
 * 检查 `$condition` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:up/utter
 * @param {Object} state 当前状态
 * @param {Object} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upCondition = (state = {}, prevState = {}) =>
    __Zu.upCondition(state, prevState);
/**
 *
 * ## 「标准」`Ex.upQuery`
 *
 * 检查 `$query` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:up/utter
 * @param {Object} state 当前状态
 * @param {Object} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upQuery = (state = {}, prevState = {}) =>
    __Zu.upQuery(state, prevState);
/**
 *
 * ## 「标准」`Ex.upLoading`
 *
 * 检查 `$loading` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:up/utter
 * @param {Object} state 当前状态
 * @param {Object} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upLoading = (state = {}, prevState = {}) =>
    __Zu.upLoading(state, prevState);
/**
 *
 * ## 「标准」`Ex.upList`
 *
 * 检查 `$options, $identifier` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始属性",
 *     current: "新属性"
 * }
 * ```
 *
 *
 * 移除 component 相关配置信息
 *
 * 1. 解决第一次多选闪屏的问题
 * 2. 在切换页面的过程中，实际上 component 的改动不重要，因为 component 应该在两种情况彻底更改
 *    * $options 发生变更
 *    * $identifier 发生变更
 *
 * 二者是从属关系，所以在 rxPostSelected 触发时，保证不闪屏，所以不检查 component
 *
 * @memberOf module:up/utter
 * @param {Object} props 当前树形
 * @param {Object} prevProps 之前树形
 * @returns {Object} 返回计算后的状态信息
 */
const upList = (props = {}, prevProps = {}) =>
    __Zu.upList(props, prevProps);
// =====================================================
// map前缀
// =====================================================
/**
 * ## 「标准」`Ex.mapFn`
 *
 * ### 1.基本介绍
 *
 * 判断哪些函数需要继承（此处只继承三类）：
 *
 * * `rx`前缀函数
 * * `fn`前缀函数
 * * `do`前缀函数
 *
 * ### 2.函数规范
 *
 * 函数名过滤专用函数，Zero Ui中定义了组件函数的基础规范如下：
 *
 * |函数前缀|含义|
 * |---|:--|
 * |rx|触发型继承函数，对上层组件而言通常是「2阶」，可生成下层调用的「1阶」函数，父子通讯的专用函数。|
 * |fn|普通函数，自由设计。|
 * |on|事件函数，通常提供给HTML元素或Ant的元素专用事件。|
 * |ix|内部专用函数，不开放。|
 *
 * @memberOf module:ux/utter
 * @param {String} fnName 函数名称
 * @returns {boolean} 返回判断结果
 */
const mapFun = (fnName) => Ux.isFunctionName(fnName);

/**
 * ## 「标准」`Ex.mapMeta`
 *
 * ### 1.基本介绍
 *
 * 处理 `data` 中的 metadata 字段，强制转换成 Json 格式的数据，在Zero Ui的框架规范中，数据记录参考最初的扩展模块中的规范。
 *
 * ### 2.核心
 *
 * 正常流程中，后端会直接将`metadata`字段执行JSON序列化，当前函数则是前端的一个「补充」函数。
 *
 *
 * @memberOf module:map/utter
 * @param {Object} data 待处理的输入
 * @returns {Object}
 */
const mapMeta = (data = {}) => __Zu.mapMeta(data);
/**
 * ## 「标准」`Ex.mapUri`
 *
 * ### 1.基本介绍
 *
 * 处理 `item` 中的 `uri` 地址，主要用于处理 `EXPAND` 类型的菜单路径专用，链接地址会有两种：
 *
 * * 基础链接：uri地址 = `Z_ROUTE` + item.uri。
 * * 展开菜单：uri地址 = `EXPAND`（特殊值）。
 *
 * ### 2.核心
 *
 * 系统链接地址主要分为下边几种：
 *
 * |值|含义|
 * |:---|:---|
 * |$MAIN$|当前链接的主页地址，对应`Z_ENTRY_ADMIN`配置的路径。|
 * |$SELF$|当前链接地址，`$router`中读取。|
 * |EXPAND|展开菜单，通常是带有子菜单的上级菜单，可展开，不触发`react-router`。|
 * |`/xxx/yyy`|「标准」普通地址，标准的路径地址，会执行`Z_ROUTE` + item.uri运算。|
 *
 * @memberOf module:map/utter
 * @param {Object} item 配置对象信息
 * @param {DataObject} $app 应用对象数据
 * @returns {Object} 处理过后的对象数据
 */
const mapUri = (item = {}, $app) => __Zu.mapUri(item, $app);
/**
 * ## 「标准」`Ex.mapAsyncDatum`
 *
 * ### 1.基本介绍
 *
 * 处理 ASSIST 专用配置数据：
 *
 * * DATUM：`$render`专用处理。
 * * DATE：`$render`专用处理。
 *
 * 特定原则下的表单渲染专用，主要用于渲染历史记录数据，出现了非表格类型的二维数据渲染。
 *
 * ### 2.特定场景
 *
 *目前这个方法只在`OxHistory`组件中使用，主要是收集所有的字典和时间格式信息，生成最终的哈希表，这个哈希表用于填充数据，
 *通常表格中的字典数据是直接渲染，而`OxHistory`是新旧值的纵向比对，所以这种情况下，直接使用DATUM渲染会不生效，而且在
 *渲染过程中，保存的值可能不是主键，而是其他值，所以提供这种配置来完成逆向操作，这种特殊场景有可能会在后期还会用到，于是
 *提供特定方法`mapAsyncDatum`来实现其渲染功能。
 *
 * @memberOf module:map/utter
 * @param {Array} columns 基本类配置信息
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Promise.<T>} Promise 专用配置处理
 */
const mapAsyncDatum = (columns = [], reference) =>
    __Zu.mapAsyncDatum(columns, reference);
// =====================================================
// to前缀
// =====================================================
/**
 * ## 「标准」`Ex.toUri`
 *
 * ### 1.基本介绍
 *
 * 1. Uri专用配置处理，构造路径信息，根据`Z_ROUTE`来计算最终的路径信息。
 * 2. 计算过程中，还根据路径前缀，执行去`/`符号的特殊操作（规范化）。
 *
 * @memberOf module:ux/utter
 * @param {String} uri 原始路径信息
 * @param {DataObject} $app 应用程序对象
 * @returns {string} 返回最终的Uri信息
 */
const toUri = (uri = "", $app) =>
    Ux.toUri(uri, $app);
/**
 * ## 「标准」`Ex.toDialog`
 *
 * ### 1.基本介绍
 *
 * 直接执行dialog参数的合并，用来生成`<Modal/>`的基础配置
 *
 * ```json
 * {
 *     content: "传入配置效果"
 * }
 * ```
 *
 * @memberOf module:to/utter
 * @param {Object} dialog 窗口专用配置
 * @returns {Object} 处理后的配置
 */
const toDialog = (dialog) =>
    __Zu.toDialog(dialog);
/**
 * ## 「标准」`Ex.toNamespace`
 *
 * ### 1.基本介绍
 *
 * 名空间计算
 *
 * 1. 传入是 string， 直接来
 * 2. 传入是 非 string，走 React
 *
 * ### 2.核心
 *
 * #### 2.1.关于多租户
 *
 * 1. 一个应用只有一个名空间，所以这个维度和租户维度有些区别。
 * 2. 租户维度依靠sigma执行，应用维度依靠`appId`。
 * 3. 名空间和`appId`执行绑定，一个应用只能有一个名空间。
 *
 * @memberOf module:to/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {string|undefined} 返回合法名空间
 */
const toNamespace = (reference) =>
    __Zu.toNamespace(reference);
/**
 * ## 「标准」`Ex.toColor`
 *
 * ### 1.基本介绍
 *
 * 随机读取一个颜色信息，这个方法主要用在Dashboard上。
 *
 * 1. 如果传入 current，则读取 current 上的颜色信息。
 * 2. 如果不传入 current，则随机读取颜色信息。
 *
 * @memberOf module:ux/utter
 * @param {Number} current 索引数据
 * @param {String} mode 模式
 * @returns {WebColor} 返回颜色值
 */
const toColor = (current, mode = "KFC_8") =>
    Ux.toColor(current, mode);
/**
 * ## 「标准」`Ex.toModelId`
 *
 * ### 1.基本介绍
 *
 * 从 `module` 中提取配置信息，并执行 identifier 的计算。
 *
 * ### 2.核心
 *
 * #### 2.1.内部调用
 *
 * 内部调用了`toIdentifier`执行最终操作。
 *
 * #### 2.2.数据源
 *
 * * 配置数据：`X_MODULE`中定义了提取数据的字段信息以及配置信息。
 * * 配置抽取：直接从`$inited`数据中提取`modelId`作为模型标识符的提取基础。
 *
 * @memberOf module:to/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {String} field 字段信息
 * @returns {String} 返回最终的模型ID（统一标识符计算值）
 */
const toModelId = (reference, field) =>
    __Zu.toModelId(reference, field);
/**
 * ## 「标准」`Ex.toIdentifier`
 *
 * ### 1.基本介绍
 *
 * 根据传入配置计算统一标识符
 *
 * 1. `__DEFAULT__`：默认的统一标识符，如果不存在则使用该值。
 * 2. `__PATTERN__`：执行 format 专用表达式解析转换。
 *
 * > 如果传入配置解析不了`modelId`
 *
 * ### 2.核心点
 *
 * 这个方法主要用于读取不同模型标识符对应的配置，通常格式如：
 *
 * ```json
 * {
 *      "__DEFAULT__": "120a1719-ba5b-4b45-9768-dddf7048b186",
 *      "ci.device": "120a1719-ba5b-4b45-9768-dddf7048b186",
 *      "ci.server": "38ba3c92-0fa7-4df0-9c6c-2a9b33822107",
 *      "ci.application": "fc452465-3735-4227-a911-b2080b18ce10",
 *      "ci.business": "3168a6ea-9c4d-40ed-8c6c-ec3122da0ee4",
 *      "ci.database": "35303c14-de93-4978-a29b-b523fb0aefcb",
 *      "ci.middleware": "8b4c140c-9fa5-4d5d-8254-ea868d3e72ad",
 *      "...":"..."
 * }
 * ```
 *
 * 上述转换内容如：
 *
 * 1. 读取的都是配置的核心主键，如`UI_CONTROL`中的主键。
 * 2. 读取的表单唯一值，如`UI_FORM`中的code（借用`__PATTERN__`配置）。
 *
 * @memberOf module:to/utter
 * @param {Object} config 基本配置信息
 * @param {String} program 编程专用配置信息，传入的identifier
 * @returns {String} 返回最终的统一标识符
 */
const toIdentifier = (config = {}, program) =>
    __Zu.toIdentifier(config, program);

/**
 * ## 「标准」`Ex.toArray`
 *
 * ### 1.基本介绍
 *
 * DataArray和Array的统一数据处理，返回最终的 Array 数组，该方法类似于
 * `Ux.ambArray`方法，但判断条件不同。
 *
 * ### 2.核心
 *
 * #### 2.1.判断条件
 *
 * 1. Ux.ambArray中判断使用了`data instanceof DataArray`。
 * 2. Ex.toArray中判断则使用了`Ux.isFunction(data.to)`，因为它包含了`to()`方法。
 *
 * @memberOf module:ux/utter
 * @param {any} data 输入数据
 * @returns {Array} 最终返回数组
 */
const toArray = (data) => Ux.toArray(data);
/**
 * ## 「标准」`Ex.onOp`
 *
 * ### 1.基本介绍
 *
 * 动态渲染流程中，执行按钮事件绑定的专用函数，用来绑定按钮触发的事件信息。
 *
 * ```js
 * const $op = {};
 * Object.keys(event)
 *      .forEach(opKey => $op[opKey] = Ex.onOp(reference, event[opKey]));
 * state.$op = $op;
 * ```
 *
 * ### 2.数据结构
 *
 * #### 2.1.配置信息
 *
 * 传入的第二参数`metadata`结构如下：
 *
 * ```json
 * {
 *     "event": "事件名称",
 *     "config": {
 *
 *     }
 * }
 * ```
 *
 * #### 2.2. 事件表
 *
 * |事件名|说明|
 * |:---|:---|
 * |event.filter|搜索表单专用函数，触发查询条件的更新。|
 * |event.add|添加表单提交函数。|
 * |event.save|更新表单提交函数。|
 * |event.delete|删除表单提交函数。|
 *
 * @memberOf module:on/upper
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} metadata 元数据配置信息
 * @returns {Function} 返回事件函数
 */
const onOp = (reference, metadata = {}) =>
    __Zp.onOp(reference, metadata);
export default {
    // Ux interface Exposed.
    toArray,
    toUri,

    // Ex interface Exposed.
    toDialog,
    toNamespace,
    toColor,
    toModelId,
    toIdentifier,

    // Ex interface Exposed.
    mapFun,
    mapUri,
    mapMeta,
    mapAsyncDatum,
    // Ex interface Exposed.
    upCondition,
    upQuery,
    upValue,
    upList,
    upLoading,
    // on 前缀
    onApp,
    onTree,
    onRelation,
    onRelationIdentifiers,
    onRelationType,
    onOp,
}