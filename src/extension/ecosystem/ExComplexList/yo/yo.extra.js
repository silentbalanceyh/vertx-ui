import Ex from "ex";
import Opt from '../options';

const {Order = {}} = Opt;

export default (reference) => {
    const editorRef = Ex.yoAction(reference, "op.extra", Order);
    /*
     * $columns：全列
     * $columnsMy：我选择的列
     */
    const {
        options = {},   // 当前状态中保存的 options 配置项
        $columns = [], $columnsMy = []
    } = Ex.state(reference);
    /*
     * 核心配置信息传入
     */
    editorRef.$options = options;
    editorRef.config.forEach((config = {}) => {
        /*
         * 抽取组件配置信息
         */
        const {component = {}} = config;
        const editorRef = component.config;
        /*
         * 每个组件都需要（特殊处理）
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    });
    /*
     * rxColumnSave
     * rxExport
     * 直接的 Ajax方法处理
     */
    editorRef.rxColumnSave = Ex.rxColumnSave(reference);
    editorRef.rxExport = Ex.rxExport(reference);
    editorRef.rxImport = Ex.rxImport(reference);
    /*
     * 不带 Ajax 的专用回调函数，用于 rxColumnSave 的回调
     * 主要是参数需要计算，所以这里只能使用双阶段来处理列保存
     * 1）调用 rxColumnSave 方法
     * 2）执行 rxProjection 的回调（目前支持Table，后期可以考虑支持其他）
     */
    editorRef.rxProjection = Ex.rxProjection(reference);
    editorRef.rxDirty = Ex.rsDirty(reference);
    /*
     * 提交专用函数
     */
    editorRef.doSubmitting = Ex.rxSubmitting(reference);
    /*
     * 计算最新配置
     * ExEditorColumn
     */
    return editorRef;
}