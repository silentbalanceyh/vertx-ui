import __Zn from './zero.module.dependency';

const pluginMetadata = (record = {}, reference) => {
    const {metadata} = record;
    const status = {};
    if (__Zn.isEmpty(metadata)) {
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
const pluginFn = (reference, name = "", record = {}) => {
    if (name) {
        const {$plugins = {}} = reference.props;
        const executor = $plugins[name];
        if (executor && __Zn.isFunction(executor)) {
            return executor(record, reference);
        } else {
            return pluginMetadata(record, reference);
        }
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
    /*
     * 如果 disabled = false，进一步处理，该函数仅计算
     */
    const {$plugins = {}} = reference.props;
    if (!props.disabled && __Zn.isFunction($plugins.koSelection)) {
        props.disabled = $plugins.koSelection(record, reference);
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

const pluginKoFn = (reference, record, actions = [], name) => {
    const {$plugins = {}} = reference.props;
    let fnFilter = () => true;
    if (__Zn.isFunction($plugins[name])) {
        fnFilter = (config) => $plugins[name](record, config, reference);
    }
    return actions
        .filter(item => "string" !== typeof item)
        .filter(fnFilter);
}
const pluginKoRow = (reference, record, actions = []) =>
    pluginKoFn(reference, record, actions, "koRow")
const pluginKoAdd = (reference, record, actions = []) =>
    pluginKoFn(reference, record, actions, "koAdd")
const pluginKoEdit = (reference, record, actions = []) =>
    pluginKoFn(reference, record, actions, "koEdit")
const pluginKoBatch = (reference, actions = []) =>
    pluginKoFn(reference, {}, actions, "koBatch")
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // ----------------------- 「启用/禁用」--------------------------
    pluginKoRow,
    pluginKoAdd,
    pluginKoEdit,
    pluginKoBatch,
    // ----------------------- 「启用/禁用」--------------------------
    /*
     * 「表格行选择项」（启用/禁用）
     * 行选择处理
     * 检查 selection，不过这个方法只检查当前操作按钮的以下两种状态：
     * 1. 启用
     * 2. 禁用
     * 该方法不处理显示/隐藏等问题。
     * 内置包含了 koSelection（启用/禁用）
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginRow
     * 2）函数签名：pluginRow(record, reference）
     */
    ////// pluginRow
    pluginSelection,
    /*
     * 「表格行/表单内」（启用/禁用）
     * 行 编辑 / 删除
     * 检查 edition / deletion
     * 1. 表格中的行编辑/删除
     * 2. 表单内的记录编辑/删除
     *
     * 这两个操作会统一处理。
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginRow
     * 2）函数签名：pluginRow(record, reference）
     */
    ////// pluginRow
    pluginOp,
    // ----------------------- 「编辑/删除」--------------------------
    /*
     * 表单编辑计算
     * 检查 edition
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginForm
     * 2）函数签名：pluginForm(record, reference）
     */
    ////// pluginForm -> pluginField
    pluginEdition,
    /*
     * 核心插件函数
     * 属性 metadata 处理
     *
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     * 单独检查记录中的 metadata 部分的数据
     */
    pluginMetadata,
    /*
     * 表单编辑计算（全表单）
     * 检查 edition
     * 如果 edition = true，检查 pluginField 计算是否存在部分编辑
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     */
    ////// pluginForm -> pluginField
    pluginForm,
    /*
     * 直接表单计算（单字段）
     * 检查 pluginField 计算是否存在部分编辑
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     */
    ////// pluginField
    pluginField,
    // ----------------------- 「显示/隐藏」--------------------------
}