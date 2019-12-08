/*
 * 【可重用】通用类型的控件
 */
// ------------- 可重用组件
/* （常用完整列表组件）*/
export {default as ExComplexList} from './ExComplexList/UI';
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


/* （通用记录显示）
 *  UI_FORM / Record 合并到一起（动态表单）
 **/
export {default as ExRecord} from './ExRecord/UI';
export {default as ExRelation} from './ExRelation/UI';

/*
 * SubForm 专用组件（子表单，本身不带表单结构）
 */
export {default as ExService} from './ExService/UI';
/*
 * 【不可重用】业务类型控件
 */
// ------------- 登录入口
/* （管理员入口） ----- ExLogin 后台登录专用界面 */
export {default as ExLogin} from './ExLogin/UI';
/* （会员入口）   ----- ExEntry 会员登录专用 */
export {default as ExEntry} from './ExEntry/UI';

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
/*
 * 日志颜色分类
 * 私有：
 * 公有组件：#
 * 公有表单：#C03
 * 公有列表：#09C
 */