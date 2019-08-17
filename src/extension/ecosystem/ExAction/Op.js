const getType = (item = {}) => {
    let dialogType = "NONE";
    if (item.component) {
        const {type = "NONE"} = item.component;
        dialogType = type;
    }
    return dialogType;
};
export default {
    getType
}