import Ux from 'ux'

const readConfig = (reference = {}) => {
    const {$key = "grid"} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const grid = Ux.fromHoc(ref, $key);
    return Ux.clone(grid);
};

const initGrid = (reference = {}) => {
    const config = readConfig(reference);
    console.info(config);
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
const updateGrid = (reference = {}, prevProps = {}) => {
    // 更新表数据
    _updateList(reference);
    // 更新左边树
    _updateTree(reference);
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