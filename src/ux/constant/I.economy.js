export default {
    /**
     * ## 常量
     *
     * 常用 Web 组件的 className 的 css 相关信息
     *
     * @memberOf module:_constant
     */
    ECONOMY: {
        CARD_CONTAINER: "web-card",// PageCard / HelpCard最外层
        TAB_CONTAINER: "web-tab",// ComplexList / TabList
        ROW_HEAD: "web-row-head",    // 放在头部的间距文件
        TABLE_CONTROL: "web-table",   //
    },
    /**
     * ## 常量
     *
     * 专用树筛选模式常量：
     *
     * * `PARENT_ALL_INCLUDE`：当前节点 + 所有父节点。
     * * `PARENT_ALL`：所有父节点（包含祖辈以及以上）。
     * * `PARENT`：直接父节点（不包含祖辈）。
     * * `CURRENT`：只选择当前节点。
     * * `CHILDREN`：直接子节点（不包含孙辈）。
     * * `CHILDREN_ALL`：所有子节点（包含孙辈以及以下）。
     * * `CHILDREN_ALL_INCLUDE`：当前节点 + 所有子节点。
     *
     * @memberOf module:_constant
     */
    SELECTION: {
        PARENT_ALL_INCLUDE: "PARENT_ALL_INCLUDE",           // 当前 + 所有父节点
        PARENT_ALL: "PARENT_ALL",                           // 所有父节点
        PARENT: "PARENT",                                   // 直接父节点
        CURRENT: "CURRENT",                                 // 只选择当前节点
        CHILDREN: "CHILDREN",                               // 直接子节点
        CHILDREN_ALL: "CHILDREN_ALL",                        // 所有子节点
        CHILDREN_ALL_INCLUDE: "CHILDREN_ALL_INCLUDE",       // 当前节点 + 所有子节点
    },
    /**
     * ## 常量
     *
     * 响应式编程组件来源常量
     *
     * * `REACTIVE`：响应式Rxjs
     * * `REACT`：只使用 React
     * * `REDUX`：和 Redux 配合
     * @deprecated
     *
     * @memberOf module:_constant
     */
    RX_SOURCE: {
        REACTIVE: "REACTIVE",
        REACT: "REACT",
        REDUX: "REDUX"
    },
    /**
     *  ## 常量
     *
     *  表单模式
     *
     *  * ADD：添加模式的表单
     *  * EDIT：编辑模式的表单
     *
     *
     * @memberOf module:_constant
     */
    FORM_MODE: {
        ADD: "ADD",
        EDIT: "EDIT"
    }
};