/*
 * -------------> Component规范
 * 「一个组件传入到另外一个组件的基本规范参考此文件」：
 * 注意连接的生命周期位置：
 * 1）`yo`打头的
 *    说明：yo 打头的函数用于外置组件连接内置组件，写法自由，传入参数为
 *    (reference, addOn)
 *       - reference 是外置组件引用
 *       - addOn 是外置组件需要传入给内置组件的属性值
 * 1.1）传入统一说明（目前出现的）：
 * {
 *      $app: DataObject - 应用程序配置：X_APP 表内容,
 *      $router：DataRouter - (react-router）构造对象，保存了路由处理,
 *      $menus：DataArray - X_MENU 菜单数据信息，
 *      $user：DataObject - 登录用户基本数据信息,
 *      $inited：Object - Form专用初始化数据（外置传入）
 *      config：{
 *          配置数据，按 Component 处理自由度（不同组件配置信息有所区别）
 *      },
 *      data：[
 *          核心数据，按 Component 需求处理
 *      ],
 *      fnOut：redux 专用公共写数据,
 *      css：{
 *          `cls`打头，专用于Css中的 className 处理
 *      }
 * }
 * `yo`组件以目标组件需求格式为主，上述格式是最终的子组件的 props
 * Form表单专用
 * 1.2）列表：
 * - yoSider：ExSider
 * - yoNavigation: Ex
 *
 * Component规范 -------------->
 * 2）`yi`打头的
 *    说明：yi 打头的函数用于内置函数初始化专用，传入内容统一
 *    (reference)
 *       - reference 是内置组件引用
 *    `yi`会将内置组件 reference 解开，然后生成状态信息：state 并且设置到当前组件
 *    不同组件内置状态结构会有所区别
 *
 * Initialize规范 ------------->
 * 3）`yl`打头的
 *    说明：yl 打头的函数主要用于初始化操作
 *
 * yo - 哟，origin
 * yi - 嗨，hi - initialize
 * yc - 配，config
 * yx - yxRender -> 切换 render 处理
 *
 * 动态 Control
 *
 * 按钮专用过滤函数，主要过滤几种：
 * 1）Open区
 * 2）Batch区
 * 3）Search区
 * 4）Extra区
 * 5）Row区
 *
 * 几个特定函数
 * -- yoList -> 列表区域
 * -- yoTab -> Tab页
 * -- yoForm -> 表单区域
 * -- yoTable -> 列表区域
 */
import __Zu from 'zet';

/**
 * ## 「通道」`Ex.yoExtension`
 *
 *  * 区域执行
 *  * prefix 参数
 *  *
 *  * - 打开区域：op.open
 *  * - 批量区域：op.batch
 *  * - 额外区域：op.extra
 *  * - 搜索区域：op.search
 *  * - Tab页区域：op.tab
 *  * - 列 Row 的区域：op.row
 *
 * @memberOf module:yo/utter
 * @param reference
 * @param prefix
 * @param actions
 * @return {*}
 */
const yoExtension = (reference, prefix, actions = []) =>
    __Zu.yoExtension(reference, prefix, actions);
/**
 * ## 「通道」`Ex.yoAmbient`
 *
 * ### 1. 基本介绍
 *
 * 该方法为高频使用方法，几乎所有的组件需要继承属性时调用该方法生成`inherit`属性集。
 *
 * ### 2. 核心属性
 *
 * 计算继承属性（统一继承属性专用处理），统一继承的属性：
 *
 * 1. 基本属性：
 *      * $app：应用数据，DataObject
 *      * $user：登录用户数据，Object
 *      * $router：路由数据，DataRouter
 *      * $menus：菜单专用数据，DataObject
 *      * $profile: 登录用户Profile信息
 *      * $parent: 父记录专用数据
 *      * $submitting：redux防重复提交专用
 *      * **$hotel**：旧系统专用
 * 2. 标识符专用属性，读取属性中的 $identifier 模型标识符。
 * 3. 特殊禁用变量：$disabled 属性。
 * 4. 提交状态变量
 *      * $submitting：正在提交
 *      * $loading：正在加载
 *      * $dirty：脏数据
 *      * $collapsed：菜单开合处理
 * 5. 选中项：$selected
 * 6. 函数处理，继承函数前缀：`rx, do, fn`。
 * 7. 特殊引用
 *      * reference：父引用
 *      * react：根引用
 * 8. 插件配置
 *      * $plugins：插件继承
 * 9. 选项`$options`处理，执行`_seekOption`方法：
 *
 * 10. 编程配置 config 合并到 `uniform.config`中形成最终配置。
 * 11. Assist数据提取，从 props 和 state 中提取，之后处理 rxAssist 中部函数。
 * 12. 动态操作符：`$opKey` 注入
 * 13. 附加配置：`$record` 专用处理
 *      * 外层变量是单变量，用于记录拷贝
 *      * 如果是数组，必定会在 Form 中选择方式，那可直接走 Assist
 *      * 外层变量会在config过程中引入特殊属性`rowData`用于记录外层选中记录
 * 14. 配置处理完过后冻结，调用：`freeze`
 *
 * ### 3. 属性继承表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |$app|props|DataObject|$app|应用程序配置数据，也可以直接调用`Ux.isInit()`读取。|
 * |$user|props|Object|$user|登录用户基础数据，也可以直接调用`Ux.isLogged()`读取。|
 * |$profile|props|DataObject|$profile|（保留属性）|
 * |$router|props|DataRouter|$router|react-router路由器专用对象。|
 * |$menus|props|Array|$menus|当前应用程序所需的所有菜单信息。|
 * |$parent|props|Object|$parent|父记录数据（直接引用父记录），一般存储顶层记录数据。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 * |$disabled|props|Boolean|$disabled|是否禁用组件。|
 * |$submitting|props|Boolean/DataObject|$submitting|如果是redux则是DataObject对象，如果是state中读取，则是Boolean类型。|
 * |$selected|props|Any|$selected|从属性中直接继承`$selected`变量（选中项）。|
 * |函数|props|Function|rx/fn/do|从属性中继承所有函数属性，rx，fn，do三种。|
 * |this|无|React|reference|构造当前引用，该引用会输入成为组件消费的父引用（Zero Ui基础规范）。|
 * |react|无|React|react|顶层引用。|
 * |$collapsed|props|Boolean|$collapsed|当前应用的菜单打开/关闭状态。|
 * |$plugins|props|Object|$plugins|需要继承的插件属性信息。|
 * |$options|props|Object|$options|「低优先级」（从属性继承）选项数据。|
 * |$options|state|Object|$options|「中优先级」（从当前组件状态中构造）选项数据。|
 * |module.options|state|Object|$options|「高优先级」（从当前组件$hoc中读取，远程加本地）选项数据。|
 * |辅助数据|props|DataArray|`$t_/$a_`|读取属性直接继承的辅助数据。|
 * |辅助数据|state|DataArray|`$t_/$a_`|读取当前组件状态中构造的辅助数据（优先级更高）。|
 * |$opKey|props|String|$opKey|动态配置时使用的操作主键`$opKey`。|
 * |$record|props|Any|$record|记录专用数据，结构很多，在DialogEditor中还包含了专用rowData数据。|
 * |config|计算|Object|config|计算最终的组件配置信息。|
 *
 * ### 4. 函数核心
 *
 * #### 4.1. _seekOption
 *
 * 在`$options`属性构造过程中，原始的`uniform.$options = yoOption(reference);`已经被废弃，采用新的
 * `_seekOption/_seekOptionPre`方法执行计算
 *
 * 1. 先调用`_seekOptionPre`方法
 * 2. 再调用`_seekOption`方法
 *
 * 配置源头来自于几处：
 *
 * 1. props属性中的`$options`变量存储的配置信息。
 * 2. state状态中`$options/options`两个变量，options是旧系统专用变量（暂时不废弃），$options是统一过后的新变量。
 * 3. 如果存在`$hoc`（执行过资源绑定），那么读取`_module`节点（远程加本地），使用`module.options`执行再合并。
 *
 * #### 4.2. $record/$parent
 *
 * 这两个变量都用于存储父记录数据
 *
 * * $parent：父记录专用数据（旧系统模式），标准格式Object
 * * $record：扩展模块才出现的专用数据，附加额外的父类数据结构
 *      * rowData：DialogEditor中用来存储选中行的数据信息。
 *
 * 类似下边布局
 *
 * ```
 * |--------------------------------------------------|
 * |  Form (Grid)                                     |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |--------------------------------------------------|
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |--------------------------------------------------|
 * ```
 *
 * * `$parent`存储的是`Form(Grid)`表单的完整数据。
 * * `$record.rowData`存储的是字段中某一行的数据（子表单增删改）。
 *
 * #### 4.3. $record/$options
 *
 * * $options用于继承配置内容，元数据继承。
 * * $record用于继承数据内容，数据继承。
 *
 * @memberOf module:yo/utter
 * @method yoAmbient
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} config 额外的配置数据
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoAmbient = (reference = {}, config = {}) =>
    __Zu.yoAmbient(reference, config);


/**
 * ## 「通道」`Ex.yoDynamic`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，然后追加配置：
 *
 * > （新版移除了$identifier，挪动到yoAmbient中，静态动态都会使用）
 *
 * 1. 追加$controls控件配置信息，直接继承`$controls`配置数据
 * 2. 初始化数据 $inited，直接继承初始化表单数据（表单专用）
 * 3. $mode，表单模式，`ADD | EDIT`传入
 * 4. $fabric，Ox的`Fabric`引擎专用变量，存储了fabric相关配置信息
 *
 * ### 2. 属性继承表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |$controls|props|Any|$controls|控件配置数据。|
 * |$inited|props|Object|$inited|专用表单初始化数据。|
 * |$mode|props|String|$mode|表单模式，ADD = 添加模式，EDIT = 编辑模式。|
 * |$fabric|props|Object|$fabric|Fabric引擎专用定义数据（执行Ox逻辑专用）。|
 *
 * ### 3. 关于$inited
 *
 * 1. 默认读取props中的`$inited`变量作为继承的表单初始化数据
 * 2. 如果当前组件的状态state中生成了新的`$inited`数据
 *      * 子表单专用，使用state中的`$inited`数据构造子表单初始化数据
 *      * 构造rxView函数用于更改当前状态中的表单初始化数据
 *
 * ```
 *     $inited
 * ---------------> props（低优先级）
 *                                  $inited, rxView
 *           ------ state（高优先级）------------------> 子组件
 *           |        |
 *        $inited     |
 *           |        |
 *           ---------|
 * ```
 *
 * @memberOf module:yo/utter
 * @method yoDynamic
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoDynamic = (reference = {}) =>
    __Zu.yoDynamic(reference);

/**
 * ## 「通道」`Ex.yoPolymorphism`
 *
 * ### 1. 基本介绍
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，之后追加：
 *
 * 1. 直接读取fromHoc中的grid配置
 * 2. 如果传入了专用表单配置，则处理form表单配置，填充$form变量
 * 3. state中的$query读取
 * 4. state中的config.options中读取$identifier
 * 5. 构造$inited中的$identifier
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |config|state|Object|config|直接从 grid 中读取核心配置，Ox组件动态渲染专用。|
 * |$query|state|Object|$query|构造子组件所需的查询条件。|
 * |form|第二参|Object|$form|表单配置，使用拷贝config改变原始配置。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 特定场景
 *
 * 对应特定界面处理，目前常用于`X_CATEGORY`和`X_TABULAR`的管理。
 *
 * ```
 * |--------------------------------------------------|
 * |  Menu  |  Content ( List )                       |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |--------------------------------------------------|
 * ```
 *
 * * 左边部分是选择。
 * * 右边部分是一个完整带有List界面的主界面（`ExListXxx`页）。
 *
 *
 * @memberOf module:yo/utter
 * @method yoPolymorphism
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} form
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoPolymorphism = (reference = {}, {form}) =>
    __Zu.yoPolymorphism(reference, {form});
/**
 * ## 「通道」`Ex.yoControl`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 输入配置的基本信息如（四大基本组件）：
 *
 * ```
 * {
 *     "type": "COMPONENT / LIST / FORM / CONTAINER",
 *     "sign": "64位随机加密字符串，组件创建时生成，后期可验证属性的版本。"
 * }
 * ```
 *
 * 代码执行流程如下
 *
 * 1. `type = CONTAINER`：调用`_seekContainer`处理容器配置。
 * 2. `type <> CONTAINER`的类型：
 *      1. 先调用`_seekContainer`处理容器配置。
 *      2. 再调用`_seekComponent`处理组件配置。
 *
 * ### 2. 核心流程解析
 *
 * #### 2.1. `_seekContainer`
 *
 * > componentName存在时才能构造容器配置，否则传入的`attrs`为空对象。
 *
 * 函数签名：
 *
 * ```js
 * const _seekContainer = (attrs = {}, control = {}, componentType)
 * ```
 *
 * 主要是构造`attrs.container`对象，输入的control数据结构如下：
 *
 * ```js
 * {
 *      containerConfig: "容器基础配置信息",
 *      containerName: "「Required」容器名称，必须包含该配置"
 * }
 * ```
 *
 * 构造的`container`的数据结构如下：
 *
 * ```js
 * {
 *     key: "设置成控件主键 control.key",
 *     pageId: "读取控件中关联页面ID control.pageId",
 *     name: "设置成containerName的值",
 *     config: "读取containerConfig，否则就直接置空 {}",
 *     componentType: "函数中的第三参"
 * }
 * ```
 *
 * #### 2.2. `_seekComponent`
 *
 * 函数签名：
 *
 * ```js
 * const _seekComponent = (attrs = {}, control = {}) => {
 * ```
 *
 * 直接构造组件配置，输入的control数据结构如下：
 *
 * ```js
 * {
 *     componentConfig: "组件基础配置信息",
 *     componentData: "当前组件依赖的数据信息",
 *     componentName: "当前组件名称"
 * }
 * ```
 *
 * 构造的最终`attrs`数据结构如下：
 *
 * ```js
 * {
 *     key: "设置成控件主键 control.key",
 *     pageId: "读取控件中关联页面ID control.pageId",
 *     name: "设置成componentName的值",
 *     config: "设置成componentConfig，否则直接置空",
 *     source: "设置成componentData，作为当前组件专用数据源"
 * }
 * ```
 *
 * ### 3. 容器/组件
 *
 * 动态渲染过程中，最终形成的jsx的数据结构如：
 *
 * ```jsx
 * <!-- 容器层 -->
 * <Container>
 *     <!-- 组件层 -->
 *     <Component/>
 * </Container>
 * ```
 *
 * ### 4. 后端动态输入
 *
 * 后端动态输入的结构来自于`UI_CONTROL, UI_LIST, UI_FORM`几张表，完整数据结构如下：
 *
 * ```json
 * {
 *     
 * }
 * ```
 *
 * @memberOf module:yo/utter
 * @method yoControl
 * @param {Object} control 控件原始配置。
 * @returns {Object} 返回动态处理中的控件专用配置。
 */
const yoControl = (control = {}) =>
    __Zu.yoControl(control);

/**
 * ## 「通道」`Ex.yoFilter`
 *
 * > 优先读取`Ex.yoDynamic`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 查询表单专用，构造查询信息，内置先调用`yoDynamic`处理。
 *
 * 1. 初始化表单值`$inited`，赋予`connector`的连接符。
 * 2. rxClose构造，可关闭子表单。
 *
 * ### 2. $inited
 *
 * 该方法会为表单数据追加`connector`字段（搜索条件表单专用）。
 *
 * @memberOf module:yo/utter
 * @method yoFilter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoFilter = (reference) =>
    __Zu.yoFilter(reference);
/**
 * ## 「通道」`Ex.yoForm`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 该函数的处理内容：
 *
 * 1. form 基本配置处理
 * 2. assist 赋值数据处理
 * 3. control 控件配置
 *      magic：处理Ajax专用
 *      control：控件配置
 *      addon：处理AddOn
 * 4. dialog 窗口专用配置
 * 5. config 核心配置
 * 6. $inited 初始化数据
 * 7. 表单处理专用
 *      $identifier：统一标识符
 *      $mode：表单模式，ADD/EDIT
 *      $addKey：添加表单的组件
 *
 * ### 2. 属性继承表
 *
 * #### 2.1. 构造`config`属性
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |form|addOn|Object|config.form|编程模式下的表单配置。|
 * |_form|cab|Object|config.form|前端静态配置（主配置）。|
 * |_formUp|cab|Object|config.form|前端静态上表单配置（辅助配置）。|
 * |_formDown|cab|Object|config.form|前端静态下表单配置（辅助配置）。|
 * |_form|ajax|Object|config.form|后端动态配置（主配置）。|
 * |_formUp|ajax|Object|config.form|后端动态上表单配置（辅助配置）。|
 * |_formDown|ajax|Object|config.form|后端动态下表单配置（辅助配置）。|
 * |assist|addOn|Object|assist|表单中的辅助数据定义。|
 * |magic|addOn|Object|magic|数据远程加载专用配置。|
 * |addon|addOn|Object|addon|附加组件专用配置。|
 * |control|addOn|Object|control|读取`UI_FORM`专用远程配置。|
 * |dialog|addOn|Object|dialog|（标题）构造窗口配置。|
 * |modal|addOn|Object|modal|（配置）构造窗口配置。|
 *
 * #### 2.2. 特殊继承属性
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |data|入参|Object|$inited|构造表单专用数据。|
 * |$mode|props|String|$mode|表单模式：ADD,EDIT。|
 * |$addKey|props|Any|$addKey|添加生成的UUID，作为子表单专用主键。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 * ||计算|Object|__acl|表单权限基础数据。|
 *
 * ### 3. 表单布局计算
 *
 * #### 3.1. 配置数据源
 *
 * 1. addOn.form：通过编程部分拿到的 form 信息
 * 2. S0（前端静态文件）_form：前端静态配置（主配置）——通常静态form使用此配置
 * 3. S1（前端上表单）_formUp：前端静态配置（辅助配置）
 * 4. S2（前端下表单）_formDown：前端静态配置（辅助配置）
 * 5. D0（后端动态文件）form：后端主配置
 * 6. D1（后端上表单）formUp：后端主配置
 * 7. D2（后端下表单）formDown：后端主配置
 * 布局最终顺序：
 *
 * ```js
 * 表单布局顺序       模式1     模式2     模式3
 * addon.form
 *         S1                           o
 *         D1
 *         S0        o         o        o
 *         D0                  o        o
 *         S2                           o
 *         D2
 * ```
 *
 * > 有了上述结构后，可根据资源文件和远程配置构造不同的表单布局字段数据（2 x 3合计六个维度）。
 *
 * #### 3.2. 关于表单的权限说明
 *
 * （略）后期补充
 *
 * #### 3.3. 专用配置的格式
 *
 * > 主要是补充 additional 的格式信息
 *
 * @memberOf module:yo/utter
 * @method yoForm
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} additional 额外配置处理
 * @param {Object} data 数据记录相关信息
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoForm = (reference, additional = {}, data = {}) =>
    __Zu.yoForm(reference, additional, data);
/**
 * ## 「通道」`Ex.yoAction`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 按钮和操作专用，`ExAction/ExButton` 专用的处理。
 *
 * 按钮专用过滤函数，主要过滤几个区域的核心按钮：
 *
 * 1. Open区
 * 2. Batch区
 * 3. Search区
 * 4. Extra区
 * 5. Row区
 * 6. Extension扩展（全区域）
 *
 * ### 2. 核心执行逻辑
 *
 * 该函数的核心执行逻辑如：
 *
 * 1. 调用`yoAmbient`初始化继承属性。
 * 2. 顺序计算/无序计算（针对state中的`op`变量定义）。
 * 3. 执行前缀过滤。
 *
 * ### 3. 默认值
 *
 * #### 3.1. 默认的顺序配置：
 *
 * ```json
 * {
 *      "op.open": [
 *          "op.open.add",
 *          "op.open.filter"
 *      ],
 *      "op.batch": [
 *          "op.batch.edit",
 *          "op.batch.delete"
 *      ],
 *      "op.extra": [
 *          "op.extra.column",
 *          "op.extra.export",
 *          "op.extra.import"
 *      ],
 *      "op.add": [
 *          "op.submit.add",
 *          "op.submit.reset"
 *      ],
 *      "op.edit": [
 *          "op.submit.save",
 *          "op.submit.delete",
 *          "op.submit.reset"
 *      ]
 * }
 * ```
 *
 * #### 3.2. 列表区域图示
 *
 * > 带`*`的是存在配置的区域。
 *
 * **列表页**
 *
 * ```
 * |--------------------------------------------------|
 * | *Open    *Batch               Search      *Extra |
 * |--------------------------------------------------|
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |--------------------------------------------------|
 * ```
 *
 * **表单页**
 *
 * ```
 * |--------------------------------------------------|
 * |                                     *Add / *Edit |
 * |--------------------------------------------------|
 * |  Form (Grid)                                     |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |--------------------------------------------------|
 * ```
 *
 * #### 3.3. 各项详解
 *
 * |页面|区域前缀|区域代码|值|含义|
 * |---|:---|:---|:---|:---|
 * |列表页|op.open|Open区域|op.open.add|添加新记录|
 * ||||op.open.filter|清空列过滤条件（每一列的列过滤条件清除按钮）|
 * ||op.batch|Batch区域|op.batch.edit|批量编辑|
 * ||||op.batch.delete|批量删除|
 * ||op.extra|Extra区域|op.extra.column|列更改区域|
 * ||||op.extra.export|导出按钮|
 * ||||op.extra.import|导入按钮|
 * |表单页|op.add|Add提交区|op.submit.add|添加按钮|
 * ||||op.submit.reset|重置按钮|
 * ||op.edit|Edit提交区|op.submit.save|保存按钮|
 * ||||op.submit.delete|删除按钮|
 * ||||op.submit.reset|重置按钮|
 *
 * 后边两个区域`Add提交区/Edit提交区`主要位于内置的表单页，除开上边的五个核心区域以外，还会根据
 * `op.extension`前缀对应的配置来追加自定义按钮，以完成按钮的配置流程。
 *
 * @memberOf module:yo/utter
 * @method yoAction
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {String} prefix 操作前缀
 * @param {Object} ordered 排序专用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoAction = (reference, prefix = "", ordered) =>
    __Zu.yoAction(reference, prefix, ordered);

/**
 * ## 「通道」`Ex.yoRender`
 *
 * ### 1. 基本介绍
 *
 * （高频函数）执行渲染拦截的专用函数：
 *
 * 1. `$ready = true`，执行渲染。
 * 2. `$ready = false`，不执行渲染，只 Loading。
 *
 * ### 2. 核心
 *
 * #### 2.1. 加载
 *
 * 该函数不提供属性集，主要用于加载，它和`xtReady`的区别点在于：
 *
 * * xtReady：自定义组件专用`economy`目录下的所有组件。
 * * yoRender：Extension组件专用`extension/ecosystem`目录下的扩展组件。
 *
 * #### 2.2. 过渡
 *
 * 这个函数主要为过渡效果量身打造。
 *
 * @memberOf module:yo/utter
 * @method yoRender
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Function} fnJsx 执行jsx的Render
 * @param {Object} debug 调试信息
 * @returns {JSX.Element}
 */
const yoRender = (reference = {}, fnJsx, debug = {}) =>
    __Zu.yoRender(reference, fnJsx, debug);

/**
 * ## 「通道」`Ex.yoTabPage`
 *
 * ### 1. 基本介绍
 *
 * 该函数用于构造`<Tabs/>`中每一页专用的配置，该值最终会构造`<Tabs.?abPane/>`元素。
 *
 * 核心逻辑
 *
 * 1. 根据`tabs.count`运算可打开的页签数，超过限制不再打开。
 * 2. 如果打开了新的页签，旧页签是否处于禁用状态（防止不专注工作副总用）。
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用
 * @param {Array} items 每一个页签的配置，构成完整数组
 * @param {Number} index 当前页签的索引信息
 * @param {Object} item 每一个页签的配置信息
 * @returns {Object}
 */
const yoTabPage = (reference, {
    items = [],           // 总的 items
    index = 0,          // 当前 item的索引
    item,                // 当前 item
}) => __Zu.yoTabPage(reference, {
    items,
    index,
    item,
})
/**
 * ## 「通道」`Ex.yoFormAdd`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 该方法近似于`yoList`，但该属性集是传递给表单，附带了表单属性集。
 *
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|rxClose|关闭表单容器专用回调方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |key|页签|Any|$addKey|添加表单主记录主键。|
 * |||String|$mode|固定值"ADD"。|
 * |options|state|Object|$identifier|当前列表的配置数据，从配置数据中抽取配置项：`identifier`。|
 * |plugins|state|Object|$plugins|为子表单计算`pluginField`字段控制专用函数。|
 * |$query|props|Object|$query|当前列表的查询条件，处理特殊条件专用。|
 * |$rowData|state|Object|$record.rowData|子表单中DialogEditor专用行选中记录信息。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于模型标识符
 *
 * 该方法在内部使用，为静态标识符，所以只支持静态模式下的identifier模型标识符读取，不从远程获取，
 * 远程获取会在`OxList`组件中完成，而不是`ExListXxx`组件中。
 *
 * #### 3.2. rxClose
 *
 * 关闭回调函数可以被子表单使用，子表单提交完成后通常会调用`rxClose`函数关闭表单返回到列表界面，
 * 返回时还会重新加载列表。
 *
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @param {Object} item 页签配置
 * @returns {Object} 传入添加子表单的属性集
 */
const yoFormAdd = (reference, item = {}) =>
    __Zu.yoFormAdd(reference, item);
/**
 * ## 「通道」`Ex.yoFormEdit`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 该方法近似于`yoList`，但该属性集是传递给表单，附带了表单属性集。
 *
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|rxClose|关闭表单容器专用回调方法。|
 * |构造||Function|rxView|读取数据记录专用回调方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |||String|$mode|固定值"EDIT"。|
 * |options|state|Object|$identifier|当前列表的配置数据，从配置数据中抽取配置项：`identifier`。|
 * |plugins|state|Object|$plugins|为子表单计算`pluginField`字段控制专用函数，并且计算`pluginRow`（转换成`pluginForm`）控制函数。|
 * |$query|props|Object|$query|当前列表的查询条件，处理特殊条件专用。|
 * |$inited|state|Object|$inited|编辑表单初始化数据专用。|
 * |$rowData|state|Object|$record.rowData|子表单中DialogEditor专用行选中记录信息。|
 *
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于模型标识符
 *
 * 该方法在内部使用，为静态标识符，所以只支持静态模式下的identifier模型标识符读取，不从远程获取，
 * 远程获取会在`OxList`组件中完成，而不是`ExListXxx`组件中。
 *
 * #### 3.2. 关于插件
 *
 * `pluginRow`插件在表单中本身作为了行控制，所以内置子表单的字段控制直接设置成该函数
 *
 * * 如果列表中数据不可编辑，那么表单中的数据不可编辑（只读）。
 * * 如果列表中数据不可删除，那么表单中的数据不可删除。
 *
 * > 编辑/删除两种操作在列表和表单中维持一致性。
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @param {Object} item 当前打开以前配置，页签`key`就是记录主键。
 * @returns {Object} 传入编辑子表单的属性集
 */
const yoFormEdit = (reference, item = {}) =>
    __Zu.yoFormEdit(reference, item);

/**
 * ## 「通道」`Ex.yoListSearch`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * > *: 这个函数和其他`yoList`有一定区别，主要在属性构造上。
 *
 * 基础搜索/高级搜索工具栏专用，基本逻辑类似于`yoFormAdd/yoFormEdit`，提供给查询表单用的属性集。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |options|state|Object|$options|当前组件构造的options选项信息，直接继承。|
 * |$filters|state|Object|$inited|「主条件」根据条件数据构造高级搜索表单的初始化数据。|
 * |$filtersRaw|state|Object|$inited|「辅助条件」根据条件数据构造高级搜索表单的初始化数据，配置化特殊情况专用。|
 * |构造||Object|config|从options中直接抽取`search`打头的选项。|
 * |构造||Boolean|$disableClear|是否禁止清空按钮，如果没有条件则禁用该按钮。|
 * |构造||Function|rxViewQ|构造查询条件，双参，同时修改主条件和辅助条件，查询表单提交用。|
 * |$form|props|Object|$form|传入基础配置`key = Jsx`的表单元素哈希表，后期根据键值抽取表单。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于搜索模式
 *
 * 搜索模式可以通过`search.enabled`和`search.advanced`两个选项来执行开启和禁用：
 *
 * 1. `search.enabled`：启用基础搜索（搜索框）。
 * 2. `search.advanced`：启用高级搜索（搜索表单）。
 *
 * #### 3.2. 查询条件
 *
 * 影响`ExListXxx`的条件有三个状态值：`$filters, $condition, $query`：
 *
 * * $query：主条件，包括从外置传入的条件
 * * $condition：列过滤专用条件
 * * $filters：当前组件操作的条件（基础搜索和高级搜索）
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} 工具栏消费专用的属性集。
 */
const yoListSearch = (reference) =>
    __Zu.yoListSearch(reference);
/**
 * ## 「通道」`Ex.yoListOpen`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Open区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.open` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.open.xxx"
 * }
 * ```
 *
 * ### 2. 构造属性表
 *
 * （无）
 *
 * ### 3. 核心
 *
 * #### 3.1. 清除
 *
 * 针对`op.open.filter`执行查询条件清除按钮的禁用和启用提示，如果执行了列过滤，则启用该按钮，如果未执行，则不启用该按钮，根据`$condition`来。
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
const yoListOpen = (reference) =>
    __Zu.yoListOpen(reference);
/**
 * ## 「通道」`Ex.yoListBatch`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Batch区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.batch` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.batch.xxx"
 * }
 * ```
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |||String|$category|固定值，按钮类型，`LINK | BUTTON`两种，此处为`LINK`。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |构造||Function|rxBatchEdit|批量编辑所需的外层函数，设置选中状态专用。|
 * |$columns|state|Array|（内嵌）|「动态」批量编辑`op.batch.edit`专用配置，编辑表单读取属性用。|
 * |$columnsMy|state|Array|（内嵌）|「动态」批量编辑`op.batch.edit`专用配置，编辑表单读取属性配置用。|
 * |$selected|state|Array|$selected|已选中的项数据列表。|
 * |$submitting|state|Boolean|$submitting|防重复提交的基础提交状态。|
 * |构造||Array|config|按钮专用配置构造函数，构造两部分：基础 + 扩展，包括选择未选中的状态计算。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于选中
 *
 * 批量操作启用时，`<Table/>`中会根据批量操作种类设置多选框，一旦有一个操作合法则会提供多选框，
 * 多选框操作变量为`$selected`，它为批量操作提供了数据选中依据，为了防止用户选错，当任何选项都未选中时，
 * 批量操作会被禁用。
 *
 * #### 3.2. 关于编辑
 *
 * 批量编辑是Zero Ui提供的固定功能，`op.batch.edit`，该功能会根据当前记录的列信息和视图信息（`columnFull/columnMy`）来计算
 * 最终可编辑的属性表，属性信息支持不同种类，其控件内容也不同。
 *
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
const yoListBatch = (reference) =>
    __Zu.yoListBatch(reference);
/**
 * ## 「通道」`Ex.yoListExtra`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Extra区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.extra` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.extra.xxx"
 * }
 * ```
 *
 * > 关于 `$columns/$columnsMy` 的注入，这个区域也会需要，但由于数据结构不同，而一直没有出问题，这部分暂时不执行代码合并。重复代码部分如：
 *
 * ```js
 *      editorRef.config.forEach((config = {}) => {
 *
 *          const {component = {}} = config;
 *          const editorRef = component.config;
 *
 *          editorRef.$columns = $columns;
 *          editorRef.$columnsMy = $columnsMy;
 *      });
 * ```
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |构造||Function|rxMyViewV|保存我的视图专用方法，可创建我的`列视图`。|
 * |构造||Function|rxExport|导出数据按钮专用。|
 * |构造||Function|rxImport|导入数据专用按钮。|
 * |构造||Function|rxViewV|设置`projection`列视图专用方法，选择了列视图过后，可设置当前列表显示那些列信息。|
 * |$columns|state|Array|（内嵌）|我的视图列。|
 * |$columnsMy|state|Array|（内嵌）|模型全列。|
 *
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于列视图
 *
 * 列视图在构造过程中层次如下：
 *
 * ```
 * |-------------------------------------------- 全列 |
 * |--------------------------------------     业务列 |
 * |------------------------------ ACL控制      可见列 |
 * |------------------------ 保存               视图列 |
 * ```
 *
 * 最终关系：
 *
 * 1. 全列 = 系统列（不可见） + 业务列（可见）
 * 2. 业务列 = ACL可见（$columns） + ACL不可见（权限控制列）
 * 3. ACL可见列 = 我的视图列（$columnsMy） + 视图未选中列
 *
 * #### 3.2. 三个基础函数
 *
 * 该函数会构造三个核心函数，对应三个系统按钮
 *
 * |按钮代码|函数|含义|
 * |:---|:---|:---|
 * |op.extra.column|rxViewV|设置选中列，未保存之前刷新后失效，如果保存了下一次生效。|
 * |op.extra.export|rxExport|导出数据专用按钮。|
 * |op.extra.import|rxImport|导入数据专用按钮。|*
 *
 * @memberOf module:yo/utter
 * @param {Object|ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
const yoListExtra = (reference) =>
    __Zu.yoListExtra(reference);
/**
 * ## 「通道」`Ex.yoListGrid`
 *
 * @memberOf module:yo/utter
 * @param reference
 * @param config
 * @return {*}
 */
const yoListGrid = (reference, config = {}) =>
    __Zu.yoListGrid(reference, config);
/**
 * ## 「通道」`Ex.yoDialog`
 * @memberOf module:yo/utter
 * @param reference
 * @param dialog
 */
const yoDialog = (reference, dialog = {}) =>
    __Zu.yoDialog(reference, dialog);
/**
 * ## 「通道」`Ex.yoContainer`
 * @memberOf module:yo/utter
 * @param reference
 * @param Component
 * @return {*}
 */
const yoContainer = (reference, Component) =>
    __Zu.yoContainer(reference, Component);
/**
 * ## 「通道」`Ex.yoAtomContainer`
 *
 * @memberOf module:yo/utter
 * @param reference
 * @param ComponentDefault
 * @param Oi
 * @return {{inherit: *, Component: *}}
 */
const yoAtomContainer = (reference, ComponentDefault, Oi) =>
    __Zu.yoAtomContainer(reference, ComponentDefault, Oi);
/**
 * ## 「通道」`Ex.yoAtomComponent`
 *
 * @memberOf module:yo/utter
 * @param reference
 */
const yoAtomComponent = (reference) =>
    __Zu.yoAtomComponent(reference);
/**
 * ## 「通道」`Ex.yoTplSider`
 * @memberOf module:yo/utter
 * @param reference
 */
const yoTplSider = (reference) =>
    __Zu.yoTplSider(reference);
/**
 * ## 「通道」`Ex.yoTplHeader`
 *
 * @memberOf module:yo/utter
 * @param reference
 * @param banner
 */
const yoTplHeader = (reference, {
    banner,
}) => __Zu.yoTplHeader(reference, {banner});
/**
 * ## 「通道」`Ex.yoTplNavigation`
 * @memberOf module:yo/utter
 * @param reference
 * @param homepage
 * @param extra
 */
const yoTplNavigation = (reference = {}, {
    homepage,
    extra,
}) => __Zu.yoTplNavigation(reference, {homepage, extra});
/**
 * ## 「通道」`Ex.yoTplAccount`
 * @memberOf module:yo/utter
 * @param reference
 * @param window
 */
const yoTplAccount = (reference = {}, {
    window
}) => __Zu.yoTplAccount(reference, {window});

/**
 * ## 「通道」`Ex.yoQrQBE`
 * @memberOf module:yo/utter
 * @param reference
 */
const yoQrQBE = (reference) =>
    __Zu.yoQrQBE(reference);
/**
 * ## 「通道」`Ex.yoQrCond`
 *
 * @memberOf module:yo/utter
 * @param reference
 * @param config
 */
const yoQrCond = (reference, config = {}) =>
    __Zu.yoQrCond(reference, config)
/**
 * ## 「通道」`Ex.yoQrTag`
 * @memberOf module:yo/utter
 * @param reference
 * @param config
 */
const yoQrTag = (reference, config = {}) =>
    __Zu.yoQrTag(reference, config);
/**
 * ## 「通道」`Ex.yoGrid`
 *
 * @memberOf module:yo/utter
 * @param reference
 */
const yoGrid = (reference) =>
    __Zu.yoGrid(reference);
export default {
    yoGrid,
    yoQrQBE,
    yoQrCond,
    yoQrTag,
    /**
     * ## 「通道」`Ex.yoComponent`
     *
     * `yoAmbient`函数对应的别名函数，代码逻辑一模一样，`yoAmbient`等价函数。
     *
     * @memberOf module:yo/utter
     * @method yoComponent
     * @param {Object|ReactComponent} reference React对应组件引用
     * @param {Object} config 额外的配置数据
     * @returns {Object} 计算最终生成的继承属性专用方法
     */
    yoComponent: yoAmbient, // 环境数据（统一处理）
    yoContainer,            // 专用
    // Container 专用统一方法
    yoTplSider,             // 「模板」菜单专用
    yoTplHeader,            // 「模板」头专用
    yoTplNavigation,        // 「模板」导航专用
    yoTplAccount,           // 「模板」头部访问账号专用

    // 动态组合 专用统一方法
    yoAtomContainer,     // 带动态模板的玩法
    yoAtomComponent,     // 带动态模板的
    yoDynamic,
    yoPolymorphism,

    yoAmbient,              // 环境数据（统一处理）
    yoControl,
    yoForm,
    yoFilter,
    yoRender,           // 普通组件专用渲染

    yoAction,
    yoExtension,

    yoTabPage,              // Tab页签

    yoFormAdd,          // 添加表单
    yoFormEdit,         // 编辑表单

    yoListSearch,       // 搜索区域
    yoListOpen,         // 打开区域
    yoListBatch,        // 批量区域
    yoListExtra,        // 额外区域
    yoListGrid,         // 区域计算
    yoDialog,           // 窗口专用修正方法
}