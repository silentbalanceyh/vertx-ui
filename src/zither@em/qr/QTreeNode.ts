/**
 * 查询节点专用
 */
interface QTreeNode {
    /*
     * 当前节点转换成：
     * {} 的结构
     */
    to(): Object;

    /*
     * 判断当前节点是否 leaf 叶节点
     */
    leaf(): boolean;

    /*
     * 判断当前节点是否 合法 节点
     */
    valid(): Boolean;
}

export default QTreeNode;
