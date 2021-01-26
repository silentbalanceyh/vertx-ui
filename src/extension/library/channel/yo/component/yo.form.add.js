import Ux from 'ux';
import yoAmbient from '../yo.ambient';
import {Fn, rxClose} from './I.list.options';

export default (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = rxClose(reference, item);
    /*
     * 设置 state -> $dirty 的函数
     */
    formAttrs.doDirty = Fn.rxDirty(reference);
    formAttrs.doSubmitting = Fn.rxSubmitting(reference);
    /*
     * 设置唯一的 $addKey
     * 这个值就是 Tab 中的 activeKey
     */
    formAttrs.$addKey = item.key;
    formAttrs.$mode = Ux.Env.FORM_MODE.ADD;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}} = reference.state;
    if (options[Fn.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    /*
     * 提供 $query 用于处理特殊条件
     * Tabular / Category
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 插件
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    return formAttrs;
}