import __PR from './habit.fn.parser.action';
import Ux from 'ux';

const yiListOp = (reference, config = {}, state) => {
    const {
        pluginComponent = {},
        pluginExtension: Plugin = {}
    } = config;
    const {options = {}, component = {}} = config;
    const eventParser = __PR.parserOfEvent(reference);
    const buttonParser = __PR.parserOfButton(reference);
    const plugin = Ux.clone(pluginComponent);
    /*
     * 扩展包 Plugin.Extension 中的插件会覆盖标准插件
     */
    Object.keys(Plugin.Extension).filter(field => field.startsWith("Ex"))
        .forEach(field => plugin[field] = Plugin.Extension[field]);
    const $options = Object.assign({}, options, state.options);
    return buttonParser.parseOp(config, $options)
        /* 按钮配置解析 */
        .then((buttons = {}) => buttonParser.parsePlugin(buttons, options))
        /* 组件解析 */
        .then((buttons = {}) => buttonParser.parseComponent(buttons, options, {
            config: component,
            plugin
        }))
        /* 权限控制统一处理 */
        .then((buttons = {}) => eventParser.parseAuthorized(buttons, options))
        /* 绑定按钮事件 */
        .then((buttons = {}) => eventParser.parseEvent(buttons, options))
}
export default {
    yiListOp,
}