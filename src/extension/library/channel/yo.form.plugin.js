import Ux from 'ux';

export default (addOn = {}, reference) => {
    /*
     * addOn.form 基本内容
     * 编程传入专用
     */
    const program = Ux.clone(addOn.form);
    /*
     * 输入专用处理：
     * 1）addOn.form：通过编程部分拿到的 form 信息
     * 2）S0（前端静态文件）_form：前端静态配置（主配置）——通常静态form使用此配置
     * 3）S1（前端静态文件）_formUp：前端静态配置（辅助配置）
     * 4）S2（前端静态文件）_formDown：前端静态配置（辅助配置）
     * 5）D0（后端处理）form：后端主配置
     * 6）D1（后端处理）formDown：后端主配置
     * 7）D2（后端处理）formUp：后端主配置
     * 布局专用处理
     * 1）（S0）标准前端静态
     * 2）（S0 + D0）：前端静态 + 后端主配置
     * 3）（S1 + S0/D0 + S2）：静态 + 动/静 + 静态
     */
    const sForm = Ux.fromHoc(reference, "form");
    const sFormUp = Ux.fromHoc(reference, "formUp");
    const sFormDown = Ux.fromHoc(reference, "formDown");
    /*
     * 合并处理函数，主要处理合并
     */
    const {$options = {}} = reference.props;
    let form = {}, formUp = {}, formDown = {};
    if (!Ux.isEmpty($options)) {
        /*
         * 抽取 $options 中的后端配置
         */
        form = $options.form;
        formUp = $options['formUp'];
        formDown = $options['formDown'];
    }
    /*
     * 最终合并
     * 按顺序合并表单处理
     * [
     *     program, 
     *     sFormUp, formUp,
     *     sForm, form,         // 主单据（常用）
     *     sFormDown, formDown
     * ]
     */
    let normalized = {};
    [
        program,
        sFormUp, formUp,
        sForm, form,
        sFormDown, formDown
    ]
        .filter(item => !!item)
        .filter(Ux.isObject)
        .forEach(form => normalized = Ux.toForm(normalized, form));
    /*
     * normalized 的最终处理
     */
    return normalized;
}