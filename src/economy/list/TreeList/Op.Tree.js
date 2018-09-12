import Ux from "ux";
import Init from './Op.Init';

const _initLoop = (data = {}, array = []) => {
    const item = array.filter(item => item.branch === data.key);
    if (0 < item.length) {
        item.forEach(each => each.children = _initLoop(each, array));
    }
    return Ux.clone(item);
};
const _initTree = (reference = {}, data = []) => {
    let source = Ux.clone(data);
    const {iItemData} = reference.state;
    // 新增
    if (iItemData) {
        // 追加新项
        source.push(iItemData);
    }
    // 查找根节点
    const $data = source.filter(item => !item.branch);
    // 遍历根节点
    $data.forEach(dataItem => dataItem.children = _initLoop(dataItem, source));
    return $data;
};
const initTree = (reference) => {
    const tree = Init.readTree(reference);
    if (tree && tree.hasOwnProperty("branch")) {
        // 呈现的默认信息
        if (!tree.key) tree.key = "key";
        if (!tree.display) tree.display = "name";
        // 读取树相关信息
        const {$tree} = reference.props;
        if ($tree.is()) {
            const data = $tree.to();
            // 使用config构造树信息
            data.forEach(item => Ux.itObject(tree, (field, value) => {
                if (item && item.hasOwnProperty(value)) {
                    item[field] = item[value];
                }
            }));
            // 生成新的树
            return _initTree(reference, data);
        } else return [];
    } else return [];
};
export default {
    initTree
}