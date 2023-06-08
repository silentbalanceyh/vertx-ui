import __Zn from 'zone';
import __Zi from 'zi';
// --------------------------------------------------------
Object.freeze(process.env);
// ------------------ I.economy.js ---------------------
const IMAGE = {
    ...__Zi.Env.V_IMAGE,
    /**
     * ## App图：文件图标
     *
     * ### 基本说明
     *
     * 针对不同文件类型的专用图标，可直接解析成图片格式的默认系统图标，根据后缀名分类：
     *
     * - AVI
     * - DOC / DOCX
     * - EPS
     * - XLS / XLSX / CSV
     * - EXE
     * - GIF
     * - MP3
     * - PDF
     * - PPT / PPTX
     * - PSD
     * - SQL
     * - TXT
     *
     * @constant
     * @module module:constant/zion
     * @type {Object}
     */
    ICON_FILE: __Zi.Env.V_IMAGE.ICON_FILE,
    /**
     * ## App图：数据库类型
     *
     *  ### 基本说明
     *
     *  针对不同数据库类型的专用图标，可直接解析成图片格式的默认系统图标，根据数据库类型分类：
     *
     *  - WORKFLOW：工作流引擎Camunda专用数据库
     *  - ATOM：动态建模数据库
     *  - HISTORY：删除备份专用的历史数据库
     *  - DATABASE：运行专用数据库
     *  - DISABLED：被禁用的数据库
     *
     *  @constant
     *  @memberOf module:constant/zion
     *  @type {Object}
     */
    ICON_DATABASE: __Zi.Env.V_IMAGE.ICON_DATABASE,
    /**
     * ## App图：自由图标
     *
     * ### 基本说明
     *
     * 包含了目前实施过的所有系统常用的完整图标集合，包括：
     *
     * - ISO27001
     * - CMDB
     * - ITSM
     * - HOTEL
     * - IOT
     * - BSM
     * - Norm Adjust
     * - OA
     *
     * @constant
     * @memberOf module:constant/zion
     * @type {Object}
     */
    ICON_BLOCK: __Zi.Env.V_IMAGE.ICON_BLOCK,
    /**
     * ## App图：系统级图标
     *
     * ### 基本说明
     *
     * 系统通用的图标相关信息
     *
     * @constant ICON_SYS
     * @memberOf module:constant/zion
     * @type {Object}
     */
    ICON_SYS: __Zi.Env.V_IMAGE.ICON_SYS,
    /**
     * ## App图：标签系统
     *
     * ### 基本说明
     *
     * 全小写图标，用于标签系统的基础逻辑，核心标签用于区分环境相关内容：
     *
     * - design：设计环境
     * - test：测试中心
     * - research：研发中心
     * - requirement：需求中心
     *
     * @constant TAG
     * @memberOf module:constant/zion
     * @type {Object}
     */
    TAG: __Zi.Env.V_IMAGE.TAG,
}

const ECONOMY = {
    /**
     * ## App：菜单类型
     *
     * ### 基本分类介绍
     *
     * 常用 Web 菜单的类型设置，该类型对应`X_MENU`表中的type字段，菜单类型主要包含下边几种：
     *
     * |代码调用|值|说明|
     * |---:|:---|:---|
     * |`Ux.Env.MENU_TYPE.BAG`|BAG-MENU|App应用入口菜单，位于左上角|
     * |`Ux.Env.MENU_TYPE.SIDE`|SIDE-MENU|系统主菜单（左侧边菜单）|
     * |`Ux.Env.MENU_TYPE.NAV`|NAV-MENU|面包屑菜单（顶部导航菜单）|
     * |`Ux.Env.MENU_TYPE.REPO`|REPO-MENU|Dashboard 首页专用菜单|
     * |`Ux.Env.MENU_TYPE.SC`|SC-MENU|Dashboard 中的服务目录菜单|
     * |`Ux.Env.MENU_TYPE.TOP`|TOP-MENU|顶部右上角菜单|
     * |`Ux.Env.MENU_TYPE.EXTRA`|EXTRA-MENU|顶部辅助菜单|
     * |`Ux.Env.MENU_TYPE.DEV`|DEV-MENU|开发中心：开发菜单|
     * |`Ux.Env.MENU_TYPE.SYS`|SYS-MENU|开发中心：配置菜单|
     *
     * > 菜单规划可以直接参考白皮书中的内容。
     *
     * @memberOf module:constant/zion
     * @constant
     * @type {Object}
     *
     */
    MENU_TYPE: __Zi.Env.MENU_TYPE,

    /**
     * ## App：菜单集合
     *
     * ### 基本说明
     *
     * 该菜单集合用于配置菜单的渲染顺序，该配置会影响到菜单的渲染顺序，该配置主要包含下边几种：
     *
     * |代码调用|说明|
     * |---:|:---|
     * |`Ux.Env.MENUS.TOP`|顶部菜单，包括两种：EXTRA / TOP|
     * |`Ux.Env.MENUS.MODULE`|主菜单，包括两种：BAG / SIDE|
     * |`Ux.Env.MENUS.DASH`|Dashboard首页菜单，包括：NAV / REPO / SC|
     * |`Ux.Env.MENUS.DEVELOPMENT`|开发中心菜单，包括：DEV / SYS|
     *
     * @memberOf module:constant/zion
     * @constant MENUS
     * @type {Object}
     */
    MENUS: __Zi.Env.MENUS,

    /**
     * ## App：值列表
     *
     * ### 基本说明
     *
     * 用于存储值的专用变量，现阶段变量只包含如下：
     *
     * - `EXPAND`：直接使用 `Ux.Env.VALUE.CV_EXPAND`调用，表示菜单是可展开菜单。
     *
     * @constant VALUE
     * @memberOf module:constant/zion
     */
    VALUE: __Zi.Env.VALUE,

    /**
     * ## App：扩展组件
     *
     * ### 基本说明
     *
     * 常用 Web 组件的 className属性，该属性应用会牵涉到业务应用，主要针对特定场景下的组件设置。
     *
     * - `CARD_CONTAINER`：PageCard / HelpCard 卡片默认使用类名：`ux_card`。
     * - `TAB_CONTAINER`: ExListComplex / ExTab 专用的页签默认类名：`ux_tab`。
     * - `ROW_HEAD`：放在头部用于定义列表页间距专用的工具栏默认类名：`ux_toolbar`。
     * - `TABLE_CONTROL`：表格专用类名：`ux_table`。
     *
     * @memberOf module:constant/zion
     * @constant ECONOMY
     * @type {Object}
     */
    ECONOMY: __Zi.Env.ECONOMY,

    /**
     * ## 树选择模式
     *
     * ### 基本介绍
     *
     * 专用树筛选模式，用于执行树中节点的筛选模式，在树结构中经常使用，如`X_CATEGORY`构造菜单等。
     *
     * |模式值|说明|
     * |---:|:---|
     * |`PARENT_ALL_INCLUDE`|选择当前节点和所有父节点集合（包含祖辈）。|
     * |`PARENT_ALL`|除开当前节点，选择所有父节点集合（包含祖辈）。|
     * |`PARENT`|选择直接父节点（不包含祖辈）。|
     * |`CURRENT`|「默认」只选择当前节点。|
     * |`CHILDREN`|直接子节点（不包含孙辈）。|
     * |`CHILDREN_ALL`|选择所有子节点（包含孙辈以及以下）。|
     * |`CHILDREN_ALL_INCLUDE`|选择当前节点和所有子节点（包含孙辈）。|
     *
     * @memberOf module:constant/zion
     * @constant
     * @type {Object}
     */
    SELECTION: __Zn.Env.SELECTION,

    /**
     * ## 响应式编程数据源
     *
     * 响应式编程的数据来源模式设置，遗留系统由于redux和react交叉，所以会出现来源混淆的情况。
     *
     * * `REACTIVE`：响应式Rxjs，直接使用Rx模式的数据来源。
     * * `REACT`：只使用 React，通常是state和props相结合。
     * * `REDUX`：配合 Redux 使用的数据来源。
     *
     * @memberOf module:constant/zion
     * @constant RX_SOURCE
     * @type {Object}
     */
    RX_SOURCE: __Zn.Env.RX_SOURCE,

    /**
     * ## 表单模式
     *
     * ### 基本说明
     *
     * 在常见模块中，Zero UI主要支持三种核心表单模式：
     *
     * 1. ADD：新增记录的表单模式
     * 2. EDIT：编辑记录的表单模式
     * 3. SEARCH：查询记录的表单模式（查询表单）
     *
     * 开发中心开设了第四种表单模式 `DESIGN`，此种模式主要用于工具定制和表单设计，目前仅支持在开发中心中使用，表单模式中会影响核心变量`$inited`，该值为表单初始值，如果是添加模式，不论是否传入，该值都为空，而在编辑模式中，`$inited`几乎是一定有值的，除开此变量，还包含另外一个核心变量`$record`，它用于记录父表单，以及某个表格字段中的行值，这个会在特殊组件中专程说明。
     *
     * ### 示例
     *
     * ```js
     *         if (ref) {
     *             const {$mode = Ux.Env.FORM_MODE.ADD, $inited = {}} = ref.props;
     *             if (Ux.Env.FORM_MODE.ADD === $mode || !$inited.key) {
     *                 key = Ux.randomUUID();
     *             } else {
     *                 key = $inited.key;
     *             }
     *         }
     * ```
     *
     * > 表单模式使用场景众多，此处不一一枚举。
     *
     * @constant FORM_MODE
     * @memberOf module:constant/zion
     * @type {Object}
     */
    FORM_MODE: __Zn.Env.FORM_MODE,

    /**
     * ## 格式类型
     *
     * ### 基本说明
     *
     * 建模过程专用的数据格式信息，此数据格式主要在自定义组件中使用，用于从字面量反向工程描述数据格式，包括如下值：
     *
     * |变量|值|说明|
     * |---|---|---|
     * |`XT_FORMAT.OBJECT`|`OBJECT`|对象格式，用于描述对象类型，`{}` |
     * |`XT_FORMAT.ARRAY`|`ARRAY`|数组格式，用于描述数组类型，`[]` |
     * |`XT_FORMAT.ARRAY_MAP`|`ARRAY_MAP`|哈希表格式，`{ "key": {} }` |
     * |`XT_FORMAT.ARRAY_PURE`|`ARRAY_PURE`|纯数组格式，`[e,e,e]` |
     * |`XT_FORMAT.ARRAY_GROUP`|`ARRAY_GROUP`|分组数组格式，`{ "group": []}` |
     *
     * ### 核心点
     *
     * 原生的JS只有 `[]` 和 `{}` 两种格式，后三种格式是为业务量身打造的格式，主要用于复杂交互组件，比如：
     *
     * 1. 树型列表
     * 2. 表格编辑器
     * 3. 矩阵编辑器
     *
     * @constant XT_FORMAT
     * @memberOf module:constant/zion
     * @type {Object}
     */
    XT_FORMAT: __Zn.Env.XT_FORMAT,

    /**
     * ## 数据类型
     *
     * ### 基本说明
     *
     * 建模专用的类型变量，全称为 `Entity Type`，简称为 `E Type`，包括如下值：
     *
     * |变量|值|说明|
     * |---|---|---|
     * |`E_TYPE.DATA_OBJECT`|`DataObject`|自定义类型中的 `DataObject`|
     * |`E_TYPE.DATA_ARRAY`|`DataArray`|自定义类型中的 `DataArray`|
     * |`E_TYPE.DATA_ASSIST`|`DataAssist`|自定义类型中的 `DataAssist`，辅助字典|
     * |`E_TYPE.DATA_TABULAR`|`DataTabular`|自定义类型中的 `DataTabular`，列表字典|
     * |`E_TYPE.NAVIGATOR`|`Navigator`|自定义类型中的 `Navigator`，路由对象|
     *
     * ### 核心点
     *
     * 前端自定义类型在 `TypeScript` 中定义，用于提供统一的API访问模型实例下的记录集，您可以直接使用此类型对基础类型执行封装，内部带有防御式编程的特性，可以有效的保证数据的安全性。
     *
     * ### 示例：`src/zone/fn.under.is.decision.js`
     *
     * ```js
     * const isTObject = (input) => {
     *     if (isTEntity(input)) {
     *         return __V_MODEL.E_TYPE.DATA_OBJECT === input.__type();
     *     } else return false;
     * }
     * ```
     *
     * @constant E_TYPE
     * @memberOf module:constant/zone
     * @type {Object}
     */
    E_TYPE: __Zn.Env.E_TYPE,

    /**
     * ## 查询字段类型
     *
     * ### 基本说明
     *
     * 此类型和 Qr 查询引擎息息相关，用于描述查询字段详细类型，列过滤源主要包含如下：
     *
     * 1. `INNER_SEARCH`，搜索源，最终匹配 `LIKE` 语法，构造字符包含字段信息，模糊匹配。
     * 2. `INNER_DIRECT`，直接源，选择数据时构造 `IN` 语法，精确项值。
     * 3. `OUTER`，外部源，外部源根据传入的操作符构造 `WHERE` 语法。
     *
     * ### 核心点
     *
     * 1. 非 `OUTER` 模式目前只支持三种数据类型
     *      - STRING：字符串
     *      - NUMBER：数值
     *      - BOOLEAN：布尔值
     * 2. 系统自动计算查询语法右值是否是一个 `[]` 格式。
     *
     * ### 示例：`src/zion/query.__fn.qr.processor.js`
     *
     * ```js
     * const __qrField = (field, filterType = {}) => {
     *     let normalized = {};
     *     if (filterType.hasOwnProperty(field)) {
     *         const config = filterType[field];
     *         const type = config.type;
     *         if (Cv.QR_COLUMN.SEARCH === type) {
     *             normalized.field = `${field},c`;
     *             normalized.type = Cv.QR_SOURCE.INNER_SEARCH;
     *             normalized.isArray = false;
     *         } else {
     *             normalized.field = `${field},i`;
     *             normalized.type = Cv.QR_SOURCE.INNER_DIRECT;
     *             normalized.isArray = true;
     *         }
     *         normalized.dataType = config.dataType;
     *     } else {
     *         // 条件不存在于列过滤中
     *         if (0 < field.indexOf(',')) {
     *             // 本身带有操作符
     *             normalized.field = field;
     *             const op = field.split(',')[1];
     *             normalized.isArray = ["i", "!i"].includes(op);
     *         } else {
     *             // 本身不带操作符，默认使用 Contains 条件
     *             normalized.field = `${field},c`;
     *             normalized.isArray = false;
     *         }
     *         normalized.type = Cv.QR_SOURCE.OUTER;  // 外层组件传入
     *     }
     *     return normalized;
     * };
     * ```
     *
     * @constant QR_SOURCE
     * @memberOf module:constant/zone
     * @type {Object}
     */
    QR_SOURCE: __Zn.Env.QR_SOURCE,

    /**
     * ## 列过滤类型
     *
     * ### 基本说明
     *
     * 用于描述列过滤组件类型，现阶段只支持两种：
     *
     * 1. `SEARCH`，搜索源，最终匹配 `LIKE` 语法，构造字符包含字段信息，模糊匹配。
     * 2. `DIRECT`，直接源，选择数据时构造 `IN` 语法，精确项值。
     *
     * 该组件位于 AntD 的 `<Table/>` 中，构造的是列过滤器。
     *
     * ### 示例：`src/zion/query.fn.qr.interact.element.js`
     *
     * ```js
     *         columns.forEach(column => {
     *             const field = column.dataIndex;
     *             const filter = column[Cv.K_NAME.FILTER];
     *             if (filter) {
     *                 $terms[field] = {};
     *                 $terms[field].type = filter.type ? filter.type : Cv.QR_COLUMN.DIRECT;
     *                 const {config = {}} = filter;
     *                 if (config.dataType) {
     *                     $terms[field].dataType = config.dataType;
     *                 } else {
     *                     // 默认的搜索模式
     *                     $terms[field].dataType = "STRING";
     *                 }
     *             }
     *         });
     * ```
     *
     * @constant QR_COLUMN
     * @memberOf module:constant/zone
     * @type {Object}
     */
    QR_COLUMN: __Zn.Env.QR_COLUMN,
};

const TYPE = {

    /**
     * ## 提交事件类型
     *
     * ### 基本说明
     *
     * Zero UI本身可支持事件层面的无限扩展，提交事件描述了您的按钮中如何配置事件，目前支持的事件类型有：
     *
     * | 事件类型 | 说明 |
     * | --- | --- |
     * | BACK | 返回专用事件 |
     * | RESET | 重置专用事件 |
     * | SUBMIT | 标准表单提交事件 |
     * | SUBMIT_DIALOG | 对话框（模态窗）提交事件 |
     * | SUBMIT_REDUX | 带 `redux` 数据流的提交事件 |
     * | KEY | 仅包含主键数据的提交事件，如：删除、按ID读取数据 |
     * | SAVE_ROW | 行保存提交事件，如表格编辑，或 `DialogEditor` 中的复杂行编辑 |
     *
     * Zero UI 中的提交事件会直接绑定到统一函数签名的函数中实现 **可配置**，一旦进入配置流程，此处的事件就可直接使用数据驱动的方式来完成事件的触发流程，事件触发机制包括：
     *
     * 1. （编程方式）直接使用编程方式触发事件，代码中直接操作。
     * 2. （配置方式）可使用静态配置和动态配置两种方式触发事件。
     * 3. （注入方式）直接从远程读取脚本内容实现事件触发（前端触发）。
     * 4. （脚本引擎）执行远程脚本引擎实现实现触发（后端触发）。
     *
     * @constant TYPE_EVENT
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_EVENT: __Zn.Env.TYPE_EVENT,

    /**
     * ## 延迟列类型
     *
     * ### 基本说明
     *
     * 延迟列类型主要用于列渲染中包含了异步渲染流程的自定义组件，该组件需要在渲染时进行异步加载，因此需要在渲染时进行特殊处理。它的值有2种：
     *
     * - `USER`：旧值
     * - `LAZY`：新值
     *
     * > 这两个值的内置逻辑是没有任何区别的，而 `LAZY` 的语义性更强，旧值是因为最早使用 Zero UI 中已经包含了配置相关定义，基于这个出发点，将其保留下来。
     *
     * @constant TYPE_LAZY_COLUMN
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_LAZY_COLUMN: __Zn.Env.TYPE_LAZY_COLUMN,

    /**
     * ## 验证组件修正类型
     *
     * ### 基本说明
     *
     * 验证组件修正类型是针对自定义组件触发验证的时间点进行修正，目前支持的修正类型有：
     *
     * | 修正类型 | 说明 |
     * | --- | --- |
     * | onChange | 在组件触发 `onChange` 事件时触发验证 |
     * | onBlur | 在组件失去焦点时触发 |
     *
     * ### 核心点
     *
     * 此属性是效果属性，主要用于提高交互的友好性，例如：在输入框中输入内容时，如果每输入一个字符就触发一次验证，那么会造成验证的频繁触发，因此，此时可以使用 `onBlur` 修正类型，当输入框失去焦点时触发验证，这样就可以避免频繁触发验证。
     *
     * Zero UI 中默认使用了 onBlur 的方式触发验证，而对于部分复杂组件无法捕捉焦点信息，这种场景下，可以使用 `onChange` 修正类型，此时，验证会在组件触发 `onChange` 事件时触发，此变量定义了哪些自定义组件要开启 `onChange` 修正类型。
     *
     * @constant TYPE_JSX_VALIDATE
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_JSX_VALIDATE: __Zn.Env.TYPE_JSX_VALIDATE,

    /**
     * ## 渲染器继承类型
     *
     * ### 基本说明
     *
     * 在某些特殊的场景下，交互式组件本身是 **容器类型**，在这种方式中，容器必须将 `$renders` 编程模式中的字段渲染器、列渲染器传递到容器类的组件里，这种场景下就需要执行额外的继承逻辑。
     *
     * 子组件中的渲染器主要来源于两个方面：
     *
     * 1. `$renders` 编程模式中的渲染器，直接继承。
     * 2. 配置在Json静态文件中的渲染器（内置调用标准渲染器）。
     *
     * ### 示例：`src/zodiac/antd4.__.@fn.v4.input.jsx.js`
     *
     * ```js
     * const cssRender = () => __Zn.Env.TYPE_JSX_RENDERS;
     *
     * const __v4Renders = (optionJsx = {}, renders = {}, cell = {}) => {
     *     const webComponents = cssRender();
     *     // 追加一个条件，只针对 DialogEditor 之下以下流程
     *     if (webComponents.includes(cell.render)) {
     *         if (renders.hasOwnProperty(cell.field)) {
     *             // renders 注入到 optionJsx 中，底层组件会自动读取
     *             const $renders = renders[cell.field];
     *             if (__Zn.isNotEmpty($renders)) {
     *                 optionJsx.$renders = $renders;
     *             }
     *         }
     *     }
     * }
     * ```
     *
     * @constant TYPE_JSX_RENDERS
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_JSX_RENDERS: __Zn.Env.TYPE_JSX_RENDERS,

    /**
     * ## 错误提示类型
     *
     * ### 基本说明
     *
     * Zero UI中，错误消息提示使用了浮游框的方式，但是浮游框提示为了防止交互过程中呈现太多冒泡错误信息界面，组件中只有焦点 onFocus 事件触发时才针对单个组件显示错误信息，而这种方式对 DialogEditor 这种没有焦点的组件将无法显示错误信息，因此，需要使用此变量定义哪些组件需要在失去焦点时显示错误信息。
     *
     * ### 示例：`src/zest@web/form.equip.__.fn.raft.robin.js`
     *
     * ```js
     *     if (cell.__render) {
     *         const errorNotify = __CSS.cssNotify();
     *         if (errorNotify.includes(cell.__render)) {
     *             metadata.error_notify.push(cell.field);
     *         }
     *     }
     * ```
     *
     * ```js
     *      // form.__.fn.css.uca.polymorphism.js
     *      const cssNotify = () => __Zn.Env.TYPE_JSX_NOTIFY;
     * ```
     *
     * @constant TYPE_JSX_NOTIFY
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_JSX_NOTIFY: __Zn.Env.TYPE_JSX_NOTIFY,

    /**
     * ## Event类型
     *
     * ### 基本说明
     *
     * Event类型是为界面组件量身打造的类型，它可以和 HTML 的原生事件类型执行绑定，防止开发人员在书写时出现拼写错误而量身打造，现阶段支持的类型如下：
     *
     * | 类型 | 说明 |
     * | :--- | :--- |
     * | `onChange` | 用于表单组件，当表单组件值发生变化时触发 |
     * | `onSelect` | 用于下拉组件，当下拉组件值发生变化时触发 |
     * | `onChecked` | 用于复选框组件，当复选框组件值发生变化时触发 |
     *
     * ### 示例：`src/zodiac/antd4.__.@fn.v4.input.event.js`
     *
     * ```js
     *     const {
     *         reference,
     *         cell,
     *         event = __Zn.Env.TYPE_ON.ON_CHANGE,
     *     } = configuration;
     * ```
     *
     * @constant TYPE_ON
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_ON: __Zn.Env.TYPE_ON,

    /**
     * ## 控件类型
     *
     * ### 基本说明
     *
     * Zero UI 和后端扩展模块的 `zero-ui` 配合时，可实现纯数据驱动类型的组件，这些组件本身会遵循两层结构：
     *
     * 1. Container：容器层，用于承载组件。
     * 2. Control：组件层，渲染核心组件，即此处的 `FORM / LIST` 类型。
     *
     * 此两种组件类型在后端对应不同的表结构，并且在配置数据解析流程中会搭载不同的解析器来执行配置标准化。
     *
     * ### 示例: `src/utter/habit.fn.parser.action.js`
     *
     * ```js
     *     const {type} = options;
     *     if (Ux.Env.TYPE_CONTROL.LIST === type) {
     *         const {ops = []} = options;
     *         if (config.options) {
     *             ops.forEach(op => {
     *                 const item = {};
     *                 item.key = op['clientKey'];
     *                 config.options[item.key] = op['text'];
     *             });
     *         }
     *     } else if (Ux.Env.TYPE_CONTROL.FORM === type) {
     *         const {ops = []} = options;
     *         if (config.form) {
     *             const op = {};
     *             const event = {};
     *             ops.forEach(each => {
     *                 // 先嫁接 op
     *                 op[each['clientKey']] = each['action'];
     *                 event[each['clientKey']] = {
     *                     event: each.event,
     *                     config: each.config ? each.config : {}
     *                 };  // 处理 event
     *             });
     *             config.form.op = op;
     *             // event 专用信息
     *             if (!Ux.isEmpty(event)) {
     *                 config.event = event;
     *             }
     *         }
     *     }
     *     return config;
     * ```
     *
     * @constant TYPE_CONTROL
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_CONTROL: __Zn.Env.TYPE_CONTROL,

    /**
     * ## 上传组件类型
     *
     * ### 基本说明
     *
     * 上传组件类型直接对应到 Ant Design 中的 Upload 组件，它包含两种类型：
     *
     * 1. `picture-card`：图片上传模式和卡片模式。
     * 2. `text`：文本上传模式。
     *
     * > （略）
     *
     * @constant TYPE_UPLOAD
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_UPLOAD: __Zn.Env.TYPE_UPLOAD,

    /**
     * ## 操作类型
     *
     * ### 基本说明
     *
     * 操作类型同为 Zero 扩展模块中数据驱动的核心，它包含了三种：
     *
     * 1. OP：静态执行专用，通常：前端 -> 后端调用，identifier
     * 2. ATOM：动态执行，一般访问 UI_OP，control
     * 3. FLOW：工作流专用
     *
     * 不同的操作类型构造的请求数据格式不同，但最终提取的标准化操作格式是一致的，它的标准化请求如下：
     *
     * ```json
     * // type = OP
     * {
     *     "identifier": "xxx，模型统一标识符，用于读取 Master 模型操作"
     * }
     * // type = ATOM
     * {
     *     "control": "xxx，对应后端组件 UI_CONTROL 的主键ID"
     * }
     * // type = FLOW
     * {
     *     "workflow": "工作流在Camunda中的 definitionKey",
     *     "node": "工作流节点名称，event / task"
     * }
     * ```
     *
     * ### 示例：`src/utter/channel.cm.fn.yi.container.atom.js`
     *
     * ```js
     *     const ajaxOp = I.ops({control, type: Ux.Env.TYPE_OP.ATOM});
     * ```
     *
     * @constant TYPE_OP
     * @memberOf module:constant/zone
     * @type {Object}
     */
    TYPE_OP: __Zn.Env.TYPE_OP,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     *
     * ## (ENV) 标准环境变量
     *
     * 标准环境变量教程可参考：[5.1.3.环境变量](https://www.vertx-cloud.cn/document/doc-web/index.html#_%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F_2)
     *
     * ### 环境变量文件
     *
     * 环境变量文件位于根目录之下，从 `.env.development.tpl` 文件拷贝而来，若您下载的是最新的脚手架，内部会包含环境变量模板文件，直接拷贝即可。
     *
     * 1. `.env.development`：开发环境环境变量文件。
     * 2. `.env.production`：生产环境环境变量文件。
     *
     * ### 核心点
     *
     * - 所有自定义的环境变量在文件中都带有 `Z_` 前缀。
     * - 使用 `Ux.Env` 引用环境变量时，不需要 `Z_` 前缀，直接去掉 `Z_` 即可引用。
     * - 有两个核心变量是关乎前后端的
     *      - `Z_ROUTE`：前端路由内容路径前缀，不同应用其前缀有所区别，通常绑定 **应用** 或 **租户**。
     *      - `Z_ENDPOINT`：后端服务端点前缀，访问不同接口时会有所区别。
     * - 所有样式相关的环境变量都带有 `Z_CSS` 前缀。
     * - 登录会话（当前账号）类的变量都带有 `Z_K` 前缀，且扩展出来后都会带上当前账号ID做合并计算。
     *
     *
     * @constant (?ENV)
     * @memberOf module:constant/zone
     */
    ...__Zn.Env,
    // 覆盖默认
    ...IMAGE,
    ...ECONOMY,
    ...TYPE,

    /**
     *
     * ## 运行环境 `NODE_ENV`
     *
     * * 来源：`process.env.NODE_ENV`
     *
     * 运行时环境会对应到 `node` 中的标准环境变量 `process.env.NODE_ENV`，该变量的值为 `development` 或 `production`，编程过程中您可以直接使用 `Ux.Env.RUNTIME`来获取系统当前配置的运行环境变量读取该值。
     *
     * ### 示例: `/src/zone/v.environment.js`
     *
     * ```js
     *     let result = RUNTIME.DEVELOPMENT === process.env.NODE_ENV;
     *     keys.forEach(key => result = result && process.env[key] && "true" === process.env[key]);
     *     return Boolean(result);
     *     // -------------- 标准使用 ------------
     *     // 上述代码是内部使用，若外部使用则应该如下：
     *     // import Ux from 'ux';
     *     // const runtime = Ux.Env.RUNTIME.DEVELOPMENT;
     *     // 上边代码 runtime 的值是 "development";
     * ```
     *
     *
     * @constant RUNTIME
     * @memberOf module:constant/zone
     * @type {Object}
     */
    RUNTIME: __Zn.Env.RUNTIME,

    /**
     * ## 语言环境 `Z_LANGUAGE`
     *
     * * 来源：`process.env.Z_LANGUAGE`
     *
     * 自定义环境变量，您可以使用该环境变量读取前端程序配置的语言信息，语言变量的影响：
     *
     * 1. 语言变量会影响读取资源文件的目录：`cab/<language>/` 中读取前端静态资源文件。
     * 2. 语言变量会影响远程请求的 `X-Lang` 请求头，该请求头用于告诉服务端当前前端程序的语言环境。
     *
     * > 凡牵涉多语言环境的地方都可以直接提取语言环境变量做语言相关判断。
     *
     *
     * @constant LANGUAGE
     * @memberOf module:constant/zone
     * @type {String}
     */
    LANGUAGE: __Zn.Env.LANGUAGE,

    /**
     * ## 全局调试参数（开发）`Z_DEBUG_DEV`
     *
     * * 来源：`process.env.Z_DEV_DEBUG / process.env.NODE_ENV`
     *
     * 启用 Zero UI 框架中的调试参数以及 NodeJS 原生环境来控制调试信息，调试信息只有在如下条件满足时可触发：
     *
     * 1. NodeJS原生环境：`NODE_ENV=development` 开发环境才触发。
     * 2. ZeroUI环境：`Z_DEV_DEBUG=true` 打开调试模式才可。
     *
     * @constant DEBUG_DEV
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    DEBUG_DEV: __Zn.Env.DEBUG_DEV,

    /**
     * ## 全局调试参数（跨环境）`Z_DEV_DEBUG`
     *
     * * 来源：`process.env.Z_DEV_DEBUG`
     *
     * 启用 Zero UI 专用调试参数，此参数主要用来屏蔽 `console.log / console.info ` 等日志信息，这些日志信息在开发环境可生效，但在生产环境尽可能少地打印相关信息实现日志的清晰化。
     *
     * ### 示例
     *
     * ```js
     * // 直接调用 Ux 执行判断
     *
     * // 「内部」
     * import Cv from './constant';
     * if(Cv.DEBUG){
     *     // 内部，研发模式代码
     * }
     *
     * // 「外部」
     * import Ux from 'ux';
     * if(Ux.Env.DEBUG){
     *     // 外部，开发模式代码
     * }
     * ```
     *
     * @constant DEBUG
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    DEBUG: __Zn.Env.DEBUG,

    /**
     * ## 表单渲染器调试参数 `Z_DEV_FORM`
     *
     * * 来源：`process.env.Z_DEV_FORM`
     *
     * 新版表单日志是中文，表单渲染器主要包含如下日志信息：
     *
     * 1. 表单基本布局信息。
     * 2. 表单行额外配置信息。
     * 3. 表单单元格中的 `optionItem` 和 `optionJsx` 相关信息。
     * 4. 表单初始化数据信息。
     * 5. 提交和加载流程中的表单数据信息。
     *
     * @constant DEBUG_FORM
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    DEBUG_FORM: __Zn.Env.DEBUG_FORM,

    /**
     * ## Ajax调试参数 `Z_DEV_AJAX`
     *
     * * 来源：`process.env.Z_DEV_AJAX`
     * * 依赖：`process.env.Z_DEV_MOCK`
     *
     * 启用Ajax请求的专用监控流，启用之后，您可以在浏览器的 console 中直接看到所有Ajax的请求信息：
     *
     * 1. 请求详细信息，包括请求头、请求体。
     * 2. 响应详细信息，包括响应头、响应体。
     * 3. 数字签名相关信息。
     * 4. 应用相关自定义头相关信息。
     * 5. Qr 查询引擎请求信息。
     *
     * @constant DEBUG_AJAX
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    DEBUG_AJAX: __Zn.Env.DEBUG_AJAX,

    /**
     * ## Qr调试参数 `Z_DEV_QR`
     *
     * * 来源：`process.env.Z_DEV_QR`
     *
     * 针对Qr引擎的专用调试参数，启用之后，您可以在浏览器的 console 中直接看到所有Qr引擎的请求信息，该参数目前主要面相 `ExListComplex` 组件，您可以在此组件中监控核心变量相关信息。
     *
     * @constant DEBUG_QR
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    DEBUG_QR: __Zn.Env.DEBUG_QR,

    /**
     * ## 自定义请求头 `Z_X_HEADER_SUPPORT`
     *
     * * 来源：`process.env.Z_X_HEADER_SUPPORT`
     *
     * ### 基本介绍
     *
     * 是否开启自定义请求头的功能，开启之后以下几个请求头会被自动添加到所有请求中：
     *
     * 1. `X-Lang`：Zero UI的语言信息，追加 `Z_LANGUAGE` 中的语言信息到请求头中。
     * 2. `X-App-Id / X-App-Key`：应用的ID和Key，非敏感数据环境和敏感数据环境的应用基础信息。
     * 3. `X-Sigma`：统一标识符的变体，用作容器标识。
     * 4. `X-Tenant-Id`：租户标识请求头，用于标识当前容器环境中运行的租户。
     *
     * Zero UI本身是支持 **多租户、多语言、多应用** 环境的，而请求本身是直接从自定义请求头开始就直接支持这些功能，因此您可以在此处开启自定义请求头的功能，从而实现多租户、多语言、多应用的功能。
     *
     * ### 常用自定义头
     *
     * X 系列的头部专用信息，用于处理 X 系列的核心头部信息，参考下表
     *
     * |变量值|Http请求头|说明|
     * |---:|:---|:---|
     * |`X_APP_KEY`|X-App-Key|多应用环境处理敏感信息的应用键专用。|
     * |`X_APP_ID`|X-App-Id|多应用环境处理普通信息的应用键值专用（带业务）。|
     * |`X_SIGMA`|X-Sigma|平台应用标识符，也称为统一标识符，在多应用环境中用于标识应用（不带业务）。|
     * |`X_LANG`|X-Lang|多语言平台的语言值（头文件识别）。|
     * |`X_TENANT_ID`|X-Tenant-Id|租户标识符，用于标识当前租户。|
     *
     * @constant X_HEADER_SUPPORT
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    X_HEADER_SUPPORT: __Zn.Env.X_HEADER_SUPPORT,

    /**
     * ## Meta：应用配置
     *
     * ### 常量说明
     *
     * ```js
     * import Ux from 'ux';
     * const storeKey = Ux.Env.KEY_APP;
     * ```
     *
     * 多应用环境的当前应用的主键信息，对应后端 `X_APP` 表中的主键数据，该键值中的数据存储在 LocalStorage 中，当用户第一次打开登录页面，会访问应用程序接口提取应用程序相关配置，配置会走两部分：
     *
     * 1. 公有应用配置数据：`/app/name/:name` 访问（返回中不带有 `appKey`，只有 `appId`）
     * 2. 私有应用配置数据：`/api/app/:key` 访问（返回中带有 `appKey`）
     *
     * > 存储了应用的全配置
     *
     * @memberOf module:constant/zone
     * @constant KEY_APP
     * @type {String}
     *
     */
    KEY_APP: __Zn.Env.KEY_APP,

    /**
     * ## Meta：登录用户配置
     *
     * ### 基本说明
     *
     * SessionStorage 专用的存储键值，存储当前用户登录信息，当用户点击了登录按钮过后，返回的用户登录数据会存储
     * 在该键值中，里面存储的是用户数据的对象，其中最核心的字段如：
     *
     * |字段名|类型|说明|
     * |:---|:---|:---|
     * |key|String|用户主键（标准）|
     * |uniqueId|String|用户全局唯一键（遗留系统专用）|
     * |userId|String|Spring桥接专用，大部分系统都使用了userId作主键|
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    KEY_USER: __Zn.Env.KEY_USER,

    /**
     * ## Meta：运行语言
     *
     * ### 基本说明
     *
     * 多语言模式下的定义的从 LocalStorage 中提取语言信息的专用键。
     *
     * ```js
     * import Ux from 'ux';
     * const storeKey = Ux.Env.X_LANG;
     * ```
     *
     * ### 2. 提取流程
     *
     * 1. 直接调用 `Ux.Env.X_LANG` 读取语言存储的键 key。
     * 2. 根据 `key` 到 LocalStorage 中去读取当前应用的语言信息。
     *
     * > `X_LANG` 是元数据，并非存储的数据。
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    X_LANG: __Zn.Env.X_LANG,

    /**
     * ## Meta：应用ID
     *
     * ### 基本说明
     *
     * ```js
     * import Ux from 'ux';
     * const storeKey = Ux.Env.X_APP_ID;
     * ```
     *
     * LocalStorage中用于存储应用ID的键名，该键名存储的是应用的主键信息，对应后端 `X_APP` 表中的主键数据。
     *
     * @memberOf module:constant/zone
     * @constant X_APP_ID
     * @type {String}
     */
    X_APP_ID: __Zn.Env.X_APP_ID,

    /**
     * ## Meta：应用加密ID
     *
     * ```js
     * import Ux from 'ux';
     * const storeKey = Ux.Env.X_APP_KEY;
     * ```
     *
     * LocalStorage 中应用加密ID的键名，该键名中存储的是应用加密主键信息（64位随机字符串），对应后端 `X_APP` 表中的 `APP_KEY` 字段中存储的值，可使用 `storeKey` 去提取该值。
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    X_APP_KEY: __Zn.Env.X_APP_KEY,

    /**
     * ## Meta：统一标识键名
     *
     * ```js
     * import Ux from 'ux';
     * const storeKey = Ux.Env.X_SIGMA;
     * ```
     *
     * LocalStorage 中用于提取统一标识符的键名，该键名中存储的是统一标识符，对应后端 `X_APP` 表中的 `SIGMA` 字段中存储的值，可使用 `storeKey` 去提取该值，而且会转换成 `X-Sigma` 的请求头等信息。
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    X_SIGMA: __Zn.Env.X_SIGMA,

    /**
     *  ## Meta：登录会话键名
     *
     *  ### 基本说明
     *
     *  用于存储当前登录账号使用的会话ID专用的键名，和后端的会话执行绑定：
     *
     *  - 基础会话ID，对应到 `vertx.web.session` 中的服务端会话ID。
     *  - 登录专用 habitus，Zero Extension 框架中的登录专用会话ID。
     *
     *  @constant X_SESSION
     *  @memberOf module:constant/zone
     *  @type {String}
     */
    X_SESSION: __Zn.Env.X_SESSION,

    /**
     * ## Meta：标准请求头名
     *
     * ### 基本说明
     *
     * 该变量同样会包含类似 `X_` 的一系列名称，但它对应的值是标准的请求头名称，整体的映射表如下：
     *
     * |变量名|请求头|存储键|存储位置|存储内容|
     * |:---|:---|:---|:---|:---|
     * |`Ux.Env.X_HEADER.X_APP_ID`|`X-App-Id`|`Ux.Env.X_APP_ID`| LocalStorage |应用主键|
     * |`Ux.Env.X_HEADER.X_APP_KEY`|`X-App-Key`|`Ux.Env.X_APP_KEY`| LocalStorage |应用加密主键|
     * |`Ux.Env.X_HEADER.X_SIGMA`|`X-Sigma`|`Ux.Env.X_SIGMA`| LocalStorage |统一标识符|
     * |`Ux.Env.X_HEADER.X_LANG`|`X-Lang`|`Ux.Env.X_LANG`| LocalStorage |语言信息|
     * |x|x| `Ux.Env.KEY_APP` | LocalStorage | 完整应用配置数据|
     * |`Ux.Env.X_HEADER.X_SESSION`|`X-Session`|`Ux.Env.X_SESSION`| SessionStorage |会话信息|
     * |x|x| `Ux.Env.KEY_USER` | SessionStorage | 完整用户配置数据|
     * |x|x| `Ux.Env.KEY_EVENT` | SessionStorage | Redux 专用桥接的键名 |
     *
     * ### 2. 请求头说明
     *
     * - `X-App-Id`：应用主键，对应 `X_APP` 中的 `KEY` 值。
     * - `X-App-Key`：应用加密主键，对应 `X_APP` 中的 `APP_KEY` 值。
     * - `X-Sigma`：统一标识符，对应 `X_APP` 中的 `SIGMA` 值。
     * - `X-Lang`：语言信息，对应 `X_APP` 中的 `LANGUAGE` 值。
     * - `X-Tenant-Id`：租户信息，对应后端的云端租户结构。
     *
     * > 现阶段版本还没打开多租户模式，所以该请求头暂时不开放使用，此处主要是针对后期的扩展保留，做云原生应用时会用到，而此API牵涉的所有教程并非是 `X_HEADER` 变量，而是完整的 `X_` 和 `KEY_` 两种变量所需的内容。
     *
     * @constant X_HEADER
     * @memberOf module:constant/zone
     * @type {Object}
     */
    X_HEADER: __Zn.Env.X_HEADER,

    /**
     * ## Meta：Redux专用键名
     *
     * ### 基本说明
     *
     * SessionStorage 专用的存储键值，存储 Redux 的事件专用信息，所有执行了 redux 的事件前缀都以环境变量中配置的
     * `Z_K_EVENT`为前缀，不同的应用这个值应该不一致，主要用来实现多应用分流。当前前端中对 redux 的使用主要在整个
     * 状态树的顶层，而兄弟节点的通讯走 redux 而不是走状态。
     *
     * * 本组件内部使用props和state传递数据，包括数据继承。
     * * 跨组件之间传递数据则使用redux，目前最多应用于外层按钮和里层按钮的房重复提交同步操作。
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    KEY_EVENT: __Zn.Env.KEY_EVENT,

    /**
     * ## 登录页 `Z_ENTRY_LOGIN`
     *
     * * 来源：`process.env.Z_ENTRY_LOGIN`
     * * 依赖：`process.env.Z_ROUTE`
     *
     * Zero UI开发完成后的登录首页，您可自定义登录首页的路由地址，该地址不包含 `Z_ROUTE` 的路由部分，不仅此处，Zero UI 内部存储的所有路由信息都不包含 `Z_ROUTE` 的前端路由定义，前端路由定义是一个全局定义。例：
     *
     * ```shell
     * 定义了前端页面地址为：      /rbac/user
     * Z_ROUTE：                ht
     * 最终生成页面为：           /ht/rbac/user（react-router 可捕捉的地址）
     * ```
     *
     * 根据上述例子，最终的前端路由地址为：`/ht/rbac/user`，而不是 `/rbac/user`，即所有页面都是计算而得，如此所有的页面在不同的应用和租户环境中可直接重用。
     *
     * @constant ENTRY_LOGIN
     * @memberOf module:constant/zone
     * @type {String}
     */
    ENTRY_LOGIN: __Zn.Env.ENTRY_LOGIN,

    /**
     * ## 管理页 `Z_ENTRY_ADMIN`
     *
     * * 来源：`process.env.Z_ENTRY_ADMIN`
     * * 依赖：`process.env.Z_ROUTE`
     *
     * 前端管理界面的主界面，您可以重新定义主界面，语义为：登录之后第一次合法进入的管理首页。
     *
     * @constant ENTRY_ADMIN
     * @memberOf module:constant/zone
     * @type {String}
     */
    ENTRY_ADMIN: __Zn.Env.ENTRY_ADMIN,

    /**
     * ## 密码更改页 `Z_ENTRY_FIRST`
     *
     * * 来源：`process.env.Z_ENTRY_FIRST`
     * * 依赖：`process.env.Z_ROUTE`
     *
     * 首次登录之后，需要更改密码的页面，您可以重新定义该页面，在Zero UI中，如果您的初始密码和服务端配置的初始密码一致，系统会强制要求您首次登录之后引导到此页面完成密码修改，停留在密码修改页时，您无法进行任何操作，直到密码修改完成后重新登录。
     *
     * @constant ENTRY_FIRST
     * @memberOf module:constant/zone
     * @type {String}
     */
    ENTRY_FIRST: __Zn.Env.ENTRY_FIRST,

    /**
     * ## HTTP方法常量
     *
     * ### 基本说明
     *
     * HTTP方法常量，目前支持：`GET, POST, PUT, DELETE`四种，值是全小写，在程序执行过程中会去执行大写转换，现阶段针对HTTP方法的实现只包含业务场景最常见的四种，而不考虑其他的HTTP方法。
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {Object}
     */
    HTTP_METHOD: __Zn.Env.HTTP_METHOD,

    /**
     * ## MIME常量
     *
     * ### 基本说明
     *
     * 系统常用的MIME值，用于设置`Accept/Content-Type`等基础媒体类型值。目前系统中的值如下：
     *
     * |代码调用|值|说明|
     * |:---|:---|:---|
     * |`Ux.Env.MIMES.JSON`|application/json|JSON媒体类型|
     * |`Ux.Env.MIMES.MULTIPART`|multipart/form-data|（略）|
     * |`Ux.Env.MIMES.FORM`|application/x-www-form-urlencoded|（略）|
     * |`Ux.Env.MIMES.STREAM`|application/octet-stream|二进制文件类型，上传下载用|
     *
     * 您可以定义各种不同的支撑系统运行的
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {Object}
     */
    MIMES: __Zn.Env.MIMES,

    /**
     * ## HTTP11常量
     *
     * ### 基本说明
     *
     * HTTP11 中的请求头所有标准协议常量，该常量的命名规则如下：
     *
     * * 将原始请求头全部大写。
     * * 所有的`-`转换成`_`生成对应的键值的。
     *
     * 使用的参考代码如下：
     *
     * ```js
     * // 下载专用头设置，客户端只接受 octet-stream 格式
     * headers.append(Cv.HTTP11.ACCEPT, "application/octet-stream");
     * headers.append(Cv.HTTP11.CONTENT_TYPE, "application/octet-stream");
     * ```
     *
     * ### 值列表
     *
     * 目前版本支持的值列表（所有定义）：
     *
     * ```json
     {
        "ACCEPT": "Accept",
        "ACCEPT_CHARSET": "Accept-Charset",
        "ACCEPT_ENCODING": "Accept-Encoding",
        "ACCEPT_LANGUAGE": "Accept-Language",
        "ACCEPT_RANGES": "Accept-Ranges",
        "AGE": "Age",
        "ALLOW": "Allow",
        "AUTHORIZATION": "Authorization",
        "CACHE_CONTROL": "Cache-Control",
        "CONNECTION": "Connection",
        "CONTENT_BASE": "Content-Base",
        "CONTENT_ENCODING": "Content-Encoding",
        "CONTENT_LENGTH": "Content-Length",
        "CONTENT_LOCATION": "Content-Location",
        "CONTENT_MD5": "Content-MD5",
        "CONTENT_RANGE": "Content-Range",
        "CONTENT_TYPE": "Content-Type",
        "DATE": "Date",
        "ETAG": "ETag",
        "EXPIRES": "Expires",
        "FORM": "Form",
        "HOST": "Host",
        "IF_MODIFIED_SINCE": "If-Modified-Since",
        "IF_MATCH": "If-Match",
        "IF_NONE_MATCH": "If-None-Match",
        "IF_RANGE": "If-Range",
        "IF_UNMODIFIED_SINCE": "If-Unmodified-Since",
        "LAST_MODIFIED": "Last-Modified",
        "LOCATION": "Location",
        "MAX_FORWARDS": "Max-Forwards",
        "PRAGMA": "Pragma",
        "PROXY_AUTHENTICATE": "Proxy-Authenticate",
        "PROXY_AUTHORIZATION": "Proxy-Authorization",
        "PUBLIC": "Public",
        "RANGE": "Range",
        "REFENER": "Refener",
        "RETRY_AFTER": "Retry-After",
        "SERVER": "Server",
        "TRANSFER_ENCODING": "Transfer-Encoding",
        "UPGRADE": "Upgrade",
        "USER_AGENT": "User-Agent",
        "VARY": "Vary",
        "WARNING": "Warning",
        "WWW_AUTHENTICATE": "WWW-Authenticate",
        "XSRF_TOKEN": "X-XSRF-TOKEN"
    }
     * ```
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {Object}
     */
    HTTP11: __Zn.Env.HTTP11,

    /**
     * ## Value：权限限制值（旧）
     *
     * 新版推荐使用 `Ux.Env.CV_FORBIDDEN` 常量。
     *
     * @constant FORBIDDEN
     * @memberOf module:constant/zone
     * @type {String}
     * @deprecated
     */
    FORBIDDEN: __Zn.Env.FORBIDDEN,

    /**
     * ## Value：权限限制值
     *
     * ### 基本说明
     *
     * 在ACL的权限控制中，表单数据分为三态：
     *
     * * 可编辑
     * * 只读
     * * 有数据不可查看：如果有数据不可查看，则会显示成 FORBIDDEN 设置的值。
     *
     * 这个变量只会在ACL权限控制中使用，其他地方不可使用，该变量会隐藏真实数据而导致数据本身不可查看。
     *
     * > 通常意义上，显示成********的数据是不可编辑的，因为编辑会带来副作用，所以表单从原始的四态变成了三态。
     *
     * 表单的状态表格如下：
     *
     * |维度|有权限|无权限|
     * |---:|---|---|
     * |可编辑|编辑数据|x（不支持）|
     * |只读|显示数据|********|
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {String}
     */
    CV_FORBIDDEN: __Zn.Env.FORBIDDEN,

    /**
     * ## 模拟环境（测试） `Z_DEV_MOCK`
     *
     * * 来源：`process.env.Z_DEV_MOCK`
     *
     * ### 基本说明
     *
     * 启用 Zero UI 中的模拟环境，该环境一旦启用，可执行纯前端开发模式，和远程相关的请求可直接使用 `JS/Json` 两种不同方式执行模拟。
     *
     * 1. 模拟环境的数据目录通常为 `app@mock` 目录。
     * 2. 全局模拟参数依赖于 `Z_DEV_MOCK` 环境变量，单接口模拟参数依赖数据结构中的 `mock` 属性。
     * 3. 模拟环境开启后可直接隔离后端实现前端独立开发，所有 `ajax` 前缀的请求都会直接被引导到模拟数据中。
     * 4. 除此之外，您还可以在模拟环境中使用 IndexedDB 来模拟数据库，这样可以实现前端的独立开发。
     *
     * ### Mock规则
     *
     * mock环境存储在`src/mock`目录中，并且包含模拟环境的生成规则，构造 mockKey 的规则如下：
     *
     * 1. 基本键值对应：`HTTP方法 + 下划线 + URI路径（ / 转换成 _ ）`。
     * 2. URI路径除了基本规则以外，`:id`和`:key`可直接被还原，如`/api/user/:key`的真实访问路径为`/api/user/xxxxxxxxxx`，则可被还原成`_api_user_:key`作为mockKey来使用。
     *
     * ### Mock入口文件
     *
     * mock入口文件如下：
     *
     * ```js
     * export default {
     *      // -------------------------------------------------- 全局
     *      post_Login_user_login: 登录主接口,
     *      post_api_user_logout: 注销主接口,
     *      "post_Login_user_get-app-list": 读取主页菜单,
     *      "post_Login_user_get-menu-list": 读取所有菜单,
     *      get_api_tenant: 读取租户列表,
     *
     *      // ......
     * }
     * ```
     *
     * ### Mock数据结构
     *
     * mock文件内部的数据结构如下：
     *
     * ```js
     * export default {
     *      mock: true,
     *      processor: (
     *          data = {},      // 「响应」对应 data 节点的数据，可以Object也可以Array
     *          params          // 「请求」对应当前请求数据
     *      ) => {
     *          // 返回 Promise
     *      },
     *      data: [
     *      ]
     * }
     * ```
     *
     * |参数|类型|说明|
     * |---:|:---|:---|
     * |mock|boolean|是否单独开关当前mock环境，只有mock打开才生效，如果设置false，则请求不走Mock流程。|
     * |data|Object/Array|模拟数据类型，可模拟成想要的数据类型做纯前端开发。|
     * |processor|Function|函数类型，可以在data基础之上实现响应数据格式的初步转换。|
     *
     * @constant MOCK
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    MOCK: __Zn.Env.MOCK,

    /**
     * ## 监控器参数 `Z_DEV_MONITOR`
     *
     * * 来源：`process.env.Z_DEV_MONITOR`
     * * 依赖：`process.env.Z_DEV_DEBUG`
     *
     * Zero UI中存在数据流监控器，配合 `redux` 实现针对交互过程的整体监控，该参数用于开启监控器，监控器的使用方式如下：
     *
     * 1. 直接点击 `Esc` 按键可打开监控面板。
     * 2. 监控面板中会包括当前页面的所有数据流信息。
     * 3. 可用于监控props中的变量变化信息。
     * 4. 可用于监控state中的变量变化信息。
     *
     * @constant MONITOR
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    MONITOR: __Zn.Env.MONITOR,

    /**
     * ## Meta：调试存储键名
     *
     * 用来存储 `Monitor` 专用的调试信息，该信息会在 `Monitor` 中被使用。
     *
     * @constant KEY_MDATA
     * @memberOf module:constant/zone
     */
    KEY_MDATA: __Zn.Env.KEY_MDATA,

    /**
     * ## 开启数字签名 `Z_SIGN`
     *
     * * 来源：`process.env.Z_SIGN`
     *
     * Zero UI 在启用后端扩展安全包中的接口时，可支持数字签名功能，前端包含了数字签名的基本算法可以实现针对参数的签名，最终和后端匹配完成 `sig` 参数的计算流程（现阶段的版本并未启用此功能，后期为了安全性考虑，会启用此功能）。
     *
     * ### 数字签名计算流程
     *
     * 1. 先在系统中执行基础路径计算。
     * 2. 如果用户已经登录，则使用登录用户的账号 key 执行计算，未登录则使用时间戳。
     * 3. 然后解析所有的参数。
     *      1. 如果是 pager 参数，则使用`":index" + pager.index + "size" + pager.size`。
     *      2. 如果是 criterias 参数，则执行排序后追加参数
     * 4. 最后执行 `HMAC-512` 基础算法加密，带上超时的 10 分钟。
     *
     * > 目前大部分应用并没使用数字签名功能，但后期可以考虑直接引入数字签名加强安全性。
     *
     * @constant SIGN
     * @memberOf module:constant/zone
     * @type {Boolean}
     */
    SIGN: __Zn.Env.SIGN,

    /**
     * ## App：色彩方案
     *
     * ### 基本说明
     *
     * 风格专用，用来配色，后缀的数值 `_N` 表示这种配色方案的颜色数量，您可以在任意场景使用配色数组，以实现配色的迭代调用和随机调用过程。
     *
     * @memberOf module:constant/zone
     * @constant THEME
     * @type {Object}
     */
    THEME: __Zn.Env.THEME,
    /**
     * ## App：布局专用
     *
     * ### 基本说明
     *
     * 布局专用，统一布局 Col 比例（支持自适应效果），针对列表类工具栏专用布局：
     *
     * - `LIST_NE`: `---- ------------ --------`：不带 Extra 的列表布局
     * - `LIST_E`：`---- -------- -------- ----`：标准列表布局
     * - `LIST_TT`：`--- ---------- --------- --`：任务系统列表布局
     * - `LIST_WF`：`--- -- --------------- ----`：工作流列表布局
     *
     * @memberOf module:constant/zone
     * @constant
     * @type {Object}
     */
    GRID: __Zn.Env.GRID,
    /**
     * ## Value：删除值
     *
     * ### 基本说明
     *
     * 系统默认的删除标记值，值为 `__DELETE__`，用来标记删除的数据，提供给前端做移除。
     *
     * @constant CV_DELETE
     * @memberOf module:constant/zone
     * @type {String}
     */
    CV_DELETE: __Zn.Env.CV_DELETE,
    /**
     *  ## Value：展开菜单值
     *  （略）同 {@link Ux.Env.VALUE.EXPAND}
     *  @constant CV_EXPAND
     *  @memberOf module:constant/zone
     *  @type {String}
     */
    CV_EXPAND: __Zn.Env.CV_EXPAND,

    /**
     * ## 变更模式
     *
     * ### 基本说明
     *
     * 变更模式主要用于变更记录、数据比对、以及操作反射等综合性场景，现阶段支持的变更模式主要包括：
     *
     * 1. ADD：新增
     * 2. REPLACE：更新/替换
     * 3. APPEND：更新/追加
     * 4. DELETE：删除
     *
     * > 追加和替换单独拎出来作为变更的两种扩展模式，在传统系统中默认使用的是替换的更新模式，而此处有追加之后您的变更模式就会潜移默化发生该变。
     *
     * 模式的细分主要是为了处理多种场景：
     *
     * 1. 输入属性的清空操作，在 Zero UI 中，系统采用了 JavaScript 中的两个特殊值：
     *      - `undefined`：表示属性不存在，此时系统会认为该属性不执行任何操作，跳过变更。
     *      - null：表示属性存在，但值为空，此时系统会认为该属性执行删除操作（清空）。
     * 2. 追加操作，追加操作主要用于特定对象的合并，默认值 + 更新值，可实现：
     *      - 更新值优先：REPLACE 替换模式
     *      - 默认值优先：APPEND 追加模式
     *
     * @constant CHANGE
     * @memberOf module:constant/zone
     * @type {Object}
     */
    CHANGE: __Zn.Env.CHANGE,

    /**
     * ## 开发参数
     *
     * ### 基本说明
     *
     * 针对特定场景做调试的专用参数，该参数可让您在调试过程中跳过某些步骤或直接执行后续流程。
     *
     * |参数名|参数值|说明|
     * |---|:---|:---|
     * |`SKIP_VALIDATE`|`__SKIP_VALIDATE`|跳过验证流程，直接执行下一步。|
     *
     * @constant DEV
     * @memberOf module:constant/zone
     * @type {Object}
     */
    DEV: __Zn.Env.DEV,
    /**
     * ## Value：默认主界面
     *
     * ### 基本说明
     *
     * 默认值为 `zero.desktop`，表示默认主界面为菜单中的工作台，位于系统统一规划的工作台应用。
     *
     * @constant PAGE_HOME
     * @memberOf module:constant/zone
     * @type {String}
     */
    PAGE_HOME: __Zn.Env.PAGE_HOME,
    /**
     * ## Meta：应用页键名
     *
     * > 路由规划专用
     *
     * ### 基本说明
     *
     * 用于存储当前应用路由的菜单信息，内置存储了一个应用，意味着导航在同一个时间内只能待在单个应用中，当您点击进入到某个应用时会自动更新该值。该值存储在 SessionStorage 中，保证会话结束后该值就被清除了。
     *
     * 内部存储的值为：单个应用菜单主键。
     *
     * @constant PAGE_APP
     * @memberOf module:constant/zone
     */
    PAGE_APP: __Zn.Env.PAGE_APP,
    /**
     * ## Meta：所在页键名
     *
     * > 路由规划专用
     *
     * ### 基本说明
     *
     * 存储了菜单主键，用于描述用户目前停留在哪个子页面，如果使用 `F5` 刷新时可以让浏览器自动路由到该页面中。
     *
     * @constant PAGE_AT
     * @memberOf module:constant/zone
     */
    PAGE_AT: __Zn.Env.PAGE_AT,
    /**
     * ## Meta：展开页键名
     *
     * > 路由规划专用
     *
     * ### 基本说明
     *
     * 内置存储结构为 `[]`，内部存储了当前用户展开的所有菜单列表，`F5` 刷新时路由规划器会依旧维持展开菜单的基本状态。
     *
     * @constant PAGE_OPEN
     * @memberOf module:constant/zone
     * @type {String}
     */
    PAGE_OPEN: __Zn.Env.PAGE_OPEN,
    /**
     * ## Meta：菜单数据键名
     *
     * > 路由规划专用
     *
     * ### 基本说明
     *
     * 防止应用重新加载菜单，在当前会话直接存储登录之后的所有菜单，减少远程读取菜单的开销。
     *
     * @constant PAGE_MENU
     * @memberOf module:constant/zone
     * @type {String}
     */
    PAGE_MENU: __Zn.Env.PAGE_MENU,
    /**
     * ## Syntax：键值语法
     *
     * 属性解析器中可直接解析成 `key = value` 结构专用的语法，此语法可以作为属性解析器的占位符。
     *
     * @constant SYNTAX_KV
     * @memberOf module:constant/zone
     * @type {String}
     */
    SYNTAX_KV: __Zn.Env.SYNTAX_KV,
    /**
     * ## Syntax：清空语法
     *
     * 属性解析器中可操作的清空语法，此语法可以作为属性解析器的占位符。
     *
     * @constant SYNTAX_CLEAR
     * @memberOf module:constant/zone
     * @type {String}
     */
    SYNTAX_CLEAR: __Zn.Env.SYNTAX_CLEAR,
    /**
     * ## 名称常量
     *
     * ### 基本说明
     *
     * 命名的基本规则有如下几种：
     *
     * - 不带任何变量前缀的如：`Ux.Env.K_NAME.VISIBLE`，使用 `$` 符号作为属性前缀，表示：`$visible`。
     * - 下划线前缀变量如：`Ux.Env.K_NAME._PAGER`，表示纯属性，如：`pager`。
     * - `$`符号前缀变量：AntD中的专用变量（旧版），如 `data-__meta` 这种格式。
     *
     * 其中还存在一个特殊变量：`Ux.Env.K_NAME.V_COLUMN`，和列表页中列相关的变量。
     *
     * @constant K_NAME
     * @memberOf module:constant/zone
     * @type {Object}
     */
    K_NAME: __Zn.Env.K_NAME,
    /**
     * ## UI常量
     *
     * ### 基本说明
     *
     * 该常量仅用于界面相关元素 `<hidden/>` 的ID，用于做HTML中连接元素专用常量，目前包含：
     *
     * |常量名|常量值|说明|
     * |:---|:---|:---|
     * |`Ux.Env.K_UI.PATTERN`|`__PATTERN__`|建模专用变量，描述标识规则选择器选择标识规则时的匹配模式。|
     * |`Ux.Env.K_UI.ELE_HEADER`|`__ELE_HEADER`|界面专用变量，描述界面中的头部元素，做顶部菜单处理的模式。|
     * |`Ux.Env.K_UI.BTN_TREE_ON`|`__BTN_TREE_ON`|树型展开用的隐藏变量|
     * |`Ux.Env.K_UI.BTN_TREE_OFF`|`__BTN_TREE_OFF`|树型收起用的隐藏变量|
     * |`Ux.Env.K_UI.BTN_CLEAR_PREFIX`|`__BTN_CLEAR_`|单字段列过滤清空专用隐藏ID，可和某个字段连接。|
     * |`Ux.Env.K_UI.BTN_CLEAR_SEARCH`|`__BTN_CLEAR_SEARCH`|搜索框清空专用隐藏ID。|
     * |`Ux.Env.K_UI.BTN_CLEAR_KEYWORD`|`__BTN_CLEAR_KEYWORD`|清空关键字专用隐藏ID。|
     *
     * @constant K_UI
     * @memberOf module:constant/zone
     * @type {Object}
     */
    K_UI: __Zn.Env.K_UI,
    /**
     * ## 特殊参数名
     *
     * ### 基本说明
     *
     * 该常量存储了 Zero Extension 的扩展框架中存在的核心参数名，这些参数名会用来做特殊读取和处理，且防止和其他参数名冲突。
     *
     * |参数调用|参数名|说明|
     * |:---|:---|:---|
     * |`Ux.Env.K_ARG.PID`|pid|页面ID，通常是菜单 `X_MENU` 的 `KEY` 列的值。|
     * |`Ux.Env.K_ARG.MID`|mid|模块ID，通常是模块表 `X_MODULE` 的 `KEY` 列的值。|
     * |`Ux.Env.K_ARG.TID`|tid|任务ID，工作流专用，对应到 `X_TODO` 的 `KEY` 列的值。|
     * |`Ux.Env.K_ARG.AID`|aid|应用ID，通常会对应到 `X_APP` 的 `KEY` 列的值。|
     * |`Ux.Env.K_ARG.ID`|key|主键专用。|
     * |`Ux.Env.K_ARG.TARGET`|target|目标页的URL地址，一般会做 `Base64` 编码，用于传递参数，当跳出应用回到环境时可指定上一个页面。|
     * |`Ux.Env.K_ARG.QR`|*|查询引擎专用的四个核心参数：`pager, sorter, projection, criteria`。|
     *
     * @constant K_ARG
     * @memberOf module:constant/zone
     * @type {Object}
     */
    K_ARG: __Zn.Env.K_ARG,
    /**
     * ## 特殊值
     *
     * ### 基本说明
     * 系统专用特殊值，等价变量为：
     *
     * - `Ux.Env.VALUE`：描述的是业务值
     * - `Ux.Env.CV_`：描述的是全局常量
     * - `Ux.Env.K_VALUE`：描述的是系统值。
     *
     * @constant K_VALUE
     * @memberOf module:constant/zone
     * @type {Object}
     */
    K_VALUE: __Zn.Env.K_VALUE,
}