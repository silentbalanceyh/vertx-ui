import Ux from 'ux'

const readConfig = (reference = {}) => {
    const {$key = "grid"} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const grid = Ux.fromHoc(ref, $key);
    return Ux.clone(grid);
};

const initGrid = (reference = {}) => {
    // 是否所有都展开

};

const _updateList = (reference) => {
    const record = reference.props["$list"];
    const {$query} = reference.props;
    if ($query.is()) {
        if (undefined === record) {
            // 初始化查询
            const {rxSearch} = reference.props;
            if (rxSearch) rxSearch($query.to());
        }
    }
};
const _updateTree = (reference) => {
    const tree = reference.props["$tree"];
    if (undefined === tree || !tree.is()) {
        // 初始化树
        const {rxTree} = reference.props;
        if (rxTree) rxTree();
    }
};
const _updateExpand = (reference = {}) => {
    const options = readOptions(reference);
    const expand = Boolean(options['tree.expand.default']);
    if (expand) {
        const {$tree} = reference.props;
        if ($tree.is()) {
            const {expandedKeys} = reference.state;
            // 为undefined时更新（第一次）
            if (!expandedKeys) {
                const tree = readTree(reference);
                if (!tree.key) tree.key = "key";
                const result = $tree.to().map(item => item[tree.key]);
                reference.setState({expandedKeys: result});
            }
        }
    }
};
const updateGrid = (reference = {}, prevProps = {}) => {
    // 更新表数据
    _updateList(reference);
    // 更新左边树
    _updateTree(reference);
    // 更新展开信息
    _updateExpand(reference);
};
const readOptions = (reference) => {
    let options = readConfig(reference).options;
    const {rxInject} = reference.props;
    if (rxInject) {
        return rxInject(options);
    } else {
        return options;
    }
};
const readTree = (reference) => readConfig(reference).tree;

export default {
    initGrid,
    updateGrid,
    readConfig,
    readOptions,
    readTree
}