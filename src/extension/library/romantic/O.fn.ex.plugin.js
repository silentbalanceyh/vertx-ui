import Plugin from 'plugin';
import U from 'underscore';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 *
 * 如果出现了 pluginKey，则从 Plugin.Function 中读取函数
 * 该函数返回三种信息：
 *
 * ```json
 * {
 *     "selection": 自动计算，edition = true 并且 deletion = true 时可选择
 *     "edition": 默认 true（可编辑）
 *     "deletion": 默认 true（可删除）
 * }
 * ```
 *
 * > 限制，批量编辑和批量删除只能针对 edition / deletion 同时为true的时候，否则这种记录都不可能被批量操作选中
 *
 * @memberOf module:_romantic
 * @method sexExPlugin
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} options 插件配置选项。
 * @param {String} key 读取配置的键。
 * @returns {Function} 返回插件专用处理函数。
 */
export default (reference, options = {}, key) => {
    const pluginKey = options[key];
    if (pluginKey) {
        /*
         */
        let pluginFn = Plugin.Function[pluginKey];
        if (U.isFunction(pluginFn)) {
            pluginFn = pluginFn(reference);
            if (U.isFunction(pluginFn)) {
                return pluginFn;
            }
        }
    } else {
        /*
         * 普通插件专用
         * metadata正式启用：
         * edition = true
         * deletion = true
         */
        return Ux.pluginMetadata;
    }
}