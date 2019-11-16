import Ux from 'ux';

export default (reference, config = {}) => {
    const treeAttrs = {};
    const {selection = {}} = config;
    Object.assign(treeAttrs, selection);
    if (selection.multiple) {
        treeAttrs.checkable = true;
    }
    treeAttrs.onSelect = (keys) => {
        const {$data = []} = reference.state;
        if (1 === keys.length) {
            const $select = Ux.elementUnique($data, 'key', keys[0]);
            reference.setState({$select})
        }
    };
    return treeAttrs;
}