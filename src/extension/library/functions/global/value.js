export default {
    TYPE_TABULAR: "zero.tabular",       // 字典类型：X_TABULAR -> TYPE
    TYPE_CATEGORY: "zero.category",     // 类别类型：X_CATEGORY -> TYPE
    TYPE_CUSTOMER: "zero.customer",// 客户类型
    TYPE_IDENTITY: "zero.identity",// 档案类型
    TYPE_COMPANY: "company.nature",  // 公司类型
    PERM_TREE_SYSTEM: [
        "resource.ambient",
        "resource.security",
        "resource.ui",
        "resource.engine",
        "resource.organization"
    ],
    PERM_INTEGRATION: "resource.integration",
    PERM_PAGE: {
        DEV: [
            "resource.ui",
            "resource.engine",
            "resource.integration",
        ],
        SYS: [
            "resource.ambient",
            "resource.security",
            "resource.organization"
        ]
    }
}