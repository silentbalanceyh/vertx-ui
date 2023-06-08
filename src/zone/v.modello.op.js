// eslint-disable-next-line import/no-anonymous-default-export
export default {

    CHANGE: {
        ADD: "ADD",
        REPLACE: "REPLACE",
        APPEND: "APPEND",
        DELETE: "DELETE"
    },

    SELECTION: {
        PARENT_ALL_INCLUDE: "PARENT_ALL_INCLUDE",           // 当前 + 所有父节点
        PARENT_ALL: "PARENT_ALL",                           // 所有父节点
        PARENT: "PARENT",                                   // 直接父节点
        CURRENT: "CURRENT",                                 // 只选择当前节点
        CHILDREN: "CHILDREN",                               // 直接子节点
        CHILDREN_ALL: "CHILDREN_ALL",                        // 所有子节点
        CHILDREN_ALL_INCLUDE: "CHILDREN_ALL_INCLUDE",       // 当前节点 + 所有子节点
    },
    RX_SOURCE: {
        REACTIVE: "REACTIVE",
        REACT: "REACT",
        REDUX: "REDUX"
    },
    FORM_MODE: {
        ADD: "ADD",
        EDIT: "EDIT",
        SEARCH: "SEARCH",
        DESIGN: "DESIGN"
    }
}