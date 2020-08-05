import Ux from 'ux';

export default (reference, config = {}) => {
    const treeAttrs = {};
    const {selection = {}} = config;
    Object.assign(treeAttrs, selection);
    /*
     * showLine 配置
     */
    if (selection.hasOwnProperty('showLine')) {
        treeAttrs.showLine = selection.showLine;
    }
    if (selection.multiple) {
        /*
         * 多选（在render周期构造 onCheck）
         */
        treeAttrs.checkable = true;
    } else {
        /*
         * 单选
         */
        treeAttrs.onSelect = (keys) => {
            const {$data = []} = reference.state;
            if (1 === keys.length) {
                const $keySet = Ux.elementUnique($data, 'key', keys[0]);
                reference.setState({$keySet})
            } else {
                // 反选
                reference.setState({$keySet: undefined});
            }
        };
    }
    return treeAttrs;
}