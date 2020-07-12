/**
 * ## 扩展函数
 *
 * 生产日志器专用解析器，返回不同日志器记录日志（每个键都是函数）：
 *
 * ```js
 * {
 *     private: () => "私有组件",
 *     form: () => "表单组件",
 *     list: () => "列表专用",
 *     action: () => "操作组件",
 *     tpl: () => "模板",
 *     component: () => "通用组件",
 *     container: () => "容器组件",
 *     page: () => "页面组件",
 *     type: () => "分类处理",
 *     control: () => "控件",
 *     dynamic: () => "动态组件",
 *     view: () => "视图组件",
 *     define: () => "定义组件"
 * }
 * ```
 *
 * @memberOf module:_parser
 * @method parserOfColor
 * @param {String} name 组件名称
 * @returns {Object}
 * */
export default (name = "") => ({
    private: (state = {}) => ({name, color: "#CD9B1D", ...state}), // 私有组件
    // extension 部分
    form: (state = {}) => ({name, color: "#6959CD", ...state}),    // 表单
    list: (state = {}) => ({name, color: "#104E8B", ...state}),    // 列表
    action: (state = {}) => ({name, color: "#009ACD", ...state}),  // 操作（按钮类）
    tpl: (state = {}) => ({name, color: "#93c", ...state}),     // 模板
    component: (state = {}) => ({name, color: "#228B22", ...state}),     // 公有组件
    // 非 extension 部分
    container: (state = {}) => ({name, color: "#1C86EE", ...state}),    // 容器
    page: (state = {}) => ({name, color: "#1874CD", ...state}),         // 页面
    type: (state = {}) => ({name, color: "#4F94CD", ...state}),
    control: (state = {}) => ({name, color: "#2E8B57", ...state}),          // 自定义组件
    dynamic: (state = {}) => ({name, color: "#8B6914", ...state}),          // 动态
    view: (state = {}) => ({name, color: "#CDAD00", ...state}),          // 动态
    define: (state = {}) => ({name, color: "#7CCD7C", ...state}),               // 用户自定义
})