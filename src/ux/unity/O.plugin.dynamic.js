import Abs from '../abyss';

const pluginFn = (reference, name = "", record = {}) => {
    if (name) {
        const {$plugins = {}} = reference.props;
        const executor = $plugins[name];
        if (executor && Abs.isFunction(executor)) {
            return executor(record, reference);
        } else return false; /* 插件函数有问题 */
    } else return false; /* 没设置名称 */
};
const pluginEdition = (reference) => {
    const {$inited = {}, $plugins = {}} = reference.props;
    if (!$plugins.pluginForm) {
        /*
         * 没有 pluginForm，可编辑
         */
        return true;
    } else {
        const calculated = pluginFn(reference, "pluginForm", $inited);
        if (calculated) {
            return calculated['edition'];
        } else {
            /*
             * 无法计算，可编辑
             */
            return true;
        }
        ;
    }
};
const pluginField = (reference) => {
    const {$inited = {}, $plugins = {}} = reference.props;
    if (!$plugins['pluginField']) {
        /*
         * 不启用
         */
        return {};
    } else {
        const calculated = pluginFn(reference, 'pluginField', $inited);
        if (calculated) {
            return calculated;
        } else {
            return {};
        }
    }
};
const pluginSelection = (reference, record = {}) => {
    const props = {};
    const calculated = pluginFn(reference, 'pluginRow', record);
    if (calculated) {
        /*
         * 计算 {
         *     "selection"
         * }
         */
        const {selection = true} = calculated;
        props.disabled = !selection;
    } else {
        /*
         * 直接 false，未启用
         */
        props.disabled = false;
    }
    return props;
};
const pluginOp = (reference, record = {}) => {
    const calculated = pluginFn(reference, "pluginRow", record);
    if (calculated) {
        return calculated;
    } else {
        return {edition: true, deletion: true}
    }
};
const pluginForm = (reference) => {
    const edition = pluginEdition(reference);
    if (edition) {
        /*
         * 考虑字段只读
         */
        return pluginField(reference);
    } else {
        /*
         * 全 form 只读
         */
        return edition;
    }
};
export default {
    /*
     * 行选择处理
     * 检查 selection
     */
    pluginSelection,
    /*
     * 行 编辑 / 删除
     * 检查 edition / deletion
     */
    pluginOp,
    /*
     * 表单编辑计算
     * 检查 edition
     */
    pluginEdition,
    /*
     * 表单编辑计算
     * 检查 edition
     * 如果 edition = true，检查 pluginField 计算是否存在部分编辑
     */
    pluginForm,
    /*
     * 直接表单编辑计算
     * 检查 pluginField 计算是否存在部分编辑
     */
    pluginField,
}