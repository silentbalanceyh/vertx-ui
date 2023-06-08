export {default as ExEntry} from './ExEntry/UI';                        /* （会员入口）   ----- ExEntry 会员登录专用 */
export {default as ExAccount} from './ExAccount/UI';                    /* （账号信息）用户数据（左边专用的用户基本信息） */
export {default as ExAdmin} from './ExAdmin/UI';                        /* （管理员模板） ----- ExAdmin 模板专用 */
export {default as ExAuthority} from './ExAuthority/UI';                /*  权限管理主界面 */
export {default as ExApps} from './ExApps/UI';                          /* （Dashboard专用）*/
export {default as ExArbor} from './ExArbor/UI';                        /* （通用树）左边的树形结构 */
export {default as ExCategory} from './ExCategory/UI';                  /* （Category专用）分类管理 */
export {default as ExDeploy} from './ExDeploy/UI';
export {default as ExForm} from './ExForm/UI';                          /* （通用表单）*/
export {default as ExGraphicEditor} from './ExGraphicEditor/UI';        /* 拓扑图编辑器 */
export {default as ExGraphicViewer} from './ExGraphicViewer/UI';        /* 拓扑图查看器 */
export {default as ExHistory} from './ExHistory/UI';                    /* （通用历史记录）X_ACTIVITY / X_ACTIVITY_CHANGE */
export {default as ExListComplex} from './ExListComplex/UI';          // 复杂列表
export {default as ExListFast} from './ExListFast/UI';                // 全窗口操作列表
// export {default as ExListQuery} from './ExListQuery/UI';              // 简单结果呈现列表
export {default as ExLogin} from './ExLogin/UI';                        /* （管理员入口） ----- ExLogin 后台登录专用界面 */
export {default as ExRecord} from './ExRecord/UI';                      /*  UI_FORM / Record 合并到一起（动态表单） */
export {default as ExRegiment} from './ExRegiment/UI';                  /* （通用选择器）搜索、选择、多选、反选专用面板 */
export {default as ExRelation} from './ExRelation/UI';
export {default as ExService} from './ExService/UI';                    /* SubForm 专用组件（子表单，本身不带表单结构） */
export {default as ExSubmit} from './ExSubmit/UI';
export {default as ExTab} from './ExTab/UI';                            /* （通用页签）原始版本的 auiTab */
export {default as ExTabular} from './ExTabular/UI';                    /* （Tabular专用）字典管理 */
export {default as ExTrackField} from './ExTrackField/UI';
export {default as ExWizard} from './ExWizard/UI';                      /* 双表单依赖搜索专用 */
export {default as ExAnnounce} from './ExAnnounce/UI';                  /* 公告 */
export {default as ExAnnounceView} from './ExAnnounceView/UI';          /* 公告详情 */

// 模板专用方法
export {default as ExLogged} from './ExLogged/UI';


// 工作流专用（标准化）
export {default as TxPortal} from './TxPortal/UI';                      /* 流程入口（服务目录）*/
export {default as TxPage} from './TxPage/UI';                          /* 流程专用页面容器 */

export {default as TxQRun} from './TxQRun/UI';                          /* 待办队列 */
export {default as TxQDone} from './TxQDone/UI';                        /* 已完成队列 */

export {default as TxOpen} from './TxOpen/UI';                          /* 开单页面 */
export {default as TxObserve} from './TxObserve/UI';                    /* 审批页面 */
export {default as TxOverview} from './TxOverview/UI';                  /* 历史页面 */


// 个人界面
export {default as MyMenu} from './MyMenu/UI';
export {default as MyTodo} from './MyTodo/UI';                          /* 首页：我的待办 */


// G2图
export {default as G2Bar} from './G2Bar/UI';
export {default as G2Pie} from './G2Pie/UI';
export {default as G2Line} from './G2Line/UI';
export {default as G2Broken} from './G2Broken/UI';
export {default as G2MoreLine} from './G2MoreLine/UI';


// 账务部分
export {default as FBookView} from './FBookView/UI';                // 账本详情，带账单明细
export {default as FBookList} from './FBookList/UI';                // 账本列表（订单中查看）
export {default as FSettleView} from './FSettleView/UI';            // 结算单详情
export {default as FDebtView} from './FDebtView/UI';                // 应收详情
export {default as FRefundView} from './FRefundView/UI';            // 退款详情

// 开发中心
export {default as DxAdmin} from './DxAdmin/UI';                    // 开发专用模板

// 内置交互式组件
export {default as IxDatabase} from './IxDatabase/UI';              // 数据库配置
/**
 * # 扩展组件`Ex/Ix/Ox`
 *
 * ## 1.组件分组
 *
 * |组件前缀|含义|
 * |:---|:---|
 * |Ix|内置专用组件，Internal Extension X。|
 * |Ex|扩展组件，Extension Component X。|
 * |Ox|配置组件，Origin Extension X。|
 *
 * > 名字中带有`*`号的是私有属性，不可直接从`ei`中导入。
 *
 * ### 1.Ex组件
 *
 * |组件名|生命周期|私有|表单组件|含义|
 * |:---|---|---|---|:---|
 * |* ExAction|x x x|v|否|「外层」按钮和链接专用封装组件。|
 * |* ExButton|x x x|v|否|「内层」按钮和连接专用封装组件。|
 * |* ExDialog|x o x|v|否|弹出框专用组件。|
 * |* ExEditorBatch|x o x|v|否|批量编辑器。|
 * |* ExEditorColumn|x o x|v|否|模型列选择器。|
 * |* ExEditorExport|x o x|v|否|导出数据编辑器。|
 * |* ExEditorImport|x o x|v|否|导入数据编辑器。|
 * |* ExNavigation|x x x|v|否|导航栏专用扩展组件。|
 * |* ExSearch|x o x|v|否|搜索栏专用。|
 * |* ExSider|x o x|v|否|侧边栏专用菜单组件。|
 * |ExAccount|o o x|否|否|显示用户账号信息专用数据呈现组件，目前用于用户的Profile页面。|
 * |ExAdmin|x o x|否|否|渲染模板专用（整个站点的模板页，动态模板）。|
 * |ExApps|x o x|否|否|渲染Dashboard专用的界面，主页的图标链接看板。|
 * |ExArbor|x x x|否|否|渲染左边选择树，带`Collapse`折叠板，折叠根面板。|
 * |ExCategory|x o x|否|否|使用`X_CATEGORY`构造标准的树形菜单。|
 * |ExDeploy|o o x|否|否|PPT引导专用，Ox专用展示流程模板，G6实现。|
 * |ExEntry|o x x|否|否|「登录」登录框组件（上下排版）。|
 * |ExForm|x o o|否|否|标准表单。|
 * |ExGraphicEditor|o o o|否|否|基于X6的拓扑图编辑器。|
 * |ExGraphicViewer|o o o|否|否|基于X6的拓扑图查看器。|
 * |ExHistory|o o x|否|否|历史记录专用查看组件。|
 * |ExListComplex|x o o|否|否|「高频」复杂列表组件。|
 * |ExListOpen|x o o|否|否|「高频」动态行操作列表组件。|
 * |ExLogged|x x x|否|否|已经登录的用户状态组件。|
 * |ExLogin|x x x|否|否|「登录」登录框组件（标准版）。|
 * |ExRecord|x o o|否|否|记录呈现专用。|
 * |ExRegiment|o o o|否|否|专用配置项选择器，搜索、选择、多选、反选。|
 * |ExRelation|o o x|否|否|关系呈现专用。|
 * |ExService|o o x|否|否|服务页编辑器，`I_API/I_JOB`专用编辑控件。|
 * |ExSubmit|o o x|否|否|「登录」登录框组件（带有记忆功能）。|
 * |ExTab|x o x|否|否|页签容器专用扩展组件。|
 * |ExTabular|x o x|否|否|使用`X_TABULAR`构造标准的树形菜单。|
 * |ExTrackField|o o x|否|否|字段对比专用呈现组件。|
 * |ExWizard|x o x|否|否|双表单依赖搜索专用组件。|
 *
 * ### 2.Ox组件
 *
 * |组件名|生命周期|表单组件|含义|
 * |:---|---|---|:---|
 * |OxAnchor|o o x|否|链接专用锚点，带Dialog模式的按钮或链接，窗口打开是配置项详情。|
 * |OxCard|x o x|否|PageCard专用的封装型组件，为了可直接在系统中配置界面。|
 * |OxCategory|o x x|否|带`Collapse`面板的配置项，等价于`ExArbor`，但是配置型，所以使用了高阶注解。|
 * |OxCi|o o o|否|显示配置项信息专用表单，弹出框或者其他容器都可呈现。|
 * |OxForm|x o x|否|配置型表单，等价于`ExForm`。|
 * |OxHistory|o o x|否|配置型历史记录，等价于`ExHistory`。|
 * |OxModule|x o o|否|配置型模块容器，无等价组件。|
 * |OxRelation|x o x|否|配置型关系信息，等价于`ExRelation`。|
 * |OxTab|x o x|否|配置型页签容器，等价于`ExTab`。|
 * |OxTopology|o o o|否|配置型拓扑图，呈现CMDB关系拓扑图。|
 *
 * ### 3.Ix组件
 *
 * |组件名|生命周期|私有|表单组件|含义|
 * |:---|---|---|---|:---|
 * |* IxChannel|x x x|v|是|通道配置自定义组件。|
 * |* IxDatabase|o o x|v|是|数据库配置自定义组件。|
 * |* IxDict|x x x|v|是|字典配置自定义组件。|
 * |* IxIntegration|o o x|v|是|集成配置自定义组件。|
 * |* IxMapping|o o x|v|是|映射配置自定义组件。|
 * |* IxRule|o o x|v|是|标识规则编辑器。|
 * |* IxService|x x x|v|是|服务组件编辑器。|
 *
 * @module uca/extension
 **/