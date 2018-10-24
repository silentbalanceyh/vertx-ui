import Init from "./Op.Init";
import Op from "./Op";

const _isCondAdd = (reference, item) => {
    const options = Init.readOptions(reference);
    let result = true;
    if (options['leaf.cond.add']) {
        // 如果叶节点支持带条件添加
        const field = options['leaf.field'];
        if (field) {
            result = item[field];
        } else {
            // 检查函数信息，启用rxCondAdd时不能开启leaf.field
            const {rxCondAdd = () => true} = reference.props;
            result = rxCondAdd(item);
        }
    }
    return result;
};
const isPreAdd = (reference, item) => {
    const options = Init.readOptions(reference);
    // 先检查叶节点添加功能
    const checked = _isCondAdd(reference, item);
    if (!checked) return false;
    // 检查条件通过过后才执行后续的检查流程
    const level = options.hasOwnProperty("tree.level") ? options['tree.level'] : 1000;
    if (isDialog(reference)) {
        return (item._level <= level);
    } else {
        const {iKey} = reference.state;
        return !iKey && (item._level <= level);
    }
};
const isPreEdit = (reference, item) => {
    if (isDialog(reference)) {
        return "_ROOT_" !== item.key;
    } else {
        const {iKey} = reference.state;
        return !iKey && "_ROOT_" !== item.key;
    }
};
const isFast = (reference, item) => {
    if (isDialog(reference)) {
        return false;
    } else {
        const {iKey} = reference.state;
        return iKey === item.key;
    }
};
const isVisible = (reference, item, isAdd = true) => {
    const {iKey, iAdd} = reference.state;
    return iKey === item.key && iAdd === isAdd;
};
const isDialog = (reference) => {
    const options = Init.readOptions(reference);
    return options["tree.dialog.mode"];
};

const isEnableRowAdd = (reference) => {
    const options = Op.readOptions(reference);
    let disabled = false;
    if (options['row.add.leaf']) {
        const {$add} = reference.props;
        disabled = !$add._("enabled");
    }
    return disabled;
};
export default {
    isDialog,
    isFast,
    isPreAdd,
    isPreEdit,
    isEnableRowAdd,
    isVisible
};