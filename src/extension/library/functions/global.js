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
     * |属性名|值|含义|
     * |:---|:---|:---|
     * |TABS_LIST|tabs.list|列表页专用页签标题文字。|
     * |TABS_COUNT|tabs.count|如果打开Tab页，可以打开的页签的最大数量，默认为1。|
     * |TABS_ADD|tabs.add|添加表单打开的页签标题文字。|
     * |TABS_EDIT|tabs.edit|编辑表单打开的页签标题文字，可用数据格式化。|
     * |TABS_EXTRA_ADD|tabs.extra.add|隐藏Extra功能，编辑表单页提供添加按钮专用。|
     * |TABS_EXTRA_EDIT|tabs.extra.edit|隐藏Extra功能，编辑表单页提供按钮专用。|
     * |DYNAMIC_OP|dynamic.op|（Boolean）动态Op开关，如果为true，则直接从`UI_OP`中读取配置，默认false。|
     * |DYNAMIC_COLUMN|dynamic.column|（Boolean）动态表格列开关，如果为true，则从`UI_COLUMN`中读取配置，默认false。|
     * |DYNAMIC_SWITCH|dynamic.switch|（Boolean）添加完成后是否直接跳转到编辑页，为true则直接跳转，false则关闭当前添加表单。|
     * |SEARCH_ENABLED|search.enabled|（Boolean）是否启用搜索。|
     * |SEARCH_PLACEHOLDER|search.placeholder|搜索框的水印文字。|
     * |SEARCH_COND|search.cond|搜索框触发的条件配置。|
     * |SEARCH_OP_REDO|search.op.redo|清空条件的按钮提示文字。|
     * |SEARCH_OP_ADVANCED|search.op.advanced|高级搜索按钮提示文字。|
     * |SEARCH_CONFIRM_CLEAR|search.confirm.clear|清除条件时的Confirm提示的`确认/取消`文字信息。|
     * |SEARCH_ADVANCED|search.advanced|（Boolean）是否开启高级搜索。|
     * |SEARCH_ADVANCED_TITLE|search.advanced.title|高级搜索抽屉窗口标题。|
     * |SEARCH_ADVANCED_WIDTH|search.advanced.width|高级搜索抽屉窗口宽度。|
     * |SEARCH_ADVANCED_NOTICE|search.advanced.notice|高级搜索的提示文字。|
     * |IDENTIFIER|identifier|模型统一标识符。|
     * |PLUGIN_ROW_EDITION|plugin.row.edition|行编辑插件配置，用于配置执行函数。|
     * |MESSAGE_BATCH_DELETE|message.batch.delete|批量删除完成后的提示消息。|
     * |MESSAGE_BATCH_UPDATE|message.batch.update|批量更难完成后的调试消息。|
     * |AJAX_SEARCH_URI|ajax.search.uri|（POST）列表主接口，通常使用Post查询，带查询引擎如分页、排序、搜索等。|
     * |AJAX_COLUMN_FULL|ajax.column.full|（GET）`dynamic.column = true`列表全列读取接口。|
     * |AJAX_COLUMN_MY|ajax.column.my|（GET）`dynamic.column = true`列表视图列（我的列）读取接口。|
     * |AJAX_COLUMN_SAVE|ajax.column.save|（PUT）`dynamic.column = true`保存视图（我的列）专用接口。|
     * |AJAX_DELETE_URI|ajax.delete.uri|（DELETE）行删除专用接口，内置表单也可调用。|
     * |AJAX_GET_URI|ajax.get.uri|（GET）行读取专用接口，查询/编辑之前调用。|
     * |AJAX_BATCH_DELETE_URI|ajax.batch.delete.uri|（DELETE）批量删除专用方法。|
     * |AJAX_BATCH_UPDATE_URI|ajax.batch.update.uri|（PUT）批量更新专用方法。|
     * |AJAX_EXPORT_URI|ajax.file.export|（POST）导出文件。|
     * |AJAX_IMPORT_URI|ajax.file.import|（POST）导入文件。|
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
        SEARCH_CONFIRM_CLEAR: 'search.confirm.clear',       /* 清除专用消息提示 */

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
        // 插件
        PLUGIN_ROW_EDITION: "plugin.row.edition",           /* 插件 */
    },
    /**
     * ## `Ex.Mode`
     *
     * 列表界面的基础模式常量定义
     *
     * |属性名|值|含义|
     * |:---|:---|:---|
     * |LIST|list|列表基础模式，不打开任何表单，只显示列表详细信息。|
     * |ADD|add|添加模式，打开添加表单专用，会影响表单模式，并且无读取记录。|
     * |EDIT|edit|编辑模式，打开编辑表单专用。|
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
     * ### 1. 特殊变量值
     *
     * |属性名|值|含义|
     * |:---|:---|:---|
     * |TYPE_TABULAR|zero.tabular|「元数据」字典`X_TABULAR`的分类值。|
     * |TYPE_CATEGORY|zero.category|「元数据」分类本身`X_CATEGORY`的分类值。|
     * |TYPE_IDENTITY|zero.identity|「元数据」档案数据`E_IDENTITY`的分类值。|
     * |TYPE_CUSTOMER|zero.customer|「元数据」客户数据`E_CUSTOMER`的分类值。|
     * |TYPE_COMPANY|company.nature|「元数据」公司`E_COMPANY`的分类值。|
     *
     * ### 2. 资源树分类
     *
     * > 多维度分类资源树
     *
     * #### 2.1. 内/外
     *
     * |属性名|值|含义|
     * |:---|:---|:---|
     * |PERM_TREE_SYSTEM|resource.ambient <br> resource.security <br> resource.ui <br> resource.engine <br> resource.organization | Zero扩展模块资源权限树值。|
     * |PERM_INTEGRATION|resource.integration|集成模块资源权限树值。|
     *
     * #### 2.2. 权限分页
     *
     * 剩余的一个变量为`PERM_PAGE`，该变量从另外一个维度区分资源树。
     *
     * |属性名|值|含义|
     * |:---|:---|:---|
     * |DEV|resource.ui <br> resource.engine <br> resource.integration|开发实施权限。|
     * |SYS|resource.ambient <br> resource.security <br> resource.organization|平台业务权限。|
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