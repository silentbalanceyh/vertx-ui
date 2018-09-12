import Ux from "ux";
import Init from './Op.Init';

const _initLoop = (data = {}, array = []) => {
    const item = array.filter(item => item.branch === data.key);
    if (0 < item.length) {
        item.forEach(each => each.children = _initLoop(each, array));
    }
    return Ux.clone(item);
};
const _initTree = (data = []) => {
    // 查找根节点
    const $data = Ux.clone(data).filter(item => !item.branch);
    // 遍历根节点
    $data.forEach(dataItem => dataItem.children = _initLoop(dataItem, data));
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
            return _initTree(data);
        } else return [];
    } else return [];
};
const onSelect = (reference, edit = false) => (key, selected, record) => {
    // 特殊处理，只有Key的长度大于0即有内容被选中时才触发，防止清空
    if (edit && 0 < key.length) {
        // 设置selected的数据
        reference.setState({
            selected: key,
            // 切换时一定会清空
            iKey: undefined,
            iItemData: undefined,
            iItemText: undefined,
        })
    }
};
export default {
    initTree,
    onSelect,
}