import Ux from 'ux';
import yoAction from '../yo.action';
/*
 * Order 内置
 * Ex 转换成 functions 函数
 */
import {Fn, Order} from './I.list.options';

export default (reference) => {
    const editorRef = yoAction(reference, "op.extra", Order);
    /*
     * $columns：全列
     * $columnsMy：我选择的列
     */
    const {
        $columns = [], $columnsMy = [],
    } = reference.state;
    /*
     * 核心配置信息传入
     */
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
    editorRef.rxColumnSave = Fn.rxColumnSave(reference);
    editorRef.rxExport = Fn.rxExport(reference);
    editorRef.rxImport = Fn.rxImport(reference);
    /*
     * 不带 Ajax 的专用回调函数，用于 rxColumnSave 的回调
     * 主要是参数需要计算，所以这里只能使用双阶段来处理列保存
     * 1）调用 rxColumnSave 方法
     * 2）执行 rxProjection 的回调（目前支持Table，后期可以考虑支持其他）
     */
    editorRef.rxProjection = Fn.rxProjection(reference);
    editorRef.rxDirty = Fn.rsDirty(reference);
    /*
     * 提交专用函数
     */
    editorRef.doSubmitting = Fn.rxSubmitting(reference);
    /*
     * 计算最新配置
     * ExEditorColumn
     */
    return Ux.sorterObject(editorRef);
}