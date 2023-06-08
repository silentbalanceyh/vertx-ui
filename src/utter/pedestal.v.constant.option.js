const FlowAction = {
    VIEW: "$opView",        // 查看
    OPEN: "$opOpen",        // 开单
    SAVING: "$opSaving",    // 保存
    CLOSE: "$opClose",      // 关闭
    CANCEL: "$opCancel",    // 撤销
    RESET: "$opReset",      // 重置
    BACK: "$opBack",        // 返回
    TRANSFER: "$opTransfer",// 转单
    APPROVE: "$opApprove",  // 审批
    REJECT: "$opReject",    // 拒绝
}
const Flow = {
    // 默认权限
    DEFAULT: [
        FlowAction.RESET,
        FlowAction.BACK,
        FlowAction.VIEW
    ],
    // 历史权限
    HISTORY: [
        FlowAction.VIEW,
        FlowAction.BACK
    ],
    // 我的审批
    PENDING: [
        FlowAction.VIEW,
        FlowAction.OPEN,
        FlowAction.SAVING,
        FlowAction.TRANSFER,
        FlowAction.CLOSE,
        FlowAction.CANCEL,
        FlowAction.RESET,
        FlowAction.BACK,
    ],
    // 我的提交：查看详情 / 撤销
    WAITING: [
        FlowAction.VIEW,
        FlowAction.OPEN,
        FlowAction.SAVING,
        FlowAction.TRANSFER,
        FlowAction.CLOSE,
        FlowAction.CANCEL,
        FlowAction.RESET,
        FlowAction.BACK,
    ],

    // 我的草稿
    DRAFT: [
        FlowAction.VIEW,
        FlowAction.OPEN,
        FlowAction.SAVING,
        FlowAction.CLOSE,
        FlowAction.CANCEL,
        FlowAction.RESET,
        FlowAction.BACK,
    ]
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    Flow,
    Opt: {
        // Tab页配置：新增
        TABS_CONTAINER: 'tabs.container',                   /* 新增 —— 是否默认包含容器，不放在 Page Card 内时使用 */
        TABS_TITLE: 'tabs.title',                           /* 新增 —— TAB页标题 */
        TABS_LIST: 'tabs.list',                             /* 列表页专用 Tab 页标题 */
        TABS_TYPE: 'tabs.type',                             /* Tab页签类型 */
        TABS_COUNT: 'tabs.count',                           /* 当前 Tab 页的限制，只能打开的页面数量，打开的新的 Tab 页不能大于该值 */
        TABS_ADD: 'tabs.add',                               /* 添加表单Tab页专用标题 */
        TABS_EDIT: 'tabs.edit',                             /* 编辑表单Tab页专用标题 */
        TABS_EXTRA_ADD: "tabs.extra.add",                   /* 隐藏Extra功能，在表单中提供按钮 */
        TABS_EXTRA_EDIT: "tabs.extra.edit",                 /* 隐藏Extra功能，在表单中提供按钮 */
        TABS_DISABLED: 'tabs.disabled',                     /* 单列表操作 */

        // 动态静态配置
        DYNAMIC_OP: 'dynamic.op',                           /* 动态 Op */
        DYNAMIC_COLUMN: 'dynamic.column',                   /* 动态 Column */
        DYNAMIC_SWITCH: 'dynamic.switch',                   /* 添加过后是否直接到编译页 */

        // 搜索专用
        SEARCH_ENABLED: 'search.enabled',                   /* 是否开启搜索 */
        SEARCH_ADVANCED: 'search.advanced',                 /* 是否开启高级搜索 */
        SEARCH_PLACEHOLDER: 'search.placeholder',           /* 水印 */
        SEARCH_COND: 'search.cond',                         /* 条件处理 */
        SEARCH_ADVANCED_TITLE: 'search.advanced.title',     /* 窗口标题 */
        SEARCH_ADVANCED_WIDTH: 'search.advanced.width',     /* 窗口宽度 */
        SEARCH_ADVANCED_NOTICE: 'search.advanced.notice',   /* 高级搜索提示 */
        SEARCH_OP_REDO: 'search.op.redo',                   /* 提示文字：清空 */
        SEARCH_OP_ADVANCED: 'search.op.advanced',           /* 提示文字：高级搜索 */
        SEARCH_OP_VIEW: 'search.op.view',                   /* 提示文字：查询条件 */
        SEARCH_CONFIRM_CLEAR: 'search.confirm.clear',       /* 清除专用消息提示 */
        SEARCH_CRITERIA_NOTICE: "search.criteria.notice",   /* 搜索提示 */
        SEARCH_CRITERIA_WINDOW: "search.criteria.window",   /* 搜索提示窗口 */
        SEARCH_CRITERIA_VIEW: "search.criteria.view",       /* 查询条件视图 */
        SEARCH_GRID: "search.grid",                         /* 新增 —— Grid名称：对应不同的顶部菜单信息 */

        // All ajax prefix parameters belong to backend instead
        AJAX_POSITION: 'ajax.position',                     /* 视图专用参数 */
        AJAX_MODULE: 'ajax.module',                         /* 是否启用 module 参数 */
        // 主函数
        AJAX_SEARCH_URI: 'ajax.search.uri',                 /* 查询引擎，必须Post */
        AJAX_COLUMN_FULL: 'ajax.column.full',               /* 全列读取 */
        AJAX_COLUMN_MY: 'ajax.column.my',                   /* （动态可用）我的列读取 */
        AJAX_COLUMN_SAVE: 'ajax.column.save',               /* （动态可用）列保存 */
        // 删除 / 编辑
        AJAX_DELETE_URI: 'ajax.delete.uri',                 /* 行删除，由ExListComplex传入，第二个界面需要重用 */
        AJAX_GET_URI: 'ajax.get.uri',                       /* 行编程方法 */
        AJAX_BATCH_DELETE_URI: 'ajax.batch.delete.uri',     /* 批量删除 */
        AJAX_BATCH_UPDATE_URI: 'ajax.batch.update.uri',     /* 批量编辑 */
        // 导入 / 导出
        AJAX_EXPORT_URI: 'ajax.file.export',                /* 导出 */
        AJAX_IMPORT_URI: 'ajax.file.import',                /* 导入 */

        MESSAGE_BATCH_DELETE: 'message.batch.delete',       /* 批量删除消息 */
        MESSAGE_BATCH_UPDATE: 'message.batch.update',       /* 批量更新消息 */
        // 模型
        IDENTIFIER: 'identifier',                           /* 模块名称 */
        PARAMETER: 'parameter',                             /* 参数处理 */
        // 插件
        PLUGIN_ROW_EDITION: "plugin.row.edition",           /* 插件 */
    },
    Mode: {
        ADD: "add",
        EDIT: "edit",
        LIST: "list",
        FILTER: "filter"
    },
    V: {
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
    },
    PLUGIN: {
        LEGACY: [
            'pluginField',
            'pluginRow',
            'pluginForm'
        ]
    },
    Order: {
        "op.open": [
            "op.open.add",
            "op.open.filter"
        ],
        "op.batch": [
            "op.batch.edit",
            "op.batch.delete"
        ],
        "op.extra": [
            "op.extra.column",
            "op.extra.view",
            "op.extra.export",
            "op.extra.import"
        ],
        "op.add": [
            "op.submit.add",
            "op.submit.reset"
        ],
        "op.edit": [
            "op.submit.save",
            "op.submit.delete",
            "op.submit.close",
            "op.submit.reset"
        ]
    },
    K: {
        // 辅助数据 KEY 值，统一处理保证规范性
        DEPT: "resource.departments",           // E_DEPT
        TEAM: "resource.teams",                 // E_TEAM
        GROUP: "ajax.groups"                    // S_GROUP
    }
}