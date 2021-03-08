/*
 * 【可重用】通用类型的控件
 */
// ------------- 可重用组件
/* （常用完整列表组件）*/
export {default as ExListComplex} from './ExListComplex/UI';          // 复杂列表
export {default as ExListQuery} from './ExListQuery/UI';              // 简单结果呈现列表
export {default as ExListOpen} from './ExListOpen/UI';                // 全窗口操作列表
/* （通用表单）*/
export {default as ExForm} from './ExForm/UI';
/* （通用页签）原始版本的 auiTab */
export {default as ExTab} from './ExTab/UI';
/* （账号信息）用户数据（左边专用的用户基本信息） */
export {default as ExAccount} from './ExAccount/UI';
/* （通用树）左边的树形结构 */
export {default as ExArbor} from './ExArbor/UI';
/* （通用选择器）搜索、选择、多选、反选专用面板 */
export {default as ExRegiment} from './ExRegiment/UI';
/* （通用历史记录）X_ACTIVITY / X_ACTIVITY_CHANGE */
export {default as ExHistory} from './ExHistory/UI';
export {default as ExTrackField} from './ExTrackField/UI';
/* 双表单依赖搜索专用 */
export {default as ExWizard} from './ExWizard/UI';


/* （通用记录显示）
 *  UI_FORM / Record 合并到一起（动态表单）
 **/
export {default as ExRecord} from './ExRecord/UI';
export {default as ExRelation} from './ExRelation/UI';

/*
 * SubForm 专用组件（子表单，本身不带表单结构）
 */
export {default as ExService} from './ExService/UI';
export {default as ExDeploy} from './ExDeploy/UI';
/*
 * 【不可重用】业务类型控件
 */
// ------------- 登录入口
/* （管理员入口） ----- ExLogin 后台登录专用界面 */
export {default as ExLogin} from './ExLogin/UI';
export {default as ExLogged} from './ExLogged/UI';
/* （会员入口）   ----- ExEntry 会员登录专用 */
export {default as ExEntry} from './ExEntry/UI';
/* */
export {default as ExSubmit} from './ExSubmit/UI';

// ------------- 整页模板
/* （管理员模板） ----- ExAdmin 模板专用 */
export {default as ExAdmin} from './ExAdmin/UI';

// ------------- 菜单选择器
/* （Tabular专用）字典管理 */
export {default as ExTabular} from './ExTabular/UI';
/* （Category专用）分类管理 */
export {default as ExCategory} from './ExCategory/UI';

// ------------- 菜单选择器
/* （Dashboard专用）*/
export {default as ExApps} from './ExApps/UI';

// ------------- 拓扑图定义
export {default as ExGraphicEditor} from './ExGraphicEditor/UI';
export {default as ExGraphicViewer} from './ExGraphicViewer/UI';
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
 * ### 1.Ex组件
 *
 * |组件名|生命周期|私有|表单组件|含义|
 * |:---|---|---|---|:---|
 * |ExAccount|o o x|否|否|显示用户账号信息专用数据呈现组件，目前用于用户的Profile页面。|
 * |ExAction|x x x|是|否|按钮和链接专用封装组件。|
 * |ExAdmin|x o x|否|否|渲染模板专用（整个站点的模板页，动态模板）。|
 * |ExApps|x o x|否|否|渲染Dashboard专用的界面，主页的图标链接看板。|
 *
 * ### 2.Ox组件
 *
 * ### 3.Ix组件
 *
 * @module web-component
 **/