import Ex from "ex";
import U from 'underscore';

export default (reference, config = {}) => {
    /*
     * 读取选项，构造插件
     */
    const {options = {}} = config;
    const plugins = {};
    /*
     * 行过滤专用插件，插件名称
     * pluginRow
     */
    const pluginFn = Ex.sexExPlugin(reference, options, Ex.Opt.PLUGIN_ROW_EDITION);
    if (pluginFn) {
        plugins.pluginRow = pluginFn;
    }
    /*
     * 表单字段专用
     */
    const {pluginField} = reference.props;
    if (U.isFunction(pluginField)) {
        const pluginFieldFn = pluginField(reference);
        if (U.isFunction(pluginFieldFn)) {
            plugins.pluginField = pluginFieldFn;
        }
    }
    return plugins;
}