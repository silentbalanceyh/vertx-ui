// UI_LAYOUT 表访问
// 子类表单需要使用，如 IxDatabase, IxIntegration 等
import __Zu from 'zet';
import __Zp from 'zep';

function yiControl() {
    return __Zu.yiControl.call(this, ...arguments);
}


/**
 * ## 「通道」`Ex.yiStandard`
 *
 * ### 1. 基本介绍
 *
 * 标准核心模块专用方法，内部调用函数
 *
 * 1. yiModule
 * 2. yiAssist
 * 3. yiParameters
 *
 * ### 2. yiParameters
 *
 * `yiModule`和`yiAssist`可直接参考文档中的做法，yiParameters用于处理路由中的参数，
 * 构造`reference.state`中特定的`$query`变量。
 *
 * 1. 从`$router`中读取核心参数`type`和`status`。
 * 2. 如果构造的条件超过1个，使用`AND`连接符。
 *
 * |参数|含义|
 * |---|:---|
 * |type|广义的类型参数。|
 * |status|广义的状态参数。|
 *
 * 上述读取参数可位于路径中，也可位于查询字符串中，如`/uri/xxx/:p1?p2=v2`，`p1`和`p2`都是合法参数。
 *
 *
 *
 * @memberOf module:yi/utter
 * @method yiStandard
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object|State} inputState 返回当前组件状态
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiStandard = (reference, inputState) =>
    __Zu.yiStandard(reference, inputState);
/**
 * ## 「通道」`Ex.yiCompany`
 *
 * 带有企业信息页面的专用处理流程，主要用于查询条件设置。
 *
 * 1. 员工页面
 * 2. 部门页面
 * 3. 组页面
 * 4. 分公司页面
 *
 * 为这些页面注入 `companyId` 的查询条件，直接根据 $query 的查询条件注入特定条件：
 *
 * ```
 * companyId,=<公司ID值>
 * ```
 *
 * 这里的companyId的数据源来自于props中的`$inited.key`变量，最终会生成特定的$query存储在
 * reference的state状态信息中，构造特定查询条件，不仅如此，`companyId,=`的条件会注入到Qr流程，挂载到
 * `$query`的`criteria`节点中。
 *
 * @memberOf module:yi/upper
 * @method yiCompany
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 返回Promise。
 */
const yiCompany = (reference) =>
    __Zp.yiCompany(reference);
/**
 * ## 「通道」`Ex.yiPartForm`
 *
 * ### 1. 基本介绍
 *
 * 初始化表单配置的专用方法，等价于`yiForm`，旧版本有一个`yiForm`方法，为了兼容原始方法，所以独立了
 * 另外一个方法`yiPartForm`来实现表单初始化。
 *
 * 该方法执行流程如下：
 *
 * 1. 先从绑定的资源文件`cab/<LANG>/`中读取`_form`节点中的配置信息。
 * 2. `inherit`用于判断React引用是使用传入引用，还是传入引用的父引用。
 *
 * ### 2. 标准化配置
 *
 * 调用`Ux.configForm`对表单数据进行配置（同步流程），这个步骤需要完成以下几点：
 *
 * * 从配置中读取`renders`对象用于配置`key = Jsx`的表单字段（开发用来渲染表单字段专用）
 * * 构造状态`state`中的`$onChange`函数
 * * 将`config`中的变量`state`作为附加值合并到reference的状态中
 *
 * ### 3. `config`参数
 *
 * config参数中的核心结构如下：
 *
 * ```js
 * {
 *     renders: {},
 *     onChange: {}
 * }
 * ```
 *
 * |变量|类型|含义|
 * |:---|---|:---|
 * |renders|Object|`field = Jsx`结构，渲染表单时对应的字段渲染函数。|
 * |onChange|Object|`field = Function`结构，对象中的每个函数可以注入到字段的`onChange`外置函数中。|
 *
 * @memberOf module:yi/utter
 * @param {Object|ReactComponent} ref React组件引用
 * @param {Object} config 和表单相关的基本配置
 * @param {Object|Boolean} inherit 将要继承到表单中的属性信息
 * @returns {Object}
 */
const yiPartForm = (ref, config = {}, inherit = true) =>
    __Zu.yiPartForm(ref, config, inherit);
/**
 * ## 「通道」`Ex.yiListLazy`
 *
 * ### 1. 基本介绍
 *
 * 列渲染专用处理函数，用于处理`USER`特殊类型的`$render`执行数据预处理
 *
 * 1. 提取所有`USER`列相关信息。
 * 2. 根据传入数据执行`$lazy`的计算（预处理Ajax，系统中唯一调用`Ux.ajaxEager`的位置。
 *
 * 这种类型的代码流程如下：
 *
 * |步骤|含义|
 * |---:|:---|
 * |1|扫描表格配置`table`中的`columns`节点。|
 * |2|从`columns`节点中抽取`$render = USER`的列类型。|
 * |3|收集所有这种类型，执行单独的参数合并，数据条目的读取和辅助数据读取请求不对等，可能10条数据由于某个字段值一样只读取四次。|
 * |4|构造state中的`$lazy`变量：一个Object类型。|
 *
 * ### 2. 关于`$lazy`的结构
 *
 * #### 2.1. 数据
 *
 * ```json
 * [
 *      { "type": "type1", "name": "记录1" },
 *      { "type": "type1", "name": "记录2" },
 *      { "type": "type1", "name": "记录3" },
 *      { "type": "type2", "name": "记录4" },
 *      { "type": "type2", "name": "记录5" },
 *      { "type": "type2", "name": "记录6" }
 * ]
 * ```
 *
 * #### 2.2. 辅助数据
 *
 * ```json
 * [
 *      { "key": "type1", "name": "类型1" },
 *      { "key": "type2", "name": "类型2" }
 * ]
 * ```
 *
 * #### 2.3. 最终生成的变量
 *
 * ```json
 * {
 *     "type":{
 *          "type1": "类型1",
 *          "type2": "类型2"
 *     }
 * }
 * ```
 *
 * * 上述结构中`type`是数据记录中的属性。
 * * 而`Object`中的数据就是`type`对应的：`值 = 显示文字`的Map字典。
 *
 * @memberOf module:yi/utter
 * @method yiListLazy
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object|State} initState 返回当前组件状态
 * @param {Array} $data 搜索的最终结果，$data.list 中包含数据
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiListLazy = (reference, initState = {}, $data = []) =>
    __Zu.yiListLazy(reference, initState, $data);
/**
 * ## 「通道」`Ex.yiColumn`
 *
 * 同 yiListLazy
 *
 * @memberOf module:yi/utter
 * @deprecated
 * @param reference
 * @param initState
 * @param $data
 * @return {*}
 */
const yiColumn = (reference, initState = {}, $data = []) =>
    __Zu.yiListLazy(reference, initState, $data);
/**
 * ## 「通道」`Ex.yiAssist`
 *
 * ### 1. 输入来源
 *
 * |来源|含义|
 * |:---|:---|
 * |`cab/<LANG>`|资源目录`cab/<LANG>/`中绑定的资源文件的_assist节点，使用`@zero`绑定。|
 * |config|直接从props中读取配置，消费assist节点，这种通常是配置型。|
 *
 * ### 2. 辅助数据种类
 *
 * 示例中的数据结构直接从`_assist`开始，或`config.assist`开始，它包含了多个键值配置，每个配置如下：
 *
 * |节点|含义|
 * |:---|:---|
 * |uri|Ajax远程方法的Uri地址。|
 * |method|默认`GET`，可修改成其他方法来读取。|
 * |magic|新版查询模式，非查询引擎，直接将magic节点佐为查询条件。|
 * |params.criteria|这种通常是`qr=true`，设置查询引擎。|
 * |qr|（Boolean）是否强制性使用查询引擎，强制使用则会触发后端查询引擎。|
 * |response|配置响应数据的特殊属性，主要用来配置记录主键。|
 * |group|这个配置目前仅用于`X_TABULAR`读取，根据某个字段进行分组，然后使用值构造变量。|
 *
 * #### 2.1. 非`X_TABULAR`类型
 *
 * > 这种类型比较自由，读取任意接口或任意表都可以。
 *
 * ```json
 * {
 *      "model.information": {
 *          "uri": "/api/model/full/read",
 *          "response": {
 *              "key": "id"
 *          }
 *      },
 *      "model.resource":{
 *          "uri": /api/model/resource"
 *      }
 * }
 * ```
 *
 * 上边的配置信息会在state中生成两个变量，这种模式的变量名直接根据配置中的Object属性字段来定义。
 *
 * * `$a_model_information`
 * * `$a_model_resource`
 *
 * #### 2.2. `X_TABULAR`类型
 *
 * > 这种类型只读取`X_TABULAR`的数据类型，而且会提供`group`方法执行分组，通常是`TYPE`字段。
 *
 * ```json
 * {
 *      "tabular": {
 *          "uri": "/api/types/tabulars",
 *          "method": "POST",
 *          "magic": {
 *              "$body": [
 *                  "zero.authority",
 *                  "member.card"
 *              ]
 *          },
 *          "group": "type"
 *      }
 * }
 * ```
 *
 * 上边配置生成的变量为：
 *
 * * `$t_zero.authority`
 * * `$t_member_card`
 *
 * ### 3. Js脚本
 *
 * #### 3.1. 调用代码
 *
 * 框架内部的调用代码如下：
 *
 * ```js
 * import Ex from 'ex';
 *
 * const state = {};
 * Ex.yiAssist(reference, state).then(response => {
 *     // response 变量中会包含执行 assist 辅助数据流程后的变量
 *     // 假设使用了 2.1 和 2.2 的综合配置
 *     // 则会生成下边四个属性
 *     // - $a_model_information，数据类型是 DataArray
 *     // - $a_model_resource，数据类型是 DataArray
 *     // - $t_permission_type，数据类型是 DataArray
 *     // - $t_member_card，数据类型是 DataArray
 * })
 * ```
 *
 * #### 3.2. 提取数据代码
 *
 * ```js
 * import Ux from 'ux';
 *
 * // 直接传入原始key，会直接做转换
 * // member.card，系统会检索读取上述列表中的 $t_member_card 变量的值
 * // 返回值为 Array 类型。
 * const memberCard = Ux.onDatum(reference, "member.card");
 * ```
 *
 * #### 3.3. Datum函数
 *
 * 除开直接读取的`onDatum`以外，还可以使用一些带有`Datum`关键字的函数，例如：
 *
 * |Datum函数|纯函数|
 * |:---|:---|
 * |elementFindDatum|elementFind|
 * |elementUniqueDatum|elementUnique|
 * |elementGroupDatum|elementGroup|
 *
 * 带`Datum`的函数会比纯函数多两个参数，前两个参数就是`onDatum`的两个参数，简单说是`Datum`遵循如下代码执行流程：
 *
 * |步骤|执行代码|
 * |---:|:---|
 * |1|输入`reference`和`sourceKey`（上述调用代码第二参）。|
 * |2|调用onDatum抽取函数，生成数据（Array类型）。|
 * |3|执行主方法，纯函数中的方法，以Array数据为基础。|
 *
 * @memberOf module:yi/utter
 * @method yiAssist
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object|State} state 输入状态，计算之前的
 * @returns {Promise<T>} 执行更新过后的状态，计算之后的
 */
const yiAssist = (reference, state = {}) =>
    __Zu.yiAssist(reference, state);
// X_MODULE

/**
 * ## 「通道」`Ex.yiModule`
 *
 * ### 1. 基本介绍
 *
 * 一个 module 的配置信息来源于三部分：
 *
 * 1. `UI.json`：静态配置，会在 reference 中生成 $hoc 变量
 * 2. 远程的 UI_MODULE中的 metadata 字段
 *      * （默认值）最初的 metadata 字段为 FILE 模式（即文件路径）
 *      * （动态管理）如果管理过程中执行了更新，那么直接就是 metadata 的内容
 * 3. 如果 standard = false 那么不考虑 $hoc 的生成，而是直接使用 hoc 变量
 *      * 这种情况不引入 HocI18r 同样不引入 HocI18n 两个数据结构
 * 4. 如果 `standard = true` 那么有两种可能
 *      * 已经绑定过 UI.json，则使用混合模式（远程优先）
 *      * 未绑定过 UI.json，则直接使用远程模式
 *
 * ### 2. 模块读取
 *
 * 根据路径直接读取，路径中包含三部分，如：
 *
 * ```shell
 * /ox/ci/search
 * {
 *     app: "ox",
 *     module: "ci",
 *     page: "search"
 * }
 * ```
 *
 * `src/components/ci/search`代码目录中。
 *
 * Zero Ui中定义的应用维度主要分三层
 *
 * 1. app：应用层，依靠`Z_ROUTE`的环境变量规划不同的应用，多应用区分。
 * 2. module：模块，`src/components`目录下的第一层目录，上述的`ci`目录。
 * 3. page：页面，`src/components`目录下的第二层目录，上述的`search`目录。
 *
 * ### 3. 配置对象
 *
 * Zero Ui中的配置对象有两种类型：`HocI18n`和`HocI18r`两种，这两种数据对象的函数是一样的，但类型不同，也就是说
 * 这两个对象在调用配置读取的API如`Ux.fromHoc`和`Ux.fromPath`时会维持一致。
 *
 * 当前函数会读取`X_MODULE`的配置数据信息，如果存在，则和`Cab.json`的资源文件中的配置进行合并，生成最终的配置对象。
 *
 * * 远程数据存储于`HocI18r`。
 * * 本地资源配置存储于`HocI18n`。
 * * 本地和远程同时执行时候，直接读取metadata构造附加的`hoc`配置数据。
 *
 * @memberOf module:yi/utter
 * @method yiModule
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object|State} state 返回当前组件状态
 * @param {boolean} standard 是否执行标准化
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiModule = (reference, state = {}, standard = true) =>
    __Zu.yiModule(reference, state, standard);
/**
 * ## 「通道」`Ex.yiContainer`
 *
 * ### 1. 基本介绍
 *
 * #### 模板处理种类
 *
 * 1. 静态模板
 * 2. 动态模板
 *
 * #### 动态模板判断
 *
 * 判断`$dynamic`的依据和条件：
 *
 * 1. $router 中的 path 路径以：/ui/ 开头
 * 2. $router 中的参数同时包含：module / page
 *
 * 最终返回
 *
 * ```json
 * {
 *     app: "应用名",
 *     module: "模块名",
 *     page: "页面名"
 * }
 * ```
 *
 * * $container：容器配置
 * * $component：内部组件配置
 *
 * #### 渲染计算
 *
 * $dynamic：
 *
 * * = true：动态渲染，Ox Engine
 * * = false：静态渲染，Zero UI
 *
 * ### 2. 动态执行逻辑
 *
 * 这是Extension扩展中动态渲染模板的基础，最终都是为了改变当前组件中的state结构。
 *
 * #### 2.1. 路由解析
 *
 * 调用`_seekRoute`解析`react-router`相关信息，构造完成后状态如下：
 *
 * ```js
 * {
 *     $input: {
 *         app,
 *         module,
 *         page
 *     },
 *     $dynamic: "（Boolean）是否执行动态渲染",
 *     $secure: "（Boolean）是否安全页面（鉴权）"
 * }
 * ```
 *
 * 如果是动态页面，参数`$input`直接来自于路由和环境变量的计算：
 *
 * |参数|来源|含义|
 * |---|:---|:---|
 * |app|环境变量`Z_ROUTE`|当前应用的专用路由（标识应用程序）。|
 * |module|$router变量|当前页面所属模块。|
 * |page|$router变量|当前页面名称。|
 *
 * #### 2.2. 异步初始化
 *
 * 调用`startAsync`函数，初始化状态信息，完成后结构如下：
 *
 * ```js
 * {
 *     $tpl: {},
 *     $container: {},
 *     $grid: {},
 *     $assist: {},
 *     $controls: {}
 * }
 * ```
 *
 * |属性名|含义|
 * |:---|:---|
 * |$tpl|模板详细数据信息。|
 * |$container|容器配置信息。|
 * |$grid|生成的网格布局基础配置。|
 * |$assist|需使用的辅助数据定义。|
 * |$controls|所有当前页面需要的控件配置信息。|
 * |$secure|后期追加，页面是否执行鉴权。|
 *
 * #### 2.2. 模块配置
 *
 * 调用`yiModule`函数执行模块初始化（略）。
 *
 * #### 2.3. 页面配置
 *
 * 使用模块中存在的`data.$input`作为入参，读取页面配置信息，页面配置包括容器/组件双配置。
 *
 * #### 2.4. 页面规范化
 *
 * 调用`_seekPage`函数执行页面配置初始化，从`$output`对象中抽取数据信息：
 *
 * 1. 根据`$output.layout`重写状态中的`state.$tpl`模板信息。
 * 2. 若包含`$output.containerName`则重写状态中`state.$container`容器信息。
 * 3. 页面组件解析：
 *      1. 解析`$output.secure`属性，追加`state.$secure`属性。
 *      2. 读取`$output.grid`网格布局属性，重写`state.$grid`属性。
 *      3. 读取`$output.assist`辅助数据定义，重写`state.$assist`属性。
 *      4. 读取`$output.controls`配置数据，重写`state.$controls`属性。
 *
 * ### 3. 最终状态
 *
 * 执行完上述方法后的最终状态如（示例模板）：
 *
 * ```js
 * {
 *     $input:{
 *         app: "所属应用",
 *         module: "所属模块",
 *         page: "所属页面"
 *     },
 *     $output: "（输出）远程读取配置的基础数据",
 *     $dynamic: "（Boolean）是否动态渲染",
 *     $secure: "（Boolean）是否安全页面",
 *     $tpl: "使用模板的详细配置",
 *     $container: "容器相关配置",
 *     $grid: "网格布局基础信息",
 *     $assist: "辅助数据定义信息",
 *     $controls: "当前控件的所有配置信息"
 * }
 * ```
 *
 * > 状态中的数据存储是定义好的元数据信息，包括配置数据，其目的是为了让真正执行过程中的方法可根据这些数据对页面渲染进行计算。
 *
 * @memberOf module:yi/utter
 * @method yiContainer
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 执行更新过后的状态
 */
const yiContainer = (reference) =>
    __Zu.yiContainer(reference);
/**
 * ## 「通道」`Ex.yiCombine`
 *
 * @memberOf module:yi/utter
 * @param reference
 * @param extension
 * @returns {*}
 */
const yiCombine = (reference, extension = {}) =>
    __Zu.yiCombine(reference, extension);

// List部分的常用两个解析
/**
 * ## 「通道」`Ex.yiListQuery`
 *
 * @memberOf module:yi/utter
 * @param reference
 * @param query
 * @returns {*}
 */
const yiListQuery = (reference, query) =>
    __Zu.yiListQuery(reference, query);
/**
 * ## 「通道」`Ex.yiListOptions`
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 * @returns {*}
 */
const yiListOptions = (reference, config = {}) =>
    __Zu.yiListOptions(reference, config);
/**
 * ## 「通道」`Ex.yiListTab`
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 */
const yiListTab = (reference, config = {}) =>
    __Zu.yiListTab(reference, config);
/**
 * ## 「通道」`Ex.yiListPlugin`
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 */
const yiListPlugin = (reference, config = {}) =>
    __Zu.yiListPlugin(reference, config);
// ======================= Op, Table ===================
/**
 * ## 「通道」`Ex.yiListOp`
 *
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 * @param state
 */
const yiListOp = (reference, config = {}, state) =>
    __Zu.yiListOp(reference, config, state);
/**
 * ## 「通道」`Ex.yiListTable`
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 * @param state
 */
const yiListTable = (reference, config = {}, state = {}) =>
    __Zu.yiListTable(reference, config, state);
/**
 * ## 「通道」`Ex.yiListView`
 *
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 * @param state
 */
const yiListView = (reference, config = {}, state = {}) =>
    __Zu.yiListView(reference, config, state);
/**
 * ## 「通道」`Ex.yiListSynonym`
 *
 * @memberOf module:yi/utter
 * @param reference
 * @param config
 * @param state
 * @return {*}
 */
const yiListSynonym = (reference, config = {}, state = {}) =>
    __Zu.yiListSynonym(reference, config, state);
export default {
    // List
    yiListSynonym,
    yiListPlugin,
    yiListOptions,
    yiListTab,
    yiListQuery,
    // op / table
    yiListOp,
    yiListTable,
    yiListView,
    yiListLazy,
    // Non-List
    yiCombine,

    yiPartForm,
    yiColumn,
    yiStandard,
    yiModule,
    yiAssist,

    /**
     * ## 「通道」`Ex.yiControl`
     *
     * ### 1. 基本介绍
     *
     * 控件专用处理，从后端读取配置：UI_CONTROL / UI_FORM / UI_LIST
     *
     * 1. 单参，直接提取控件配置，调用`yoControl`执行容器和组件的配置规范化（container/component）。
     * 2. 双参，根据`control`和类型`type`执行控件配置提取（包括Form和List）
     *      1. 根据控件ID（`control`）和类型（`type`）读取基本配置和操作配置。
     *      2. 在响应信息中为操作注入ACL安全配置信息`__acl`。
     *      3. 再执行`parseControl`方法执行控件配置规范化（主要针对操作）
     *
     * ### 2. 使用场景
     *
     * > 该函数仅位于控件配置预初始化专用流程。
     *
     * @memberOf module:yi/utter
     * @method yiControl
     * @param {arguments} [arguments] 可选参数，变参
     * @returns {Promise<T>} 返回最终的 Promise。
     */
    yiControl,
    yiCompany,
    // 新版 Container 方法专用
    yiContainer,
}