import Ux from "ux";
import {Fn, rxClose} from './I.list.options';
import yoAmbient from '../yo.ambient';

export default (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = rxClose(reference, item, false);
    formAttrs.rxView = Fn.rxView(reference);
    /*
     * 设置 state -> $dirty
     */
    formAttrs.doDirty = Fn.rxDirty(reference);
    formAttrs.doSubmitting = Fn.rxSubmitting(reference);
    formAttrs.$mode = Ux.Env.FORM_MODE.EDIT;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}} = reference.state;
    if (options[Fn.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    /*
     * 设置表单初始值
     */
    const {$inited = {}, $rowData} = reference.state;
    formAttrs.$inited = $inited;
    /*
     * 表单编辑的优雅转换
     *
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginRow)) {
        /*
         * 标准的编辑内容
         */
        $plugins.pluginForm = plugins.pluginRow;
    }
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    /*
     * 设置基础查询条件
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 合并执行
     * 1. 从 formAttrs 中提取 $record 专用上层变量
     * 2. 在 $record 变量中挂载 rowData 属性
     * 3. 将 $record 直接传入到底层数据中
     */
    if (!formAttrs.$record) formAttrs.$record = {};
    if ($rowData) formAttrs.$record.rowData = $rowData;
    return formAttrs;
}