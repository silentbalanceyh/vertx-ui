import Abs from '../abyss';

const pluginRow = (reference, name = "", record = {}) => {
    if (name) {
        const {$plugins = {}} = reference.props;
        const executor = $plugins[name];
        if (executor && Abs.isFunction(executor)) {
            return executor(record, reference);
        } else return false; /* 插件函数有问题 */
    } else return false; /* 没设置名称 */
};
const pluginShield = (reference) => {
    const {$inited = {}, $plugins = {}} = reference.props;
    if (Abs.isEmpty($plugins)) {
        return false;
    } else {
        return pluginRow(reference, "pluginRow", $inited);
    }
};
export default {
    pluginRow,
    pluginShield,
}