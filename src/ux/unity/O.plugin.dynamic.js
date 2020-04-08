import Abs from '../abyss';

/**
 * ## 特殊函数「Zero」
 *
 * 记录状态计算插件，根据数据记录中的 `metadata` 节点计算记录的状态信息，以辅助当前记录数据
 * 是否可编辑、是否可删除。
 *
 * 状态结构如下：
 *
 * ```json
 * {
 *     edition: "是否可编辑",
 *     deletion: "是否可删除"
 * }
 * ```
 *
 * @memberOf module:_plugin
 * @param {Object} record 数据记录信息。
 * @param {ReactComponent} reference React组件引用。
 * @return {Object} 返回状态信息。
 */
const pluginMetadata = (record = {}, reference) => {
    const {metadata} = record;
    const status = {};
    if (Abs.isEmpty(metadata)) {
        /*
         * 没有 metadata（metadata为 null 或 empty
         */
        status.edition = true;
        status.deletion = true;
    } else {
        /*
         * 没有时也使用 true
         */
        if (metadata.hasOwnProperty('edition')) {
            status.edition = metadata.edition;
        } else {
            status.edition = true;
        }
        if (metadata.hasOwnProperty('deletion')) {
            status.deletion = metadata.deletion;
        } else {
            status.deletion = true;
        }
    }
    return status;
};
/**
 * ## 特殊函数「Zero」
 *
 * 执行插件函数的专用方法，计算记录状态，内部很多位置直接调用，如果不传入 `$plugins` 对应的函数名，
 * 则直接调用 `pluginMetadata` 函数计算记录状态。
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @param {String} name 执行插件函数的名称。
 * @param {Object} record 数据记录对象。
 * @return {{}|boolean} 返回数据记录，以及返回 false 表示记录为只读。
 */
const pluginFn = (reference, name = "", record = {}) => {
    if (name) {
        const {$plugins = {}} = reference.props;
        const executor = $plugins[name];
        if (executor && Abs.isFunction(executor)) {
            return executor(record, reference);
        } else {
            return pluginMetadata(record, reference);
        }
    } else return false; /* 没设置名称 */
};
/**
 * ## 特殊函数「Zero」
 *
 * 内部调用 `pluginForm` 计算当前表单相关状态，主要计算只读还是可编辑。
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @return {boolean} 返回当前表单是否可编辑的直接状态。
 */
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
/**
 *
 * ## 特殊函数「Zero」
 *
 * 计算表单中的字段信息的状态，主要计算可编辑和可删除状态：
 *
 * * edition：可编辑。
 * * deletion：可删除。
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @return {{}|boolean} 返回当前字段的状态信息。
 */
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
/**
 * ## 特殊函数「Zero」
 *
 * 计算表格中多选框的状态信息，只有可编辑可删除不禁用，否则禁用多选框。
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} record 数据记录对象。
 * @return {Object} 计算当前记录状态。
 */
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
/**
 * ## 特殊函数「Zero」
 *
 * 生成界面中每一行的两个特殊按钮：
 *
 * 1. 可编辑，则显示"编辑"按钮。
 * 2. 可删除，则显示"删除"按钮。
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} record 数据记录对象。
 * @return {Object} 状态。
 */
const pluginOp = (reference, record = {}) => {
    const calculated = pluginFn(reference, "pluginRow", record);
    if (calculated) {
        return calculated;
    } else {
        return {edition: true, deletion: true}
    }
};
/**
 * ## 特殊函数「Zero」
 *
 * 表单状态计算函数。
 *
 * ```js
 *      const $edition = Ux.pluginForm(this);
 * ```
 *
 * @memberOf module:_plugin
 * @param {ReactComponent} reference React组件引用。
 * @return {boolean|{}} 返回当前表单的状态信息（可编辑、只读、部分只读）。
 */
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
     * 核心插件函数
     */
    pluginMetadata,
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