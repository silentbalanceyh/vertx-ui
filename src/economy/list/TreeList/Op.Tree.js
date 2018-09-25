import Ux from "ux";
import Init from './Op.Init';

const _initLoop = (data = {}, array = [], level = 1) => {
    const item = array.filter(item => item.branch === data.key);
    if (0 < item.length) {
        item.forEach(each => {
            // Level专用
            each._level = level;
            each.children = _initLoop(each, array, (level + 1));
        });
    }
    return Ux.clone(item).sort((left, right) => Ux.sorterAsc(left, right, "display"));
};
const _initTree = (reference = {}, data = []) => {
    let source = Ux.clone(data);
    // 1.是否包含了ROOT节点？
    const options = Init.readOptions(reference);
    if (options["tree.root"]) {
        // 2.由于包含了ROOT，所以需要预处理source
        const root = {};
        root.key = "_ROOT_";
        root.display = options["tree.root"];
        root._level = 0;
        // 3.原始数据降级
        source.filter(item => !item.branch).forEach(item => item.branch = "_ROOT_");
        source.push(root);
    }
    const {iItemData, keyword} = reference.state;
    // 如果是keyword则要执行过滤
    if (keyword) {
        source = source.filter(item => 0 < item.display.indexOf(keyword) || "_ROOT_" === item.key);
    }
    // 新增：需要先执行keyword过滤，然后添加新的Item，新项item.display是没有内容的
    if (iItemData) {
        // 追加新项
        source.push(iItemData);
    }
    // 查找根节点
    const $data = source.filter(item => !item.branch);
    // 遍历根节点
    $data.forEach(dataItem => dataItem.children = _initLoop(dataItem, source, 1));
    // 数据源
    return $data.sort((left, right) => Ux.sorterAsc(left, right, "display"));
};
const initTree = (reference) => {
    const treeData = Init.readTreeMapping(reference);
    // 读取树相关信息
    const {$tree} = reference.props;
    if ($tree.is()) {
        const data = $tree.to();
        // 使用config构造树信息
        data.forEach(item => Ux.itObject(treeData, (field, value) => {
            // 特殊_key处理
            if ("key" === field && field !== value) {
                item["_key"] = item[field];
            }
            if (item && item.hasOwnProperty(value)) {
                // 表达式语法
                item[field] = item[value];
            } else if (0 <= value.indexOf(":")) {
                // 表达式语法，不判断hasOwnProperty
                item[field] = Ux.formatExpr(value, item, true);
            }
        }));
        // 生成新的树
        return _initTree(reference, data);
    }
};
export default {
    initTree
}