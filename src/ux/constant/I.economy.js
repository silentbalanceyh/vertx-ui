// 关联风格文件夹
// src/style/economy文件夹
export default {
    ECONOMY: {
        CARD_CONTAINER: "web-card",// PageCard / HelpCard最外层
        TAB_CONTAINER: "web-tab",// ComplexList / TabList
        ROW_HEAD: "web-row-head",    // 放在头部的间距文件
        TABLE_CONTROL: "web-table",   //
    },
    SELECTION: {
        PARENT_ALL_INCLUDE: "PARENT_ALL_INCLUDE",           // 当前 + 所有父节点
        PARENT_ALL: "PARENT_ALL",                           // 所有父节点
        PARENT: "PARENT",                                   // 直接父节点
        CURRENT: "CURRENT",                                 // 只选择当前节点
        CHILDREN: "CHILDREN",                               // 直接子节点
        CHILDREN_ALL: "CHILDREN_ALL",                        // 所有子节点
        CHILDREN_ALL_INCLUDE: "CHILDREN_ALL_INCLUDE",       // 当前节点 + 所有子节点
    }
};