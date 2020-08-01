import Ex from 'ex';
import Ux from 'ux';

export default (reference) => {
    const attrs = Ex.yoDynamic(reference);
    /*
     * 提取选项
     */
    const {options = {}} = reference.state;
    const config = {};
    const {$options} = reference.props;
    const replaced = {};
    if ($options) {
        Object.assign(replaced, options, $options)
    }
    attrs.$options = replaced;
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
    const {$filters = {}, $filtersRaw = {}} = reference.state;
    if ($filtersRaw) {
        /*
         * 引入组件过后的操作
         */
        if ("object" === typeof $filtersRaw) {
            attrs.$inited = $filtersRaw;
        } else {
            attrs.$inited = {};
        }
    } else {
        attrs.$inited = $filters;
    }
    /*
     * 清空按钮专用状态
     */
    attrs.$disableClear = (0 === Object.keys($filters).length);
    attrs.rxClose = (event) => Ux.prevent(event);
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