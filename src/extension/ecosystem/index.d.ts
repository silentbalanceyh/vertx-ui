declare module "ei" {
    export {default as ExAccount} from './ExAccount/UI';                    /* （账号信息）用户数据（左边专用的用户基本信息） */
    export {default as ExAdmin} from './ExAdmin/UI';                        /* （管理员模板） ----- ExAdmin 模板专用 */
    export {default as ExApps} from './ExApps/UI';                          /* （Dashboard专用）*/
    export {default as ExArbor} from './ExArbor/UI';                        /* （通用树）左边的树形结构 */
    export {default as ExCategory} from './ExCategory/UI';                  /* （Category专用）分类管理 */
    export {default as ExDeploy} from './ExDeploy/UI';
    export {default as ExEntry} from './ExEntry/UI';                        /* （会员入口）   ----- ExEntry 会员登录专用 */
    export {default as ExForm} from './ExForm/UI';                          /* （通用表单）*/
    export {default as ExGraphicEditor} from './ExGraphicEditor/UI';        /* 拓扑图编辑器 */
    export {default as ExGraphicViewer} from './ExGraphicViewer/UI';        /* 拓扑图查看器 */
    export {default as ExHistory} from './ExHistory/UI';                    /* （通用历史记录）X_ACTIVITY / X_ACTIVITY_CHANGE */
    export {default as ExListComplex} from './ExListComplex/UI';            // 复杂列表
    export {default as ExListOpen} from './ExListOpen/UI';                  // 全窗口操作列表
    export {default as ExListQuery} from './ExListQuery/UI';                // 简单结果呈现列表
    export {default as ExLogged} from './ExLogged/UI';
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


    // 我的待办
    export {default as TxQRun} from './TxQRun/UI';                          /* 待办队列 */
    export {default as TxQDone} from './TxQDone/UI';                        /* 待办队列 */


    // 个人界面
    export {default as MyMenu} from './MyMenu/UI';


    // G2图
    export {default as G2Bar} from './G2Bar/UI';
    export {default as G2Pie} from './G2Pie/UI';
    export {default as G2Line} from './G2Line/UI';


    // 账务部分
    export {default as FBookView} from './FBookView/UI';                // 账本详情，带账单明细
    export {default as FBookList} from './FBookList/UI';                // 账本列表（订单中查看）
    export {default as FSettleView} from './FSettleView/UI';            // 结算单详情
    export {default as FDebtView} from './FDebtView/UI';                // 应收详情
    export {default as FRefundView} from './FRefundView/UI';                // 退款详情
}
