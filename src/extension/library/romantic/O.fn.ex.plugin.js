import Plugin from 'plugin';
import U from 'underscore';
import Ux from 'ux';

export default (reference, options = {}, key) => {
    const pluginKey = options[key];
    if (pluginKey) {
        /*
         * 如果出现了 pluginKey，则从 Plugin.Function 中读取函数
         * 该函数返回三种信息：
         * {
         *     "selection": 自动计算，edition = true 并且 deletion = true 时可选择
         *     "edition": 默认 true（可编辑）
         *     "deletion": 默认 true（可删除）
         * }
         * 限制，批量编辑和批量删除只能针对 edition / deletion 同时为true的时候，否则这种记录都不可能被
         * 批量操作选中
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