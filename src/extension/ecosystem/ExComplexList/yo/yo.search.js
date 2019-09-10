import Ex from 'ex';

export default (reference) => {
    // const attrs = Ex.yoAction(reference, "op.");
    const attrs = Ex.yoAmbient(reference);
    /*
     * 提取选项
     */
    const {options = {}} = reference.state;
    const config = {};
    attrs.$options = options;
    Object.keys(options)
        .filter(optKey => optKey.startsWith('search'))
        .forEach(optKey => config[optKey] = options[optKey]);
    attrs.config = config;
    /*
     * 表单组件下放
     */
    const {$form = {}} = reference.props;
    attrs.$form = $form;
    /*
     * 查询条件专用处理
     */
    const {$filters = {}} = reference.state;
    attrs.$inited = $filters;
    /*
     * 清空按钮专用状态
     */
    attrs.$disableClear = (0 === Object.keys($filters).length);
    /*
     * 条件修改，注入 fnCondition 函数
     * 外置搜索框处理 $condition 变量（和列筛选呼应）
     * 不改变 $condition 部分的信息，只改动 $filters 相关信息
     */
    // attrs.rxCondition = Ex.rxCondition(reference);
    // attrs.rxQuery = Ex.rxQuery(reference);
    // attrs.rxClean = Ex.rxClean(reference);
    attrs.rxFilter = Ex.rxFilter(reference);
    return attrs;
}