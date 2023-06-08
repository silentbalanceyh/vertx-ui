import __Zp from 'zep';

export default {
    /**
     * ## 「内部类」`Ex.form`
     *
     * 根据 `reference` 执行表单操作
     *
     * ```json
     * {
     *     add: (params) => Promise,
     *     save: (params) => Promise,
     *     remove: (params) => Promise,
     *     filter: (params) => Promise,
     *     query: (params) => Promise,
     *     wizard: (params) => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | add | 添加表单提交 |
     * | save | 保存表单提交 |
     * | remove | 删除表单提交 |
     * | filter | 高级搜索查询条件处理 |
     * | query | 直接搜索表单处理 |
     * | wizard | 步骤表单提交 |
     *
     * 当前API的框架内部调用代码如：
     *
     * ```js
     * import Ex from 'ex';
     *
     * const $opAdd = (reference) => params => Ex.form(reference).add(params, {
     *      uri: "/api/role",
     *      dialog: "added",
     * });
     * ```
     *
     * @memberOf module:hoc/upper
     * @method form
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Object} 返回对象信息
     * */
    form: (reference) =>
        __Zp.form(reference),

    /**
     * ## 「内部类」`Ex.dialog`
     *
     * 根据 `reference` 执行窗口操作
     *
     * ```json
     * {
     *     add: (data) => Promise,
     *     save: (data) => Promise,
     *     saveRow: (data) => Promise,
     *     saveSelected: (data) => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | add | 窗口添加执行 |
     * | save | 窗口保存执行 |
     * | saveRow | 保存当前行 |
     * | saveSelected | 保存当前窗口选择的 |
     *
     * 当前API的框架内部调用代码如：
     *
     * ```js
     * import Ex from 'ex';
     *
     * const $opSaveField = (reference) => params =>
     *      Ex.dialog(reference).saveRow(params);
     * ```
     *
     * @memberOf module:hoc/upper
     * @method dialog
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Object} 返回对象信息
     * */
    dialog: (reference) =>
        __Zp.dialog(reference),


    /**
     * ## 「内部类」`Ex.init`
     *
     * 根据 `reference` 执行初始化
     *
     * ```json
     * {
     *     "company": () => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | company | 企业信息初始化 |
     *
     * @memberOf module:hoc/upper
     * @method init
     * @param {Object|ReactComponent} reference React对应组件引用
     * @returns {Object} 返回最终数据
     */
    init: (reference) =>
        __Zp.init(reference),

    /**
     * ## 「内部类」`Ex.designer`
     *
     * 图编辑器专用（文档暂时不提供）
     *
     * @memberOf module:hoc/upper
     * @param reference
     * @returns {Object}
     */
    designer: (reference) =>
        __Zp.designer(reference),
};