import Ux from 'ux';
import U from 'underscore';

const readConfig = (reference = {}) => {
    const {$key = "grid"} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const grid = Ux.fromHoc(ref, $key);
    return Ux.clone(grid);
};
const _updateTree = (reference) => {
    const tree = reference.props["$tree"];
    if (undefined === tree || !tree.is()) {
        // 初始化树
        const {rxTree, rxParamTree} = reference.props;
        if (rxTree) {
            let params = {};
            if (U.isFunction(rxParamTree)) {
                params = rxParamTree();
            }
            rxTree(params);
        }
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
                if (options["tree.root"]) {
                    result.push("_ROOT_");
                }
                reference.setState({expandedKeys: result});
            }
        }
    }
};
const updateGrid = (reference = {}, prevProps = {}) => {
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
const readTreeMapping = (reference) => {
    const tree = readTree(reference);
    Ux.E.fxTerminal(tree && !tree.hasOwnProperty("branch"), 10089, tree["branch"]);
    // 呈现的默认信息
    if (!tree.key) tree.key = "key";
    if (!tree.display) tree.display = "name";
    return tree;
};
const initTable = (reference) => {
    const table = readConfig(reference).table;
    if (table) {
        table.bordered = true;
        table.pagination = false;
    }
    return table;
};
const initTabs = (reference) => {
    const options = readOptions(reference);
    const tabs = {items: []};
    const tab = {};
    if (options["tab.list"]) {
        tab.key = Ux.randomUUID();
        tab.tab = options["tab.list"];
        tabs.items.push(tab);
        tabs.defaultActiveKey = tab.key;
    }
    return tabs;
};
export default {
    updateGrid,
    readConfig,
    readOptions,
    // readCriteria,
    readTree,
    readTreeMapping,
    // 右边表格
    initTable,
    initTabs
};