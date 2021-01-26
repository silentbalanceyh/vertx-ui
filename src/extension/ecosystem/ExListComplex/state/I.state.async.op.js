import Ux from 'ux';
import Ex from 'ex';
import standardPlugin from '../Web.Plugin';
import parserOfEvent from './I.state.async.parser';

import Plugin from 'plugin';

export default (reference, config = {}, state) => {
    const {options = {}, component = {}} = config;
    const eventParser = parserOfEvent(reference);
    const buttonParser = Ex.parserOfButton(reference);
    const pluginComponent = Ux.clone(standardPlugin);
    /*
     * 扩展包 Plugin.Extension 中的插件会覆盖标准插件
     */
    Object.keys(Plugin.Extension).filter(field => field.startsWith("Ex"))
        .forEach(field => pluginComponent[field] = Plugin.Extension[field]);
    const $options = Object.assign({}, options, state.options);
    return buttonParser.parseOp(config, $options)
        /* 按钮配置解析 */
        .then((buttons = {}) => buttonParser.parsePlugin(buttons, options))
        /* 组件解析 */
        .then((buttons = {}) => buttonParser.parseComponent(buttons, options, {
            config: component,
            plugin: pluginComponent
        }))
        /* 权限控制统一处理 */
        .then((buttons = {}) => eventParser.parseAuthorized(buttons, options))
        /* 绑定按钮事件 */
        .then((buttons = {}) => eventParser.parseEvent(buttons, options))
}