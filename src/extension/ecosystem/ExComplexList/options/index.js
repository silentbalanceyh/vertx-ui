import Op from './O.action';

const Option = {
    // Tab页配置
    TABS_LIST: 'tabs.list',     /* 列表页专用 Tab 页标题 */
    TABS_COUNT: 'tabs.count',   /* 当前 Tab 页的限制，只能打开的页面数量，打开的新的 Tab 页不能大于该值 */

    // 动态静态配置
    DYNAMIC_OP: 'dynamic.op',           /* 动态 Op */
    DYNAMIC_COLUMN: 'dynamic.column',   /* 动态 Column */
};
/*
 * Tab 页的类型，主要分三种
 * "list": 列表页
 * "add": 添加表单页
 * "edit": 编辑页
 */
const Type = {
    LIST: "list",
    ADD: "add",
    EDIT: "edit"
};
export default {
    Option,
    Type,
    Op,
}