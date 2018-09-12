const _visitChild = (item = {}, keys = []) => {
    keys.push(item.key);
    item.children.forEach(each => _visitChild(each, keys));
    return keys;
};
const visitChildren = (item = {}) => {
    const keys = [];
    _visitChild(item, keys);
    return keys;
};
const visitParent = (item = {}, array = []) => {

};
export default {
    visitChildren,
    visitParent,
}