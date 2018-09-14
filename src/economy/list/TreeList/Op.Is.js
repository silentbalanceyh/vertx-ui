import Init from "./Op.Init";

const isPreAdd = (reference, item) => {
    const options = Init.readOptions(reference);
    const level = options.hasOwnProperty("tree.level") ? options['tree.level'] : 1000;
    const {iKey} = reference.state;
    return !iKey && (item._level <= level);
};
const isPreEdit = (reference, item) => {
    const {iKey} = reference.state;
    return !iKey && "_ROOT_" !== item.key;
};
const isFast = (reference, item) => {
    const options = Init.readOptions(reference);
    if (options["tree.dialog.mode"]) {
        return false;
    } else {
        return isVisible(reference, item);
    }
};
const isVisible = (reference, item) => {
    const {iKey} = reference.state;
    return iKey === item.key;
};
const isDialog = (reference) => {
    const options = Init.readOptions(reference);
    return options["tree.dialog.mode"];
};

export default {
    isDialog,
    isFast,
    isPreAdd,
    isPreEdit,
    isVisible
}