export default {
    /**
     * ## `Ex.Opt`
     *
     * 列表专用 options 的键值定义，定义了资源文件中使用的`options`选项的详细信息。
     *
     * * `ExListComplex`
     * * `ExListQuery`
     * * `ExListOpen`
     *
     * 目前Extension框架中以上三个组件会使用该常量。
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    Opt: {
        // Tab页配置
        TABS_LIST: 'tabs.list',     /* 列表页专用 Tab 页标题 */
        TABS_COUNT: 'tabs.count',   /* 当前 Tab 页的限制，只能打开的页面数量，打开的新的 Tab 页不能大于该值 */
        TABS_ADD: 'tabs.add',       /* 添加表单Tab页专用标题 */
        TABS_EDIT: 'tabs.edit',     /* 编辑表单Tab页专用标题 */
        TABS_EXTRA_ADD: "tabs.extra.add", /* 隐藏Extra功能，在表单中提供按钮 */
        TABS_EXTRA_EDIT: "tabs.extra.edit", /* 隐藏Extra功能，在表单中提供按钮 */

        // 动态静态配置
        DYNAMIC_OP: 'dynamic.op',           /* 动态 Op */
        DYNAMIC_COLUMN: 'dynamic.column',   /* 动态 Column */
        DYNAMIC_SWITCH: 'dynamic.switch',   /* 添加过后是否直接到编译页 */

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
        SEARCH_CONFIRM_CLEAR: 'search.confirm.clear',             /* 清除专用消息提示 */

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
        // 插件
        PLUGIN_ROW_EDITION: "plugin.row.edition",           /* 插件 */
    },
    /**
     * ## `Ex.Mode`
     *
     * 列表界面的基础模式常量定义
     *
     * |值|含义|
     * |:---|:---|
     * |list|列表基础模式，不打开任何表单，只显示列表详细信息。|
     * |add|添加模式，打开添加表单专用，会影响表单模式，并且无读取记录。|
     * |edit|编辑模式，打开编辑表单专用。|
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
    Mode: {
        ADD: "add",
        EDIT: "edit",
        LIST: "list"
    },
    /**
     * ## `Ex.V`
     *
     * 专用 Tabular/Category 对应的 type 常量，该常量值用来定义常用的系统管理信息，
     * 这个常量带有很强的业务信息，所以在使用时候需要配合Zero Extension中的组件和页面来使用。
     *
     * @memberOf module:_constant
     * @constant
     * @type {Object}
     */
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
}