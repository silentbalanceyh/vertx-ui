import __Zu from 'zet';
// =====================================================
// 页签
// =====================================================

/**
 * ## 「2阶」`Ex.rxTabAdd`
 *
 * 新增 Tab 页专用函数
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabAdd = (reference) =>
    __Zu.rxTabAdd(reference);
/**
 * ## 「2阶」`Ex.rxTabClose`
 *
 * 关闭 Tab 页专用函数
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabClose = (reference) =>
    __Zu.rxTabClose(reference);
/**
 * ## 「2阶」`Ex.rxTabEdit`
 *
 * 编辑 Tab 页专用函数
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabEdit = (reference) =>
    __Zu.rxTabEdit(reference);
/**
 * ## 「2阶」`Ex.rxTabOpen`
 *
 * 打开 Tab 页专用函数
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabOpen = (reference) =>
    __Zu.rxTabOpen(reference);

// const rxCondition = (reference, isClear = false) =>
//     __Zu.rxCondition(reference, isClear);
/**
 * ## 「2阶」`Ex.rxViewQ`
 *
 * ### 1.基本介绍
 *
 * 基础搜索 / 高级搜索专用函数，该函数会包含两部分输入：
 *
 * 1. 执行过查询条件处理过后的过滤条件`$filters`。
 * 2. 原始查询条件（规范化之前）`$filtersRaw`（可选）。
 *
 * ### 2.核心
 *
 * #### 2.1.$filtersRaw
 *
 * 在某些特定场景中，原始查询条件可追踪当前组件专用查询条件集合，所以除了规范化过后的查询条件以外，该函数提供了二义性输入。
 *
 * #### 2.2.$filters
 *
 * $filters状态变量在列表组件中只存在于基础搜索（搜索框）和高级搜索（查询表单），列过滤的搜索条件有另外的变量来完成。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxViewQ = (reference) =>
    __Zu.rxViewQ(reference);
// =====================================================
// 批量
// =====================================================
/**
 * ## 「2阶」`Ex.rxBatchDelete`
 *
 * ### 1.基本介绍
 *
 * 批量删除函数专用，根据options中的批量删除配置`ajax.batch.delete.uri`执行批量删除函数，该函数会触发批量操作。
 *
 * ### 2.使用场景
 *
 * #### 2.1.调用代码
 *
 * （无）
 *
 * #### 2.2.操作执行
 *
 * 1. 调用`Ux.sexBatch`从批量选择数据中读取被选择的主键集。
 * 2. 使用被选中的主键集调用批量删除接口执行批量删除。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchDelete = (reference) =>
    __Zu.rxBatchDelete(reference);

// =====================================================
// 列操作
// =====================================================
/**
 * ## 「2阶」`Ex.rxColumn`
 *
 * ### 1.基本介绍
 *
 * 全列视图函数专用，直接根据`options`中的配置`ajax.column.full`执行模型下的全列读取，读取模式分：
 *
 * 1. 静态列`dynamic.column = false`（默认值），直接返回配置列信息，前端静态列配置。
 * 2. 动态列`dynamic.column = true`，直接返回动态配置列信息，动态列配置。
 *
 * ### 2.核心
 *
 * #### 2.1.增强列表
 *
 * 增强视图主要包含三个核心功能：
 *
 * 1. 读取模型关联视图全列。
 * 2. 读取定义好的我的视图列。
 * 3. 针对2中读取的我的试图列进行保存，创建新视图（目前版本只支持单视图）。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumn = (reference, config = {}) =>
    __Zu.rxColumn(reference, config);
/**
 * ## 「2阶」`Ex.rxColumnMy`
 *
 * ### 1.基本介绍
 *
 * 我的视图函数专用，直接根据`options`中的配置`ajax.column.my`执行模型下的我的视图列读取。
 *
 * 1. 我的视图列不执行双模式，所有模式都可支持我的视图保存。
 * 2. 目前只有每个列表单视图操作，后期扩展多视图模式。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumnMy = (reference, config = {}) =>
    __Zu.rxColumnMy(reference, config);

// =====================================================
// 搜索
// =====================================================
/**
 * ## 「2阶」`Ex.rxSearch`
 *
 * ### 1.基本介绍
 *
 * 搜索专用函数（列表组件主函数），它根据`ajax.search.uri`执行搜索，参数格式如：
 *
 * ```json
 * {
 *     "criteria": {},
 *     "sorter": [],
 *     "pager":{
 *         "page": 1,
 *         "size": 10
 *     },
 *     "projection": []
 * }
 * ```
 *
 * 参数格式参考Qr的格式语法。
 *
 * ### 2.核心
 *
 * 内置调用了`switcher`执行从状态state到属性props中的函数检索，检索合法时调用该函数，无法找到函数则抛出异常。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSearch = (reference) =>
    __Zu.rxSearch(reference);
/**
 * ## 「2阶」`Ex.rxMyViewV`
 *
 * ### 1.基本介绍
 *
 * 该函数为`rxColumnMy`的逆函数，此处不做多余说明，根据`options`中的`ajax.column.save`执行我的视图保存。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxMyViewV = (reference) =>
    __Zu.rxMyViewV(reference);
/**
 ## 「2阶」`Ex.rxMyViewQ`
 *
 * @memberOf module:rx/utter
 * @param reference
 * @returns {*}
 */
const rxMyViewQ = (reference) =>
    __Zu.rxMyViewQ(reference);
/**
 * ## 「2阶」`Ex.rxViewV`
 *
 * ### 1.基本介绍
 *
 * 根据系统中存储的`$columns/$columnsMy`执行视图层的列过滤专用函数，该函数内部存储了**全列**，根据传入的试图列构造新的查询视图。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxViewV = (reference) =>
    __Zu.irViewV(reference);
// =====================================================
// 行操作
// =====================================================
/**
 * ## 「2阶」`Ex.rxDelete`
 *
 * ### 1.基本介绍
 *
 * 执行`options`配置中的`ajax.delete.uri`专用函数，从后端执行删除。
 *
 * ### 2.下层调用
 *
 * #### 2.1.调用代码
 *
 * ```js
 * Ex.?x(reference).delete(...);
 * ```
 *
 * #### 2.2.删除模式
 *
 * 删除模式主要在服务端实现而不是客户端
 *
 * 1. 物理删除：SQL语句执行DELETE语句真实删除数据（可以删除同时做备份和变更历史）。
 * 2. 逻辑删除：仅仅执行UPDATE语句更新某个标记位数据。
 *
 * #### 2.3.删除的影响
 *
 * 对列表而言，如果删除了某条记录而这条记录又在选择项中，则需要将`$selected`变量中选中项移除。
 *
 * #### 2.4.删除回调
 *
 * 系统提供了`rxPostDelete`函数用于执行删除回调操作，该操作位于删除之后执行（编程回调）。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxDelete = (reference) =>
    __Zu.rxDelete(reference);
/**
 * ## 「2阶」`Ex.rxView`
 *
 * ### 1.基本介绍
 *
 * 查询记录专用函数，用于查询当前系统中的记录（双击选中），直接执行`options`中的`ajax.get.uri`数据读取。
 *
 * ### 版本更新
 *
 * 1. 版本1：只能使用`:key`参数读取数据记录。
 * 2. 版本2：新增了可使用其他字段（唯一字段）来读取数据记录。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxView = (reference) =>
    __Zu.rxView(reference);
/**
 * ## 「2阶」`Ex.rxSelected`
 *
 * ### 1.基本介绍
 *
 * 多选专用函数，该函数的基础封装仅执行一个操作，调用上层的`rxPostSelected`回调函数。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSelected = (reference) =>
    __Zu.rxSelected(reference);
// =====================================================
// 导入导出专用
// =====================================================
/**
 * ## 「2阶」`Ex.rxExport`
 *
 * ### 1.基本介绍
 *
 * 导出函数专用，根据`options`中的`ajax.export.uri`执行导出操作。
 *
 * 1. 导出函数必须传入基础参数集：标识应用、模型、查询条件。
 * 2. 查询条件直接走查询引擎，内置调用`Ux.ajaxPull`的下载函数（带权限）。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxExport = (reference) =>
    __Zu.rxExport(reference);
/**
 * ## 「2阶」`Ex.rxImport`
 *
 * ### 1.基本介绍
 *
 * 导入专用函数，根据`options`中的`ajax.import.uri`执行导入操作。
 *
 * 1. 导入函数必须传入`File`参数（上传文件）
 * 2. 内置调用`Ux.ajaxUpload`的上传函数（带权限）。
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxImport = (reference) =>
    __Zu.rxImport(reference);
/**
 * ## 「2阶」`Ex.rxBatchEdit`
 *
 * ### 1.基本介绍
 *
 * 批量更新函数专用，根据options中批量更新配置`ajax.batch.update.uri`执行批量更新函数，该函数会触发批量操作。
 *
 * ### 2.下层调用
 *
 * #### 2.1.调用代码
 *
 * ```js
 * // 调用 rxBatchEdit 方法
 * Ex.?x(reference).batchEdit(...);
 * ```
 *
 * @memberOf module:rx/utter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchEdit = (reference, config = {}) =>
    __Zu.rxBatchEdit(reference, config);
// =====================================================
// 扩展专用函数
// =====================================================
/**
 * ## 「1阶」`Ex.rsOpened`
 *
 * ### 1.基本介绍
 *
 * $opened 生成函数，根据最终传入的`opened`生成不同函数，等价于生成:
 *
 *
 * ```js
 * // 修改组件打开状态
 * () => reference.setState({$opened: true});
 *
 * // 修改组件关闭状态
 * () => reference.setState({$opened: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.使用场景
 *
 * 这个函数通常只在`<Tabs/>`组件中使用，修改了`$opened=true`时，可直接打开页签，而点击关闭后，则直接将页签关掉。
 *
 * `$opened`和`$visible`为最初设计的不同场景的打开和关闭状态，而后续很多组件直接使用了`$visible`而忽略掉`$opened`。
 *
 * @memberOf module:rs/utter
 * @deprecated
 * @param reference
 * @param opened
 * @returns {function(*=): void}
 */
const rsOpened = (reference, opened = true) =>
    __Zu.rsOpened(reference, opened);
/**
 * ## 「2阶」`Ex.rxRowOpen`
 *
 * @memberOf module:rx/utter
 * @param reference
 * @param config
 * @returns {*}
 */
const rxRowOpen = (reference, config = {}) =>
    __Zu.rxRowOpen(reference, config);
export default {
    rsOpened,
    // 新版本
    rxSubmitting: (reference) => __Zu.rxSubmitting(reference),
    /**
     * ## 「1阶」`Ex.rxPostClose`
     *
     * ### 1.基本介绍
     *
     * 打开Tab页后置回调函数，设置 $opened = true。
     *
     * @memberOf module:rx/utter
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostClose: (reference) => __Zu.rxPostClose(reference),
    /**
     * ## 「1阶」`Ex.rxPostClose`
     *
     * ### 1.基本介绍
     *
     * 关闭Tab页后置回调函数，设置 $opened = false。
     *
     * @memberOf module:rx/utter
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostOpen: (reference) => __Zu.rxPostOpen(reference),
    /**
     * ## 「1阶」`Ex.rxAssist`
     *
     * ### 1.基本介绍
     *
     * rxAssist用于更改组件状态state中的专用辅助数据，它支持两种模式：
     *
     * 1. 添加/更新：使用添加更新模式`deleted=false`（默认），直接追加和更新辅助数据信息。
     * 2. 删除：使用删除模式`deleted=true`（传入），直接删除输入记录及。
     *
     * ### 2.下层调用
     *
     * #### 2.1.调用代码
     *
     * ```js
     * // 执行 deleted = false 添加更新辅助数据
     * Ex.?x(reference).assistIn(...);
     *
     * // 执行 deleted = true 删除更新辅助数据
     * Ex.?x(reference).assistOut(...);
     * ```
     *
     * > rx系列方法和rs系列方法并不对等，因为rs是为了生成函数专用方法，有可能一个方法生成两个函数。
     *
     *
     * @memberOf module:rx/utter
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxAssist: (reference) => __Zu.rxAssist(reference),
    // rxVisible: (reference) => __Zu.rxVisible(reference),

    rxBatchDelete,
    rxBatchEdit,
    rxTabAdd,    // 打开一个新的 Tab 页
    rxTabClose,  // 关闭当前 Tab 页，如果需要刷新则第二参 $dirty = true
    rxTabEdit,   // 切换到 Edit 的 Tab 页
    rxTabOpen,   // 打开一个新的 Tab 页（带数据）


    rxSearch,
    /*
     * 针对列过滤的两种动作（设置/清除）
     * 清空动作：
     * 1）点击：__BTN_CLEAR_<field> 的按钮（列过滤同步）
     * 2）设置：$condition
     * 设置动作：
     * 1）直接设置 $condition
     */
    // rxCondition,
    /*
     * 设置 $filters
     * 1）透过表单提交处理 $filters 的最终信息
     * 2）基础搜索 / 高级搜索（共享）
     */
    rxViewQ,

    // 列操作
    /* 可外置传入 */ rxColumn,
    /* 可外置传入 */ rxColumnMy,
    /* 可外置传入 */ rxMyViewV,
    /* 可外置传入 */ rxMyViewQ,
    /* 回调修改状态专用 */ rxViewV,


    // 行操作
    rxDelete,
    rxSelected,
    rxView,
    // 文件导入导出
    rxExport,
    rxImport,
    // 行打开操作专用
    rxRowOpen,
    // Qr相关
    // QxQBE
    /**
     * ## 「2阶」`Ex.rxQrQBE`
     *
     *      $qbe, $qbeDefault
     *
     * @memberOf module:rx/utter
     * @param reference
     * @returns {*}
     */
    rxQrQBE: (reference) => __Zu.rxQrQBE(reference),
    /**
     * ## 「2阶」`Ex.rxQrClean`
     * @memberOf module:rx/utter
     * @param reference
     * @returns {*}
     */
    rxQrClean: (reference) => __Zu.rxQrClean(reference),
    // QxInput / QxRange
    /**
     * ## 「2阶」`Ex.rxQr`
     *
     *     config -> field
     *     $qr.value[field] = value          // For Message
     *     $qr.condition[field] = condition
     *     // 不更改 $query 数据
     *
     * @memberOf module:rx/utter
     * @param reference
     * @param config
     * @returns {*}
     */
    rxQr: (reference, config = {}) => __Zu.rxQr(reference, config),
}