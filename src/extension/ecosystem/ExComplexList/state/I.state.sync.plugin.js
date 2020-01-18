import Ex from "ex";

export default (reference, config = {}) => {
    const {options = {}} = config;
    const plugins = {};
    /*
     * 行过滤专用
     */
    const pluginFn = Ex.sexExPlugin(reference, options, Ex.Opt.PLUGIN_ROW_EDITION);
    if (pluginFn) {
        plugins.pluginRow = pluginFn;
    }
    return plugins;
}