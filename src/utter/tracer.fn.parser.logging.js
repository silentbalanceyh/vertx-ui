const parserOfColor = (name = "") => ({
    // Ix, Tx, Hx
    internal: (state = {}) => ({name, color: "#3CB371", ...state}),            //

    private: (state = {}) => ({name, color: "#CD9B1D", ...state}),      // 私有组件
    // extension 部分
    form: (state = {}) => ({name, color: "#6959CD", ...state}),         // 表单
    list: (state = {}) => ({name, color: "#104E8B", ...state}),         // 列表
    action: (state = {}) => ({name, color: "#009ACD", ...state}),       // 操作（按钮类）
    tpl: (state = {}) => ({name, color: "#93c", ...state}),             // 模板
    component: (state = {}) => ({name, color: "#228B22", ...state}),    // 公有组件
    // 非 extension 部分
    container: (state = {}) => ({name, color: "#1C86EE", ...state}),    // 容器
    page: (state = {}) => ({name, color: "#1874CD", ...state}),         // 页面
    type: (state = {}) => ({name, color: "#4F94CD", ...state}),
    control: (state = {}) => ({name, color: "#2E8B57", ...state}),      // 自定义组件
    dynamic: (state = {}) => ({name, color: "#8B6914", ...state}),      // 动态
    view: (state = {}) => ({name, color: "#CDAD00", ...state}),         // 动态
    define: (state = {}) => ({name, color: "#7CCD7C", ...state}),       // 用户自定义

    // 「Development Toolkit」开发专用颜色
    toolkit: (state = {}) => ({
        name: `Zero.${name}`, color: {
            front: "#76EE00"
        }, ...state
    }),
    // 「Normalized Page」标准化页面专用颜色
    normalize: (state = {}) => ({
        name: `Zero.${name}`, color: {
            front: "#00BEFE"
        }, ...state
    })
});
export default {
    parserOfColor,
}